import ProjectsGrid from "@/components/ProjectsGrid";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const content = await getContent();

  return (
    <section className="min-h-screen pt-12 md:pt-14">
      <ProjectsGrid section={content.projects} />
    </section>
  );
}
