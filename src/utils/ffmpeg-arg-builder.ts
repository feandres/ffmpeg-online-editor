import type { EditConfig } from "./edit-config";

export function buildFFmpegArgs(
  config: EditConfig,
  input: string,
  output: string
): string[] {
  const args: string[] = ["-i", input];

  // Corte (trim)
  if (config.trim_start && config.trim_end) {
    args.push("-ss", config.trim_start, "-to", config.trim_end);
  }

  const filters: string[] = [];

  // Resize
  if (config.resize_width && config.resize_height) {
    filters.push(`scale=${config.resize_width}:${config.resize_height}`);
  }

  // Rotate
  if (config.rotate_angle && config.rotate_angle !== "0") {
    const angleMap: Record<string, string> = {
      "90": "transpose=1",
      "180": "transpose=1,transpose=1",
      "270": "transpose=2",
    };
    const rotateExpr = angleMap[config.rotate_angle];
    if (rotateExpr) filters.push(rotateExpr);
  }

  // Ajustes de cor
  const brightness = config.brightness ? parseInt(config.brightness) : 50;
  const contrast = config.contrast ? parseInt(config.contrast) : 50;
  const saturation = config.saturation ? parseInt(config.saturation) : 50;

  if (brightness !== 50 || contrast !== 50 || saturation !== 50) {
    filters.push(
      `eq=brightness=${(brightness - 50) / 100}:contrast=${
        contrast / 50
      }:saturation=${saturation / 50}`
    );
  }

  if (filters.length > 0) {
    args.push("-vf", filters.join(","));
  }

  // Volume
  if (config.volume_level) {
    const vol = parseFloat(config.volume_level);
    if (!isNaN(vol)) {
      args.push("-af", `volume=${vol / 100}`);
    }
  }

  // Formato de saída
  args.push(output);

  return args;
}
