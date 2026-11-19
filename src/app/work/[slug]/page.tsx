import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { getProject, projects } from "@/content/projects";
import { DiagramStepper } from "@/components/diagram-stepper";
import { Serif } from "@/components/section";
import { contactHref, site } from "@/lib/site";
import { jsonLd } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  const title = `${p.name}: ${p.kicker.split("·")[0].trim()} case study`;
  return {
    title,
    description: p.tagline,
    alternates: { canonical: `/work/${p.slug}` },
    openGraph: { type: "article", url: `/work/${p.slug}`, title, description: p.tagline },
    twitter: { card: "summary_large_image", title, description: p.tagline },
  };
}

export default async function CaseStudy({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();

  const i = projects.indexOf(p);
  const next = projects[(i + 1) % projects.length];

  const structured = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        name: p.name,
        headline: p.tagline,
        abstract: p.summary,
        url: `${site.url}/work/${p.slug}`,
        dateCreated: p.year.slice(0, 4),
        keywords: p.stack.join(", "),
        creator: { "@id": `${site.url}/#person` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Work", item: `${site.url}/#work` },
          { "@type": "ListItem", position: 2, name: p.name, item: `${site.url}/work/${p.slug}` },
        ],
      },
    ],
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(structured)} />

      <header className="mx-auto max-w-6xl px-5 pt-12 sm:px-8 sm:pt-16">
        <nav aria-label="Breadcrumb" className="text-subtle font-mono text-xs">
          <Link href="/#work" className="hover:text-fg">
            ← All work
          </Link>
        </nav>
        <p className="text-signal mt-10 font-mono text-xs tracking-wider uppercase">{p.kicker}</p>
        <ViewTransition name={`title-${p.slug}`} share="morph" default="none">
          <h1 className="mt-4 text-5xl leading-none font-semibold tracking-[-0.04em] sm:text-7xl">{p.name}</h1>
        </ViewTransition>
        <p className="text-muted mt-6 max-w-3xl text-xl leading-relaxed sm:text-2xl">{p.tagline}</p>

        <dl className="border-line bg-line mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border text-sm md:grid-cols-4">
          {[
            ["Role", p.role],
            ["Team", p.team],
            ["Timeline", p.year],
            ["Status", p.status],
          ].map(([k, v]) => (
            <div key={k} className="bg-bg flex flex-col-reverse p-5">
              <dd className="mt-1 font-medium">{v}</dd>
              <dt className="text-subtle font-mono text-xs">{k}</dt>
            </div>
          ))}
        </dl>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <ViewTransition name={`diagram-${p.slug}`} share="morph" default="none">
          <div>
            <DiagramStepper project={p} />
          </div>
        </ViewTransition>
        <p className="text-subtle mt-3 text-center font-mono text-xs">
          Use ← → or the buttons to follow a request through the system.
        </p>
      </div>

      <div className="mx-auto grid max-w-6xl gap-14 px-5 pb-24 sm:px-8 lg:grid-cols-[1fr_280px]">
        <div className="max-w-[68ch] space-y-16">
          <section aria-labelledby="tldr">
            <h2 id="tldr" className="sr-only">
              Summary
            </h2>
            <p className="text-lg leading-relaxed">{p.summary}</p>
          </section>

          <Block id="problem" label="01" title="The problem">
            <p>{p.problem}</p>
          </Block>

          <Block id="constraints" label="02" title="Constraints that shaped it">
            <ul className="space-y-3">
              {p.constraints.map((c) => (
                <li key={c} className="flex gap-3">
                  <span aria-hidden="true" className="bg-signal mt-2.5 size-1.5 shrink-0 rounded-full" />
                  {c}
                </li>
              ))}
            </ul>
          </Block>

          <Block id="decisions" label="03" title="Key decisions & trade-offs">
            <div className="space-y-6">
              {p.decisions.map((d) => (
                <div key={d.title} className="border-line rounded-2xl border p-6">
                  <h3 className="text-fg font-semibold">{d.title}</h3>
                  <p className="mt-2">{d.body}</p>
                  <p className="border-line mt-4 border-t pt-4 text-sm">
                    <span className="text-subtle font-mono text-xs tracking-wider uppercase">Rejected · </span>
                    {d.rejected}
                  </p>
                </div>
              ))}
            </div>
          </Block>

          <Block id="hardest" label="04" title={`Hardest part: ${p.hardest.title.toLowerCase()}`}>
            <p>{p.hardest.body}</p>
          </Block>

          <Block id="results" label="05" title="Results">
            <ul className="space-y-3">
              {p.results.map((r) => (
                <li key={r} className="flex gap-3">
                  <span aria-hidden="true" className="text-signal">
                    ✓
                  </span>
                  {r}
                </li>
              ))}
            </ul>
          </Block>

          <Block id="next-time" label="06" title="What I'd do differently">
            <p>{p.nextTime}</p>
          </Block>
        </div>

        <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start" aria-label="Project facts">
          <div>
            <h2 className="text-subtle font-mono text-xs tracking-wider uppercase">By the numbers</h2>
            <dl className="mt-4 space-y-4">
              {p.metrics.map((m) => (
                <div key={m.label} className="border-line flex flex-col-reverse border-b pb-4">
                  <dt className="text-subtle text-sm">{m.label}</dt>
                  <dd className="text-3xl font-semibold tracking-tight tabular-nums">{m.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <h2 className="text-subtle font-mono text-xs tracking-wider uppercase">Stack</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {p.stack.map((s) => (
                <li key={s} className="border-line text-muted rounded-full border px-3 py-1 font-mono text-xs">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <footer className="border-line border-t">
        <div className="mx-auto grid max-w-6xl gap-px px-5 py-16 sm:px-8 md:grid-cols-2 md:gap-10">
          <div className="py-4">
            <p className="text-3xl leading-tight font-semibold">
              Need something <Serif>like this?</Serif>
            </p>
            <a
              href={contactHref}
              className="bg-signal text-signal-fg mt-6 inline-flex h-12 items-center gap-2 rounded-full px-6 font-medium transition-transform hover:-translate-y-0.5"
            >
              Let&apos;s talk <span aria-hidden="true">→</span>
            </a>
          </div>
          <Link
            href={`/work/${next.slug}`}
            className="spotlight group border-line hover:border-line-strong rounded-2xl border p-6 transition-colors"
          >
            <p className="text-subtle font-mono text-xs tracking-wider uppercase">Next case study →</p>
            <p className="mt-3 text-2xl font-semibold">{next.name}</p>
            <p className="text-muted mt-2 text-sm">{next.tagline}</p>
          </Link>
        </div>
      </footer>
    </article>
  );
}

function Block({ id, label, title, children }: { id: string; label: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="reveal">
      <p className="text-signal font-mono text-xs">{label}</p>
      <h2 id={id} className="mt-2 text-2xl font-semibold sm:text-3xl">
        {title}
      </h2>
      <div className="text-muted mt-5 space-y-4 leading-relaxed">{children}</div>
    </section>
  );
}
