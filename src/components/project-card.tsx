import Link from "next/link";
import { ViewTransition } from "react";
import type { Project } from "@/content/projects";
import { Diagram } from "./diagram";
import { cn } from "@/lib/utils";

export function ProjectCard({ project: p, featured = false }: { project: Project; featured?: boolean }) {
  return (
    <Link
      href={`/work/${p.slug}`}
      className={cn(
        "spotlight reveal group border-line bg-elevated/40 hover:border-line-strong flex flex-col overflow-hidden rounded-2xl border transition-colors",
        featured && "md:col-span-2 md:grid md:grid-cols-[1.1fr_1fr]",
      )}
    >
      <ViewTransition name={`diagram-${p.slug}`} share="morph" default="none">
        <div className={cn("bg-grid border-line border-b p-4", featured && "md:order-2 md:border-b-0 md:border-l md:p-8")}>
          <Diagram nodes={p.diagram.nodes} edges={p.diagram.edges} compact title={`${p.name} system diagram`} />
        </div>
      </ViewTransition>
      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <p className="text-subtle font-mono text-xs tracking-wider uppercase">{p.kicker}</p>
        <ViewTransition name={`title-${p.slug}`} share="morph" default="none">
          <h3 className={cn("mt-3 font-semibold", featured ? "text-3xl sm:text-4xl" : "text-2xl")}>{p.name}</h3>
        </ViewTransition>
        <p className="text-muted mt-3 leading-relaxed">{p.tagline}</p>
        <dl className="border-line mt-6 grid grid-cols-2 gap-4 border-t pt-6">
          {p.metrics.slice(0, featured ? 4 : 2).map((m) => (
            <div key={m.label} className="flex flex-col-reverse">
              <dt className="text-subtle mt-0.5 text-xs">{m.label}</dt>
              <dd className="text-xl font-semibold tracking-tight tabular-nums">{m.value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-auto flex items-center justify-between gap-4 pt-8 text-sm">
          <span className="text-subtle truncate font-mono text-xs">{p.stack.slice(0, 4).join(" · ")}</span>
          <span className="text-fg shrink-0 font-medium">
            Read case study <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
          </span>
        </p>
      </div>
    </Link>
  );
}
