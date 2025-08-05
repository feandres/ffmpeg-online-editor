import type { EditConfig } from "./edit-config";

// Função para sanitizar caminhos de arquivo
const sanitizePath = (path: string): string => path.replace(/[^a-zA-Z0-9._-]/g, "");

// Função para validar formato de tempo (ex.: "00:00:05.500" ou segundos)
const isValidTimeFormat = (time: string): boolean => {
  return /^(\d{2}:)?\d{2}:\d{2}(\.\d{1,3})?$/.test(time) || !isNaN(Number(time));
};

// Funções modulares para construir filtros
const buildScaleFilter = (config: EditConfig): string | null => {
  if (config.resize_width && config.resize_height) {
    const width = parseInt(config.resize_width);
    const height = parseInt(config.resize_height);
    if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
      throw new Error("Invalid resize dimensions: must be positive numbers");
    }
    return `scale=${width}:${height}`;
  }
  return null;
};

const buildRotateFilter = (config: EditConfig): string | null => {
  if (config.rotate_angle && config.rotate_angle !== "0") {
    const angleMap: Record<string, string> = {
      "90": "transpose=1",
      "180": "transpose=1,transpose=1",
      "270": "transpose=2",
    };
    const rotateExpr = angleMap[config.rotate_angle];
    if (!rotateExpr) {
      throw new Error(`Invalid rotate_angle: ${config.rotate_angle}`);
    }
    return rotateExpr;
  }
  return null;
};

const buildColorAdjustFilter = (config: EditConfig): string | null => {
  const brightness = config.brightness ? parseInt(config.brightness) : 50;
  const contrast = config.contrast ? parseInt(config.contrast) : 50;
  const saturation = config.saturation ? parseInt(config.saturation) : 50;

  if (
    isNaN(brightness) || isNaN(contrast) || isNaN(saturation) ||
    brightness < 0 || brightness > 100 ||
    contrast < 0 || contrast > 100 ||
    saturation < 0 || saturation > 100
  ) {
    throw new Error("Color adjustment values must be between 0 and 100");
  }

  if (brightness !== 50 || contrast !== 50 || saturation !== 50) {
    return `eq=brightness=${(brightness - 50) / 100}:contrast=${contrast / 50}:saturation=${saturation / 50}`;
  }
  return null;
};

const buildVolumeFilter = (config: EditConfig): string | null => {
  if (config.volume_level) {
    const vol = parseFloat(config.volume_level);
    if (isNaN(vol) || vol < 0 || vol > 200) {
      throw new Error("Invalid volume_level: must be between 0 and 200");
    }
    return `volume=${vol / 100}`;
  }
  return null;
};

export function buildFFmpegArgs(
  config: EditConfig,
  input: string,
  output: string
): string[] {
  // Mínimo necessário: entrada e saída
  const args: string[] = ["-i", sanitizePath(input)];

  // Corte (trim)
  if (config.trim_start && config.trim_end) {
    if (!isValidTimeFormat(config.trim_start) || !isValidTimeFormat(config.trim_end)) {
      throw new Error("Invalid trim time format");
    }
    const start = parseFloat(config.trim_start);
    const end = parseFloat(config.trim_end);
    if (start >= end) {
      throw new Error("trim_start must be less than trim_end");
    }
    args.push("-ss", config.trim_start, "-to", config.trim_end);
  }

  // Filtros de vídeo
  const filterBuilders: ((config: EditConfig) => string | null)[] = [
    buildScaleFilter,
    buildRotateFilter,
    buildColorAdjustFilter,
  ];
  const filters = filterBuilders
    .map((builder) => builder(config))
    .filter((f): f is string => f !== null);

  if (filters.length > 0) {
    args.push("-vf", filters.join(","));
  }

  // Filtro de áudio (volume)
  const volumeFilter = buildVolumeFilter(config);
  if (volumeFilter) {
    args.push("-af", volumeFilter);
  }

  // Configurações específicas por formato
  const formatToCodec: Record<string, string[]> = {
    mp4: ["-c:v", "libx264", "-crf", "23"],
    webm: ["-c:v", "libvpx", "-b:v", "1M"],
    gif: ["-loop", "0"],
    avi: ["-c:v", "mpeg4"],
    mov: ["-c:v", "libx264", "-crf", "23"],
    mkv: ["-c:v", "libx264", "-crf", "23"],
  };

  if (!config.format || !formatToCodec[config.format]) {
    throw new Error(`Unsupported output format: ${config.format || "undefined"}`);
  }
  args.push(...formatToCodec[config.format]);

  // Saída
  args.push(sanitizePath(output));

  return args;
}