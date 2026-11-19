import { getProject, projects } from "@/content/projects";
import { ogImage, ogSize } from "@/lib/og";

export const dynamic = "force-static";
export const alt = "Case study";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug)!;
  return ogImage({ eyebrow: `Case study · ${p.kicker}`, title: p.name, subtitle: p.tagline });
}
