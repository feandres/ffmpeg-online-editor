import { useState } from "react";
import { Button } from "@/components/ui/button";

const t = {
  previewTitle: "Visualização do Resultado",
  previewDesc: "Veja e baixe o conteúdo gerado",
  noFile: "Nenhum arquivo gerado.",
  download: "Baixar",
  restart: "Recomeçar",
  videoNotSupported: "Seu navegador não suporta este formato de vídeo.",
  downloadError: "Falha ao baixar o arquivo.",
  fileLoadError: "Falha ao carregar o arquivo.",
};

interface ViewPageProps {
  outputUrl: string | null;
  format: string;
  onRestart: () => void;
}

function getMimeType(format: string) {
  const map: Record<string, string> = {
    mp4: "video/mp4",
    webm: "video/webm",
    avi: "video/avi",
    mov: "video/quicktime",
    gif: "image/gif",
  };
  return map[format.toLowerCase()] || "application/octet-stream";
}

function isValidFormat(format: string) {
  return ["mp4", "webm", "avi", "mov", "gif"].includes(format.toLowerCase());
}

function DownloadButton({
  outputUrl,
  format,
  disabled,
  onError,
}: {
  outputUrl: string;
  format: string;
  disabled?: boolean;
  onError?: () => void;
}) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    setDownloading(true);
    try {
      const response = await fetch(outputUrl);
      if (!response.ok) throw new Error();
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `resultado.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      onError && onError();
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Button
      className="w-full h-12 text-lg font-semibold bg-green-600 hover:bg-green-700"
      aria-label={`${t.download} ${format.toUpperCase()}`}
      onClick={handleDownload}
      disabled={disabled || downloading}
      type="button"
    >
      {downloading ? "..." : `${t.download} ${format.toUpperCase()}`}
    </Button>
  );
}

export function ViewPage({ outputUrl, format, onRestart }: ViewPageProps) {
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [fileLoadError, setFileLoadError] = useState<string | null>(null);

  if (!outputUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-slate-500" role="alert">{t.noFile}</p>
      </div>
    );
  }

  if (!isValidFormat(format)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-red-500" role="alert">
          Formato não suportado: {format}
        </p>
        <Button onClick={onRestart} variant="outline" className="ml-4">
          {t.restart}
        </Button>
      </div>
    );
  }

  const isVideo = ["mp4", "webm", "avi", "mov"].includes(format.toLowerCase());
  const isGif = format.toLowerCase() === "gif";
  const mimeType = getMimeType(format);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-800 mb-3">
            {t.previewTitle}
          </h1>
          <p className="text-slate-600 text-lg">{t.previewDesc}</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center gap-6">
          {fileLoadError && (
            <div className="w-full text-center text-red-500" role="alert">
              {t.fileLoadError}
            </div>
          )}

          {isVideo && (
            <video
              controls
              className="w-full max-h-[60vh] rounded-lg"
              aria-label="Visualização do vídeo"
              onError={() => setFileLoadError(t.fileLoadError)}
            >
              <source src={outputUrl} type={mimeType} />
              {t.videoNotSupported}
            </video>
          )}

          {isGif && (
            <img
              src={outputUrl}
              alt="Visualização do GIF"
              className="w-full max-w-md max-h-[60vh] rounded-lg"
              onError={() => setFileLoadError(t.fileLoadError)}
            />
          )}

          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mt-6">
            <div className="w-full sm:w-auto">
              <DownloadButton
                outputUrl={outputUrl}
                format={format}
                disabled={!!fileLoadError}
                onError={() => setDownloadError(t.downloadError)}
              />
              {downloadError && (
                <div className="text-center text-red-500 mt-2" role="alert">
                  {downloadError}
                </div>
              )}
            </div>

            <Button
              onClick={onRestart}
              variant="outline"
              className="w-full sm:w-auto h-12 text-lg"
              aria-label={t.restart}
              type="button"
            >
              {t.restart}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}