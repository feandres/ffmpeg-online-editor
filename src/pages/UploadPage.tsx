import React, { useState, useCallback } from "react";
import { Upload, FileVideo, XCircle } from "lucide-react";

const t = {
  dropHere: "Solte o vídeo aqui",
  dragOrClick: "Arraste e solte seu vídeo aqui",
  orClick: "ou clique para selecionar um arquivo",
  instructions: "Você poderá aplicar múltiplos ajustes e exportar como GIF ou outro formato de vídeo.",
  actions: "Ações disponíveis:",
  cut: "Corte de vídeo (início e duração)",
  resize: "Redimensionamento (aspect ratio)",
  rotate: "Rotação",
  text: "Texto sobre o vídeo",
  color: "Ajuste de brilho, contraste e saturação",
  volume: "Controle de volume",
  formats: "Formatos de entrada suportados: MP4, AVI, MOV, WMV, FLV, WebM, MKV, M4V, 3GP",
  maxSize: "Tamanho máximo: 100MB",
  bestResults: "Para melhores resultados, use vídeos com até 30 segundos",
  selectVideo: "Selecionar vídeo",
  remove: "Remover arquivo",
  invalidType: "Por favor, selecione um arquivo de vídeo válido (MP4, AVI, MOV, etc.)",
  tooBig: "O arquivo é muito grande. Por favor, selecione um vídeo menor que 100MB.",
  corrupted: "O arquivo parece estar corrompido ou não contém vídeo.",
  durationExceeded: "O vídeo excede o limite de duração permitido (30 segundos).",
  selected: "Arquivo selecionado:",
  clear: "Limpar seleção",
};

type Props = {
  onFileSelected: (file: File) => void;
  onFileClear?: () => void;
  disabled: boolean;
  inputName: string | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
};

export function UploadPage({
  onFileSelected,
  onFileClear,
  disabled,
  inputName,
  fileInputRef,
}: Props) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validating, setValidating] = useState(false);

  // Validação de tipo de arquivo
  const isValidVideoFile = (file: File): boolean => {
    const validTypes = [
      "video/mp4",
      "video/avi",
      "video/mov",
      "video/wmv",
      "video/flv",
      "video/webm",
      "video/mkv",
      "video/m4v",
      "video/3gp",
    ];
    return (
      validTypes.includes(file.type) ||
      file.name.match(/\.(mp4|avi|mov|wmv|flv|webm|mkv|m4v|3gp)$/i) !== null
    );
  };

  // Validação de duração e corrupção
  const validateVideoFile = async (file: File): Promise<string | null> => {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(file);
      const video = document.createElement("video");
      let resolved = false;
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        if (resolved) return;
        resolved = true;
        URL.revokeObjectURL(url);
        if (!video.duration || isNaN(video.duration)) {
          resolve(t.corrupted);
        } else if (video.duration > 30) {
          resolve(t.durationExceeded);
        } else {
          resolve(null);
        }
      };
      video.onerror = () => {
        if (resolved) return;
        resolved = true;
        URL.revokeObjectURL(url);
        resolve(t.corrupted);
      };
      video.src = url;
    });
  };

  // Função para lidar com arquivos selecionados
  const handleFileSelection = useCallback(
    async (file: File) => {
      setError(null);
      if (!isValidVideoFile(file)) {
        setError(t.invalidType);
        return;
      }
      const maxSize = 100 * 1024 * 1024; // 100MB
      if (file.size > maxSize) {
        setError(t.tooBig);
        return;
      }
      setValidating(true);
      const validationError = await validateVideoFile(file);
      setValidating(false);
      if (validationError) {
        setError(validationError);
        return;
      }
      setError(null);
      onFileSelected(file);
    },
    [onFileSelected]
  );

  // Handlers para drag and drop
  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) {
        setIsDragOver(true);
      }
    },
    [disabled]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      if (disabled) return;

      const files = e.dataTransfer.files;
      if (files && files[0]) {
        handleFileSelection(files[0]);
      }
    },
    [disabled, handleFileSelection]
  );

  // Handler para input file
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileSelection(files[0]);
    }
  };

  // Handler para limpar seleção
  const handleClear = () => {
    setError(null);
    if (onFileClear) onFileClear();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Acessibilidade: foco por teclado
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if ((e.key === "Enter" || e.key === " ") && !disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* Hidden file input */}
      <input
        ref={fileInputRef as any}
        type="file"
        accept="video/*,.mp4,.avi,.mov,.wmv,.flv,.webm,.mkv,.m4v,.3gp"
        disabled={disabled}
        onChange={handleFileInputChange}
        aria-label={t.selectVideo}
        className="hidden"
        tabIndex={-1}
      />

      {/* Drag and Drop Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 outline-none
          ${
            isDragOver && !disabled
              ? "border-blue-500 bg-blue-50 scale-105"
              : "border-gray-300 hover:border-gray-400"
          }
          ${
            disabled
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer hover:bg-gray-50"
          }
          ${inputName ? "pointer-events-none opacity-70" : ""}
        `}
        role="button"
        tabIndex={0}
        aria-disabled={disabled}
        aria-label={t.selectVideo}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && !inputName && fileInputRef.current?.click()}
        onKeyDown={handleKeyDown}
        style={{ outline: isDragOver ? "2px solid #3b82f6" : undefined }}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          {isDragOver && !disabled ? (
            <>
              <Upload className="w-12 h-12 text-blue-500 animate-bounce" />
              <p className="text-lg font-medium text-blue-600">{t.dropHere}</p>
            </>
          ) : (
            <>
              <FileVideo className="w-12 h-12 text-gray-400" />
              <div className="space-y-2">
                <p className="text-lg font-medium text-gray-700">{t.dragOrClick}</p>
                <p className="text-sm text-gray-500">{t.orClick}</p>
              </div>
            </>
          )}
        </div>
        {/* Overlay when dragging */}
        {isDragOver && !disabled && (
          <div className="absolute inset-0 bg-blue-500 bg-opacity-10 rounded-lg pointer-events-none" />
        )}
      </div>

      {/* Mensagem de erro/validação */}
      <div aria-live="polite" className="min-h-[1.5em]">
        {error && (
          <div className="text-red-600 text-sm flex items-center gap-2 mt-1" role="alert">
            <XCircle className="w-4 h-4" /> {error}
          </div>
        )}
        {validating && (
          <div className="text-blue-600 text-sm flex items-center gap-2 mt-1">
            <span className="animate-spin w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full" /> Validando vídeo...
          </div>
        )}
      </div>

      {/* Arquivo selecionado */}
      {inputName && (
        <div className="flex items-center gap-2 bg-gray-100 rounded px-3 py-2 mt-2" aria-live="polite">
          <FileVideo className="w-5 h-5 text-gray-500" />
          <span className="text-sm text-gray-700">{t.selected} <b>{inputName}</b></span>
          <button
            type="button"
            className="ml-auto px-2 py-1 rounded bg-red-100 hover:bg-red-200 text-red-700 text-xs font-semibold transition"
            onClick={handleClear}
            aria-label={t.clear}
            tabIndex={0}
          >
            {t.remove}
          </button>
        </div>
      )}

      {/* Instructions */}
      <div className="space-y-2">
        <p className="text-sm text-gray-600">{t.instructions}</p>
        <div className="text-xs text-gray-500 space-y-1">
          <p>{t.actions}</p>
          <ul className="list-disc list-inside ml-2">
            <li>{t.cut}</li>
            <li>{t.resize}</li>
            <li>{t.rotate}</li>
            <li>{t.text}</li>
            <li>{t.color}</li>
            <li>{t.volume}</li>
          </ul>
          <p>• {t.formats}</p>
          <p>• {t.maxSize}</p>
          <p>• {t.bestResults}</p>
        </div>
      </div>
    </div>
  );
}