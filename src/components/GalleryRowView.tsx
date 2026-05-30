import Image from "next/image";
import { Fragment } from "react";
import { DEFAULT_ROW_HEIGHT } from "@/lib/gallery-weights";
import type { GalleryItem, GalleryRow } from "@/lib/types";

interface GalleryRowViewProps {
  row: GalleryRow;
  editable?: boolean;
  selectedItemId?: string | null;
  onSelectItem?: (itemId: string) => void;
  onResizeHandlePointerDown?: (
    leftIndex: number,
    event: React.PointerEvent<HTMLDivElement>
  ) => void;
}

function ResizeHandle({
  leftIndex,
  onPointerDown,
}: {
  leftIndex: number;
  onPointerDown?: (
    leftIndex: number,
    event: React.PointerEvent<HTMLDivElement>
  ) => void;
}) {
  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label="Drag to resize"
      title="Drag to resize"
      className="group/handle flex w-4 shrink-0 cursor-col-resize touch-none items-center justify-center self-stretch"
      onPointerDown={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onPointerDown?.(leftIndex, event);
      }}
    >
      <div className="flex h-14 items-center gap-[2px] rounded-full border border-neutral-200/90 bg-white/90 px-[5px] py-2 shadow-[0_1px_3px_rgba(0,0,0,0.06)] backdrop-blur-sm transition hover:border-neutral-300 hover:shadow-[0_2px_6px_rgba(0,0,0,0.08)]">
        <span className="h-8 w-px rounded-full bg-neutral-300 transition group-hover/handle:bg-neutral-500" />
        <span className="h-8 w-px rounded-full bg-neutral-300 transition group-hover/handle:bg-neutral-500" />
      </div>
    </div>
  );
}

function GalleryCell({
  item,
  height,
  editable,
  selected,
  onSelect,
}: {
  item: GalleryItem;
  height: number;
  editable?: boolean;
  selected?: boolean;
  onSelect?: () => void;
}) {
  return (
    <figure
      className={`min-w-0 ${editable ? "cursor-pointer" : ""} ${
        selected ? "rounded ring-2 ring-neutral-900 ring-offset-2" : ""
      }`}
      onClick={editable ? onSelect : undefined}
    >
      <div
        className="relative w-full overflow-hidden bg-neutral-100"
        style={{ height }}
      >
        {item.image ? (
          <Image
            src={item.image}
            alt={item.title || "Artwork"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
            draggable={false}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm font-medium text-neutral-400">
            {editable ? "Click to add image" : ""}
          </div>
        )}
      </div>
      <figcaption className={`mt-2 ${editable ? "font-sans" : "font-serif"}`}>
        {item.title && (
          <p className="text-xs leading-snug text-neutral-900 md:text-sm">
            {editable ? item.title : <em>{item.title}</em>}
          </p>
        )}
        {item.description && (
          <p className="mt-0.5 text-xs leading-snug text-neutral-600 md:text-sm">
            {item.description}
          </p>
        )}
      </figcaption>
    </figure>
  );
}

export function GalleryRowView({
  row,
  editable = false,
  selectedItemId,
  onSelectItem,
  onResizeHandlePointerDown,
}: GalleryRowViewProps) {
  const height = row.height ?? DEFAULT_ROW_HEIGHT;

  if (editable) {
    return (
      <div className="flex w-full items-start">
        {row.items.map((item, index) => (
          <Fragment key={item.id}>
            <div
              className="min-w-0"
              style={{ flex: `${item.widthWeight ?? 1} 1 0%` }}
            >
              <GalleryCell
                item={item}
                height={height}
                editable
                selected={selectedItemId === item.id}
                onSelect={() => onSelectItem?.(item.id)}
              />
            </div>
            {index < row.items.length - 1 && (
              <ResizeHandle
                leftIndex={index}
                onPointerDown={onResizeHandlePointerDown}
              />
            )}
          </Fragment>
        ))}
      </div>
    );
  }

  return (
    <div className="flex w-full items-start gap-3 md:gap-4">
      {row.items.map((item) => (
        <div
          key={item.id}
          className="min-w-0"
          style={{ flex: `${item.widthWeight ?? 1} 1 0%` }}
        >
          <GalleryCell item={item} height={height} />
        </div>
      ))}
    </div>
  );
}
