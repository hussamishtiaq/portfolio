"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Vitals = {
  ttfb?: number;
  fcp?: number;
  lcp?: number;
  cls?: number;
  inp?: number;
  js?: number;
  total?: number;
  requests?: number;
};

// Google's "good" thresholds.
const GOOD = { ttfb: 800, fcp: 1800, lcp: 2500, cls: 0.1, inp: 200 };

function observe(type: string, cb: (entries: PerformanceEntryList) => void, extra: object = {}) {
  try {
    const po = new PerformanceObserver((list) => cb(list.getEntries()));
    po.observe({ type, buffered: true, ...extra } as PerformanceObserverInit);
    return () => po.disconnect();
  } catch {
    return () => {};
  }
}

/**
 * Real Core Web Vitals for *this* page load, measured in the visitor's browser
 * with the native Performance APIs. No library, no screenshot.
 */
export function LiveVitals({ className }: { className?: string }) {
  const [v, setV] = useState<Vitals>({});

  useEffect(() => {
    const set = (patch: Vitals) => setV((prev) => ({ ...prev, ...patch }));
    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    if (nav) set({ ttfb: Math.max(0, nav.responseStart - nav.startTime) });

    const weigh = () => {
      const res = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
      const js = res.filter((r) => r.initiatorType === "script" || r.name.endsWith(".js"));
      const bytes = (list: PerformanceResourceTiming[]) =>
        list.reduce((n, r) => n + (r.encodedBodySize || r.transferSize || 0), 0);
      set({
        js: bytes(js),
        total: bytes(res) + (nav?.encodedBodySize ?? 0),
        requests: res.length + 1,
      });
    };

    let cls = 0;
    const offs = [
      observe("paint", (es) => {
        const fcp = es.find((e) => e.name === "first-contentful-paint");
        if (fcp) set({ fcp: fcp.startTime });
      }),
      observe("largest-contentful-paint", (es) => set({ lcp: es[es.length - 1].startTime })),
      observe("layout-shift", (es) => {
        for (const e of es as (PerformanceEntry & { value: number; hadRecentInput: boolean })[]) {
          if (!e.hadRecentInput) cls += e.value;
        }
        set({ cls });
      }),
      observe(
        "event",
        (es) => {
          const worst = Math.max(
            ...es.filter((e) => (e as PerformanceEntry & { interactionId?: number }).interactionId).map((e) => e.duration),
          );
          if (Number.isFinite(worst)) setV((p) => ({ ...p, inp: Math.max(p.inp ?? 0, worst) }));
        },
        { durationThreshold: 16 },
      ),
    ];
    set({ cls: 0 });

    weigh();
    const t = window.setTimeout(weigh, 2500);
    if (document.readyState !== "complete") window.addEventListener("load", weigh, { once: true });
    return () => {
      offs.forEach((off) => off());
      window.clearTimeout(t);
      window.removeEventListener("load", weigh);
    };
  }, []);

  const rows: { label: string; hint: string; value: string; good?: boolean }[] = [
    { label: "TTFB", hint: "Time to first byte", value: ms(v.ttfb), good: lt(v.ttfb, GOOD.ttfb) },
    { label: "FCP", hint: "First contentful paint", value: ms(v.fcp), good: lt(v.fcp, GOOD.fcp) },
    { label: "LCP", hint: "Largest contentful paint", value: ms(v.lcp), good: lt(v.lcp, GOOD.lcp) },
    {
      label: "CLS",
      hint: "Cumulative layout shift",
      value: v.cls === undefined ? "…" : v.cls.toFixed(3),
      good: lt(v.cls, GOOD.cls),
    },
    {
      label: "INP",
      hint: "Interaction to next paint: click anything",
      value: v.inp === undefined ? "click me" : ms(v.inp),
      good: lt(v.inp, GOOD.inp),
    },
    { label: "JS", hint: "JavaScript downloaded (compressed)", value: kb(v.js) },
    { label: "Weight", hint: "Everything this page downloaded", value: kb(v.total) },
    { label: "Requests", hint: "Network requests", value: v.requests === undefined ? "…" : String(v.requests) },
  ];

  return (
    <figure
      className={cn(
        "border-line bg-elevated/70 overflow-hidden rounded-xl border font-mono text-[13px] shadow-sm",
        className,
      )}
      aria-label="Live performance of this page, measured in your browser"
    >
      <figcaption className="border-line text-subtle flex items-center justify-between gap-3 border-b px-4 py-2.5 text-[11px] tracking-wider uppercase">
        <span className="flex items-center gap-2">
          <span className="relative flex size-2">
            <span className="animate-ping-soft bg-signal absolute inline-flex size-full rounded-full" />
            <span className="bg-signal relative inline-flex size-2 rounded-full" />
          </span>
          this page, measured live
        </span>
        <span aria-hidden="true">perf.observe()</span>
      </figcaption>
      <dl className="grid grid-cols-2">
        {rows.map((r, i) => (
          <div
            key={r.label}
            title={r.hint}
            className={cn(
              "flex items-baseline justify-between gap-2 px-4 py-2.5",
              i % 2 === 0 && "border-line border-r",
              i < rows.length - 2 && "border-line border-b",
            )}
          >
            <dt className="text-subtle">{r.label}</dt>
            <dd className={cn("tabular-nums", r.good === true ? "text-signal" : r.good === false ? "text-amber-500" : "text-fg")}>
              {r.value}
            </dd>
          </div>
        ))}
      </dl>
    </figure>
  );
}

const lt = (n: number | undefined, max: number) => (n === undefined ? undefined : n <= max);
const ms = (n?: number) => (n === undefined ? "…" : n < 1000 ? `${Math.round(n)} ms` : `${(n / 1000).toFixed(2)} s`);
const kb = (n?: number) => (n === undefined ? "…" : `${(n / 1024).toFixed(n < 10240 ? 1 : 0)} KB`);
