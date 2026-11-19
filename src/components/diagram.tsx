import type { DiagramEdge, DiagramNode } from "@/content/projects";
import { cn } from "@/lib/utils";

const W = 150;
const H = 54;

/** Pure SVG system diagram. Server-renderable; active edges animate with CSS only. */
export function Diagram({
  nodes,
  edges,
  active,
  compact = false,
  className,
  title,
}: {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  active?: Set<string>;
  compact?: boolean;
  className?: string;
  title: string;
}) {
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const lit = (e: DiagramEdge) => !active || active.has(`${e.from}>${e.to}`);
  const litNodes = new Set(edges.filter(lit).flatMap((e) => [e.from, e.to]));

  return (
    <svg viewBox="0 0 820 420" role="img" aria-label={title} className={cn("h-auto w-full select-none", compact && "diagram-idle", className)}>
      <title>{title}</title>
      <g fill="none" strokeWidth={compact ? 2 : 1.5} strokeLinecap="round">
        {edges.map((e) => {
          const a = byId[e.from];
          const b = byId[e.to];
          const on = lit(e);
          return (
            <g key={`${e.from}>${e.to}`}>
              <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="var(--line-strong)" />
              <line
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke="var(--signal)"
                className={cn("edge-flow transition-opacity duration-300", on ? "opacity-100" : "opacity-0")}
              />
            </g>
          );
        })}
      </g>
      {nodes.map((n) => {
        const on = !active || litNodes.has(n.id);
        return (
          <g key={n.id} transform={`translate(${n.x - W / 2} ${n.y - H / 2})`}>
            <rect
              width={W}
              height={H}
              rx={n.tone === "store" ? 27 : 10}
              fill="var(--bg-elevated)"
              stroke={on && active ? "var(--signal)" : "var(--line-strong)"}
              strokeWidth={1.25}
            />
            <text
              opacity={on ? 1 : 0.4}
              x={W / 2}
              y={compact ? 33 : 24}
              textAnchor="middle"
              fill="var(--fg)"
              fontSize={compact ? 17 : 14}
              fontWeight={600}
              fontFamily="var(--font-sans)"
            >
              {n.label}
            </text>
            {!compact && n.sub && (
              <text
                opacity={on ? 1 : 0.4}
                x={W / 2}
                y={41}
                textAnchor="middle"
                fill="var(--fg-subtle)"
                fontSize={10.5}
                fontFamily="var(--font-mono)"
              >
                {n.sub.length > 23 ? `${n.sub.slice(0, 22)}…` : n.sub}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
