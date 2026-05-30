"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { GalleryRowView } from "@/components/GalleryRowView";
import {
  applyWeightsToRow,
  DEFAULT_ROW_HEIGHT,
  ensureSectionRows,
  redistributeOnAdd,
  resizeAdjacentWeights,
} from "@/lib/gallery-weights";
import type { GalleryItem, GalleryRow, GallerySection } from "@/lib/types";

function emptyItem(): GalleryItem {
  return {
    id: `item-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    image: "",
    title: "",
    description: "",
    widthWeight: 1,
  };
}

function ImageUploadField({
  value,
  onChange,
  password,
}: {
  value: string;
  onChange: (url: string) => void;
  password: string;
}) {
  const [uploading, setUploading] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "x-admin-password": password },
        body: formData,
      });
      const data = await res.json();
      if (data.url) onChange(data.url);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div className="space-y-3">
      {value && (
        <div className="relative h-32 w-full overflow-hidden rounded border border-neutral-200 bg-neutral-50">
          <Image src={value} alt="Preview" fill className="object-cover" sizes="400px" />
        </div>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <label className="cursor-pointer rounded border border-neutral-300 bg-white px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50">
          {uploading ? "Uploading…" : "Upload image"}
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Or paste image URL"
          className="min-w-0 flex-1 rounded border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>
    </div>
  );
}

export default function SelectedWorksEditor({
  section,
  onChange,
  password,
}: {
  section: GallerySection;
  onChange: (section: GallerySection) => void;
  password: string;
}) {
  const rows = ensureSectionRows(section.rows);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const rowRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const updateRows = useCallback(
    (nextRows: GalleryRow[]) => {
      onChange({ rows: nextRows });
    },
    [onChange]
  );

  const updateRow = useCallback(
    (rowIndex: number, row: GalleryRow) => {
      const nextRows = rows.map((r, i) => (i === rowIndex ? row : r));
      updateRows(nextRows);
    },
    [rows, updateRows]
  );

  const findSelection = useCallback(() => {
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const itemIndex = rows[rowIndex].items.findIndex((item) => item.id === selectedItemId);
      if (itemIndex >= 0) {
        return { rowIndex, itemIndex, item: rows[rowIndex].items[itemIndex] };
      }
    }
    return null;
  }, [rows, selectedItemId]);

  const selection = findSelection();

  function updateSelectedItem(field: keyof GalleryItem, value: string | number) {
    if (!selection) return;
    const row = rows[selection.rowIndex];
    const items = row.items.map((item, i) =>
      i === selection.itemIndex ? { ...item, [field]: value } : item
    );
    updateRow(selection.rowIndex, { ...row, items, columns: items.length });
  }

  function removeSelectedItem() {
    if (!selection) return;
    const row = rows[selection.rowIndex];
    const items = redistributeOnAdd(
      row.items.filter((_, i) => i !== selection.itemIndex)
    );

    if (items.length === 0) {
      updateRows(rows.filter((_, i) => i !== selection.rowIndex));
    } else {
      updateRow(selection.rowIndex, { ...row, items, columns: items.length });
    }
    setSelectedItemId(null);
  }

  function addRow() {
    const item = emptyItem();
    updateRows([
      ...rows,
      {
        id: `row-${Date.now()}`,
        columns: 1,
        height: DEFAULT_ROW_HEIGHT,
        items: [item],
      },
    ]);
    setSelectedItemId(item.id);
  }

  function addImageToRow(rowIndex: number) {
    const row = rows[rowIndex];
    if (row.items.length >= 4) return;

    const item = emptyItem();
    const items = redistributeOnAdd([...row.items, item]);
    updateRow(rowIndex, { ...row, items, columns: items.length });
    setSelectedItemId(item.id);
  }

  function removeRow(rowIndex: number) {
    updateRows(rows.filter((_, i) => i !== rowIndex));
    setSelectedItemId(null);
  }

  function handleResizePointerDown(
    rowIndex: number,
    leftIndex: number,
    event: React.PointerEvent<HTMLDivElement>
  ) {
    event.preventDefault();
    event.stopPropagation();

    const row = rows[rowIndex];
    const rowEl = rowRefs.current[row.id];
    if (!rowEl) return;

    const startX = event.clientX;
    const containerWidth = rowEl.offsetWidth;
    const startWeights = row.items.map((item) => item.widthWeight ?? 1);

    function onPointerMove(moveEvent: PointerEvent) {
      const delta = moveEvent.clientX - startX;
      const nextWeights = resizeAdjacentWeights(
        startWeights,
        leftIndex,
        delta,
        containerWidth
      );
      updateRow(rowIndex, applyWeightsToRow(row, nextWeights));
    }

    function onPointerUp() {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    }

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-500">
          Drag the edges between images to resize. Images in each row always fill the width.
        </p>
        <button
          type="button"
          onClick={addRow}
          className="rounded border border-neutral-300 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
        >
          + Add row
        </button>
      </div>

      {rows.length === 0 && (
        <div className="rounded-lg border border-dashed border-neutral-300 py-16 text-center">
          <p className="text-sm text-neutral-500">No rows yet.</p>
          <button
            type="button"
            onClick={addRow}
            className="mt-4 rounded bg-neutral-900 px-4 py-2 text-sm text-white hover:bg-neutral-800"
          >
            + Add row
          </button>
        </div>
      )}

      {rows.map((row, rowIndex) => (
        <div key={row.id} className="group space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wide text-neutral-400">
              Row {rowIndex + 1}
            </span>
            <button
              type="button"
              onClick={() => removeRow(rowIndex)}
              className="text-xs text-red-600 hover:text-red-800"
            >
              Remove row
            </button>
          </div>

          <div ref={(el) => { rowRefs.current[row.id] = el; }}>
            <GalleryRowView
              row={row}
              editable
              selectedItemId={selectedItemId}
              onSelectItem={setSelectedItemId}
              onResizeHandlePointerDown={(leftIndex, event) =>
                handleResizePointerDown(rowIndex, leftIndex, event)
              }
            />
          </div>

          {row.items.length < 4 && (
            <button
              type="button"
              onClick={() => addImageToRow(rowIndex)}
              className="rounded border border-dashed border-neutral-300 px-4 py-2 text-sm text-neutral-600 hover:border-neutral-400 hover:text-neutral-900"
            >
              + Image
            </button>
          )}
        </div>
      ))}

      {selection && (
        <div className="sticky bottom-4 rounded-lg border border-neutral-200 bg-white p-6 shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-medium text-neutral-900">Edit image</h3>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSelectedItemId(null)}
                className="text-sm text-neutral-500 hover:text-neutral-800"
              >
                Close
              </button>
              <button
                type="button"
                onClick={removeSelectedItem}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <ImageUploadField
              value={selection.item.image}
              onChange={(url) => updateSelectedItem("image", url)}
              password={password}
            />
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-600">
                  Title
                </label>
                <input
                  type="text"
                  value={selection.item.title}
                  onChange={(e) => updateSelectedItem("title", e.target.value)}
                  className="w-full rounded border border-neutral-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-600">
                  Description
                </label>
                <input
                  type="text"
                  value={selection.item.description}
                  onChange={(e) => updateSelectedItem("description", e.target.value)}
                  className="w-full rounded border border-neutral-300 px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
