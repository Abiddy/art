import Image from "next/image";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const content = await getContent();
  const paragraphs = content.about.text.split("\n\n").filter(Boolean);

  return (
    <section className="min-h-screen pt-12 pb-10 md:pt-14">
      <div className="mx-auto grid max-w-5xl grid-cols-1 items-start gap-8 px-4 md:grid-cols-2 md:gap-12 md:px-8">
        <div className="relative aspect-square w-full max-w-md mx-auto md:mx-0">
          <Image
            src={content.about.image}
            alt={content.artistName}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div className="space-y-6 font-serif text-base leading-relaxed text-neutral-700 md:text-lg md:leading-loose">
          {paragraphs.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
