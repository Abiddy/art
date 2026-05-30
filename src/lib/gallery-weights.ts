import type { GalleryItem, GalleryRow } from "./types";

export const DEFAULT_ROW_HEIGHT = 280;
export const MIN_WEIGHT_RATIO = 0.12;

export function equalWeights(count: number): number[] {
  return Array.from({ length: count }, () => 1);
}

export function ensureItemWeights(items: GalleryItem[]): GalleryItem[] {
  const hasWeights = items.every(
    (item) => item.widthWeight != null && item.widthWeight > 0
  );

  if (hasWeights) return items;

  return items.map((item) => ({
    ...item,
    widthWeight: item.widthWeight && item.widthWeight > 0 ? item.widthWeight : 1,
  }));
}

export function ensureRow(row: GalleryRow): GalleryRow {
  const items = ensureItemWeights(row.items);
  return {
    ...row,
    columns: items.length,
    height: row.height ?? DEFAULT_ROW_HEIGHT,
    items,
  };
}

export function ensureSectionRows(rows: GalleryRow[]): GalleryRow[] {
  return rows.map(ensureRow);
}

export function gridTemplateColumns(items: GalleryItem[]): string {
  return items.map((item) => `${item.widthWeight ?? 1}fr`).join(" ");
}

export function resizeAdjacentWeights(
  weights: number[],
  leftIndex: number,
  deltaPixels: number,
  containerWidth: number
): number[] {
  if (leftIndex < 0 || leftIndex >= weights.length - 1) return weights;

  const next = [...weights];
  const pairTotal = next[leftIndex] + next[leftIndex + 1];
  const deltaWeight = (deltaPixels / containerWidth) * pairTotal;
  const minWeight = pairTotal * MIN_WEIGHT_RATIO;

  let left = next[leftIndex] + deltaWeight;
  let right = next[leftIndex + 1] - deltaWeight;

  if (left < minWeight) {
    left = minWeight;
    right = pairTotal - minWeight;
  }
  if (right < minWeight) {
    right = minWeight;
    left = pairTotal - minWeight;
  }

  next[leftIndex] = left;
  next[leftIndex + 1] = right;
  return next;
}

export function redistributeOnAdd(items: GalleryItem[]): GalleryItem[] {
  return items.map((item) => ({ ...item, widthWeight: 1 }));
}

export function applyWeightsToRow(row: GalleryRow, weights: number[]): GalleryRow {
  return {
    ...row,
    items: row.items.map((item, index) => ({
      ...item,
      widthWeight: weights[index] ?? item.widthWeight ?? 1,
    })),
  };
}
