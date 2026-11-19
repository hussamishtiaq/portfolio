"use client";

import { useState } from "react";
import type { Project } from "@/content/projects";
import { Diagram } from "./diagram";
import { cn } from "@/lib/utils";

/** Keyboard-steppable walk through a request's path across the system. */
export function DiagramStepper({ project }: { project: Project }) {
  const { nodes, edges, steps } = project.diagram;
  const [i, setI] = useState(0);
  const go = (n: number) => setI((n + steps.length) % steps.length);
  const active = new Set(steps[i].edges.map(([a, b]) => `${a}>${b}`));

  return (
    <div
      className="border-line bg-bg overflow-hidden rounded-2xl border"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          go(i + 1);
        }
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          go(i - 1);
        }
      }}
    >
      <div className="bg-grid px-2 py-4 sm:px-6">
        <Diagram
          nodes={nodes}
          edges={edges}
          active={active}
          title={`${project.name} architecture, step ${i + 1}: ${steps[i].caption}`}
        />
      </div>
      <div className="border-line flex flex-col gap-4 border-t p-4 sm:flex-row sm:items-center sm:p-5">
        <p aria-live="polite" className="text-muted min-h-[3lh] flex-1 text-sm leading-relaxed sm:min-h-[2lh]">
          <span className="text-signal mr-2 font-mono text-xs">
            {String(i + 1).padStart(2, "0")}/{String(steps.length).padStart(2, "0")}
          </span>
          {steps[i].caption}
        </p>
        <div className="flex shrink-0 items-center gap-3">
          <div className="flex gap-1.5" aria-label="Architecture steps" role="group">
            {steps.map((s, n) => (
              <button
                key={n}
                type="button"
                aria-current={n === i ? "step" : undefined}
                aria-label={`Step ${n + 1}`}
                onClick={() => setI(n)}
                className="grid size-6 place-items-center"
              >
                <span
                  className={cn(
                    "block h-1.5 rounded-full transition-all duration-300",
                    n === i ? "bg-signal w-5" : "bg-line-strong w-1.5",
                  )}
                />
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => go(i - 1)}
            aria-label="Previous step"
            className="border-line text-muted hover:text-fg grid size-9 place-items-center rounded-md border"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => go(i + 1)}
            aria-label="Next step"
            className="border-line bg-fg text-bg grid size-9 place-items-center rounded-md border hover:opacity-90"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
