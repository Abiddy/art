import Image from "next/image";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const content = await getContent();

  return (
    <section className="relative h-screen w-full">
      <Image
        src={content.home.heroImage}
        alt={content.artistName}
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0 flex items-center justify-center">
        <h1 className="px-6 text-center font-serif text-4xl font-light tracking-wide text-white md:text-6xl lg:text-7xl">
          {content.artistName}
        </h1>
      </div>
    </section>
  );
}
