export type EditConfig = {
  trim_start?: string;
  trim_end?: string;
  resize_width?: string;
  resize_height?: string;
  rotate_angle?: string;
  volume_level?: string;
  format?: string;
  brightness?: string;
  contrast?: string;
  saturation?: string;
  [key: string]: string | undefined;
};
