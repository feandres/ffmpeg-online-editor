import { useState, useRef, useEffect, useCallback } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import coreURL from "@ffmpeg/core?url";
import wasmURL from "@ffmpeg/core/wasm?url";

import LoadingPage from "./pages/LoadingPage";
import { UploadPage } from "./pages/UploadPage";
import EditingPage from "./pages/EditingPage";
import { ViewPage } from "./pages/ViewPage";

import { buildFFmpegArgs } from "@/utils/ffmpeg-arg-builder";
import type { EditConfig } from "@/utils/edit-config";

const ffmpeg = new FFmpeg();

type Stage = "loading" | "upload" | "edit" | "preview";

export default function App() {
  const [stage, setStage] = useState<Stage>("loading");
  const [ready, setReady] = useState(false);
  const [processing, setProcessing] = useState(false);
  
  const [inputName, setInputName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const currentObjectUrl = useRef<string | null>(null);
  const uploadedFileRef = useRef<File | null>(null);

  const [editConfig, setEditConfig] = useState<EditConfig | null>(null);

  useEffect(() => {
    let canceled = false;

    const loadFFmpeg = async () => {
      try {
        ffmpeg.on("log", ({ message }) => {
          console.debug("[ffmpeg log]", message);
        });

        ffmpeg.on("progress", (p) => {
          console.debug("[ffmpeg progress]", p);
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


  const applyEdit = useCallback(async (config: EditConfig) => {
    if (!uploadedFileRef.current) return;
    setProcessing(true);
    setError(null);
    setOutputUrl(null);

    try {
      await ffmpeg.writeFile(
        "input.mp4",
        await fetchFile(uploadedFileRef.current)
      );

      const outputName = `output.${config.format}`;
      const args = buildFFmpegArgs(config, "input.mp4", outputName);
      await ffmpeg.exec(args);

      const data = await ffmpeg.readFile(outputName);
      if (!data || data.length === 0) throw new Error("Nenhuma saída gerada");

      const mime =
        config.format === "gif"
          ? "image/gif"
          : config.format === "mp4"
          ? "video/mp4"
          : config.format === "webm"
          ? "video/webm"
          : "video/avi";

      const blob = new Blob([data], { type: mime });
      const url = URL.createObjectURL(blob);
      if (currentObjectUrl.current) {
        URL.revokeObjectURL(currentObjectUrl.current);
      }
      currentObjectUrl.current = url;

      setOutputUrl(url);
      setEditConfig(config);
      setStage("preview");
    } catch (e: any) {
      setEditConfig(null);
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
              FFmpeg Online Video Editor
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
                Configure as opções de edição para seu vídeo
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
        format={editConfig?.format || "mp4"}
        onRestart={goBackToUpload}
      />
    );
  }

  return <div>Estado desconhecido</div>;
}
