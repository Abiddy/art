export const ASPECT_RATIO_OPTIONS = [
  { value: "auto", label: "Original (natural size)" },
  { value: "1:1", label: "Square (1:1)" },
  { value: "3:4", label: "Portrait (3:4)" },
  { value: "4:3", label: "Landscape (4:3)" },
  { value: "2:3", label: "Tall (2:3)" },
  { value: "3:2", label: "Wide (3:2)" },
  { value: "16:9", label: "Cinematic (16:9)" },
] as const;

export type ImageAspectRatio = (typeof ASPECT_RATIO_OPTIONS)[number]["value"];

export function toCssAspectRatio(ratio: ImageAspectRatio): string | undefined {
  if (ratio === "auto") return undefined;
  const [width, height] = ratio.split(":");
  return `${width} / ${height}`;
}
