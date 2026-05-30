import Image from "next/image";
import { DEFAULT_ROW_HEIGHT, gridTemplateColumns } from "@/lib/gallery-weights";
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
        selected ? "ring-2 ring-neutral-900 ring-offset-2" : ""
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
            sizes="(max-width: 768px) 100vw, 50vw"
            draggable={false}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-neutral-400">
            {editable ? "Click to add image" : ""}
          </div>
        )}
      </div>
      <figcaption className="mt-2 font-serif">
        {item.title && (
          <p className="text-xs leading-snug text-neutral-900 md:text-sm">
            <em>{item.title}</em>
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

  return (
    <div
      className="grid w-full gap-3 md:gap-4"
      style={{ gridTemplateColumns: gridTemplateColumns(row.items) }}
    >
      {row.items.map((item, index) => (
        <div key={item.id} className="relative min-w-0">
          <GalleryCell
            item={item}
            height={height}
            editable={editable}
            selected={selectedItemId === item.id}
            onSelect={() => onSelectItem?.(item.id)}
          />
          {editable && index < row.items.length - 1 && (
            <div
              role="separator"
              aria-orientation="vertical"
              aria-label="Resize image"
              className="absolute -right-2 top-0 z-10 flex h-full w-4 cursor-col-resize items-center justify-center touch-none"
              onPointerDown={(event) => onResizeHandlePointerDown?.(index, event)}
            >
              <div className="h-12 w-1 rounded-full bg-neutral-900/30 transition group-hover:bg-neutral-900/50" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
