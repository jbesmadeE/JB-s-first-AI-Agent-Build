export const STYLES = [
  { id: "Photorealistic", label: "Photorealistic" },
  { id: "Studio Anime", label: "Studio Anime" },
  { id: "3D Isometric", label: "3D Isometric" },
  { id: "Oil Painting", label: "Oil Painting" },
] as const;

export const ASPECTS = [
  { id: "Square", label: "Square", width: 1024, height: 1024, pro: false },
  { id: "Wide", label: "Wide", width: 1280, height: 720, pro: true },
  { id: "Portrait", label: "Portrait", width: 720, height: 1280, pro: true },
] as const;

export const STEPS = [
  { id: 1, label: "Enhancing prompt" },
  { id: 2, label: "Directing style" },
  { id: 3, label: "Rendering pixels" },
] as const;

export type AspectId = (typeof ASPECTS)[number]["id"];
export type StyleId = (typeof STYLES)[number]["id"];

export const DIMENSIONS: Record<string, { width: number; height: number }> = {
  Square: { width: 1024, height: 1024 },
  Wide: { width: 1280, height: 720 },
  Portrait: { width: 720, height: 1280 },
};
