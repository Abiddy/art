import GalleryGrid from "@/components/GalleryGrid";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function SelectedWorksPage() {
  const content = await getContent();

  return (
    <section className="min-h-screen pt-12 md:pt-14">
      <GalleryGrid section={content.selectedWorks} />
    </section>
  );
}
