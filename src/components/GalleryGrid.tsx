import { GalleryRowView } from "@/components/GalleryRowView";
import { ensureSectionRows } from "@/lib/gallery-weights";
import type { GallerySection } from "@/lib/types";

interface GalleryGridProps {
  section: GallerySection;
}

export default function GalleryGrid({ section }: GalleryGridProps) {
  const rows = ensureSectionRows(section.rows);

  return (
    <div className="space-y-6 px-4 pb-10 md:space-y-8 md:px-8">
      {rows.map((row) => (
        <GalleryRowView key={row.id} row={row} />
      ))}
    </div>
  );
}
