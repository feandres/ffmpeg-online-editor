import { useState, useRef, useEffect, useCallback } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import coreURL from "@ffmpeg/core?url";
import wasmURL from "@ffmpeg/core/wasm?url";

import LoadingPage from "./pages/LoadingPage";
import { UploadPage } from "./pages/UploadPage";
import  EditingPage from "./pages/EditingPage";
import { ViewPage } from "./pages/ViewPage";

const ffmpeg = new FFmpeg();

type Stage = "loading" | "upload" | "edit" | "preview";

export default function App() {
  const [stage, setStage] = useState<Stage>("loading");
  const [ready, setReady] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [inputName, setInputName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [format, setFormat] = useState<string>("mp4"); // New state for format

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const currentObjectUrl = useRef<string | null>(null);
  const uploadedFileRef = useRef<File | null>(null);

  useEffect(() => {
    let canceled = false;

    const loadFFmpeg = async () => {
      try {
        ffmpeg.on("log", ({ message }) => {
          console.log("FFmpeg log:", message);
        });
        await ffmpeg.load({ coreURL, wasmURL });
        if (!canceled) {
          setReady(true);
          setStage("upload");
        }
      } catch (e: any) {
        if (!canceled) {
          setError(`Falha ao carregar FFmpeg: ${e.message || e.toString()}`);
        }
      }
    };

    loadFFmpeg();

    return () => {
      canceled = true;
      ffmpeg.terminate();
      if (currentObjectUrl.current) {
        URL.revokeObjectURL(currentObjectUrl.current);
      }
    };
  }, []);

  const onFileSelected = useCallback((file: File) => {
    setInputName(file.name);
    uploadedFileRef.current = file;
    setStage("edit");
  }, []);

  const onFileClear = useCallback(() => {
    setInputName(null);
    uploadedFileRef.current = null;
    if (currentObjectUrl.current) {
      URL.revokeObjectURL(currentObjectUrl.current);
      currentObjectUrl.current = null;
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const goBackToUpload = useCallback(() => {
    setStage("upload");
  }, []);

  const applyEdit = useCallback(async (command: string) => {
    if (!uploadedFileRef.current) return;
    setProcessing(true);
    setError(null);
    setOutputUrl(null);

    try {
      await ffmpeg.writeFile(
        "input.mp4",
        await fetchFile(uploadedFileRef.current)
      );

      const outputExt = command.includes("-c:v gif") ? "gif" : "mp4";
      const outputName = `output.${outputExt}`;
      const args = command.trim().split(/\s+/);
      const finalArgs = ["-i", "input.mp4", ...args, outputName];

      console.log("Executing FFmpeg command:", finalArgs);
      await ffmpeg.exec(finalArgs);

      console.log("Files in FS after exec:", await ffmpeg.listDir("/"));

      const data = await ffmpeg.readFile(outputName);
      if (!data || data.length === 0) throw new Error("Nenhuma saída gerada");

      const mime = outputExt === "gif" ? "image/gif" : "video/mp4";
      const blob = new Blob([data], { type: mime });
      const url = URL.createObjectURL(blob);
      if (currentObjectUrl.current) {
        URL.revokeObjectURL(currentObjectUrl.current);
      }
      currentObjectUrl.current = url;

      setOutputUrl(url);
      setFormat(outputExt); // Set format for ViewPage
      setStage("preview");
    } catch (e: any) {
      console.error("FFmpeg error:", e);
      setError(e.message || String(e));
    } finally {
      setProcessing(false);
    }
  }, []);

  if (!ready || stage === "loading") return <LoadingPage error={error} />;

  if (stage === "upload") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-slate-800 mb-3">
              FFmpeg Online
            </h1>
            <p className="text-slate-600 text-lg">
              Faça upload do seu vídeo para começar a edição
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <UploadPage
              onFileSelected={onFileSelected}
              onFileClear={onFileClear}
              disabled={processing}
              inputName={inputName}
              fileInputRef={fileInputRef}
            />
          </div>
        </div>
      </div>
    );
  }

  if (stage === "edit") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-800 mb-3">
                Editando: {inputName}
              </h1>
              <p className="text-slate-600 text-lg">
                Insira um comando FFmpeg para processar seu vídeo
              </p>
            </div>
            <button
              onClick={goBackToUpload}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              ← Voltar ao Upload
            </button>
          </div>

          <EditingPage onApply={applyEdit} processing={processing} />
        </div>
      </div>
    );
  }

  if (stage === "preview") {
    return (
      <ViewPage
        outputUrl={outputUrl}
        format={format}
        onRestart={goBackToUpload}
      />
    );
  }

  return <div>Estado desconhecido</div>;
}