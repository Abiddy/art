import Image from "next/image";
import type { GallerySection } from "@/lib/types";

interface ProjectsGridProps {
  section: GallerySection;
}

const columnClasses: Record<number, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
};

export default function ProjectsGrid({ section }: ProjectsGridProps) {
  return (
    <div className="space-y-8 px-4 pb-10 md:space-y-10 md:px-8">
      {section.rows.map((row) => (
        <div
          key={row.id}
          className={`grid grid-cols-1 gap-4 md:gap-6 ${columnClasses[row.columns] ?? "md:grid-cols-3"}`}
        >
          {row.items.map((item) => (
            <figure key={item.id}>
              <div className="relative aspect-square w-full overflow-hidden bg-neutral-100">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : null}
              </div>
              <figcaption className="mt-2 font-serif">
                {item.title && (
                  <p className="text-xs leading-snug text-neutral-900 md:text-sm">
                    {item.title}
                    {item.description ? `, ${item.description}` : ""}
                  </p>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      ))}
    </div>
  );
}
