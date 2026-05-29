import Image from "next/image";
import type { GallerySection } from "@/lib/types";

interface GalleryGridProps {
  section: GallerySection;
}

export default function GalleryGrid({ section }: GalleryGridProps) {
  return (
    <div className="space-y-6 px-4 pb-10 md:space-y-8 md:px-8">
      {section.rows.map((row) => (
        <div key={row.id} className="flex flex-wrap items-start gap-x-4 gap-y-3 md:gap-x-6">
          {row.items.map((item) => (
            <figure key={item.id} className="shrink-0">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.title}
                  width={800}
                  height={600}
                  className="h-[200px] w-auto object-contain md:h-[280px]"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              ) : (
                <div className="flex h-[200px] w-48 items-center justify-center bg-neutral-100 md:h-[280px]" />
              )}
              <figcaption className="mt-2 max-w-xs font-serif">
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
          ))}
        </div>
      ))}
    </div>
  );
}
