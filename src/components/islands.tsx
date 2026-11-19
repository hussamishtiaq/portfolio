"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { openPalette } from "./palette-loader";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

/** One delegated listener drives every `.spotlight` surface: no per-card JS. */
export function SpotlightTracker() {
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest?.<HTMLElement>(".spotlight");
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--x", `${e.clientX - r.left}px`);
      el.style.setProperty("--y", `${e.clientY - r.top}px`);
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => document.removeEventListener("pointermove", onMove);
  }, []);
  return null;
}

export function PaletteButton({ compact = false }: { compact?: boolean }) {
  return (
    <button
      type="button"
      onClick={openPalette}
      aria-label="Open command menu"
      aria-keyshortcuts="Control+K Meta+K"
      className={cn(
        "border-line bg-elevated/60 text-muted hover:border-line-strong hover:text-fg flex items-center gap-2 rounded-md border px-2.5 text-sm transition-colors",
        compact ? "h-8" : "h-9",
      )}
    >
      <span className="hidden sm:inline">Menu</span>
      <svg
        className="sm:hidden"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <path d="M4 7h16M4 12h16M4 17h10" />
      </svg>
      <kbd className="border-line hidden rounded border px-1.5 font-mono text-[11px] sm:inline">⌘K</kbd>
    </button>
  );
}

const subscribeClock = (cb: () => void) => {
  const t = setInterval(cb, 15_000);
  return () => clearInterval(t);
};

export function LocalTime() {
  const time = useSyncExternalStore(
    subscribeClock,
    () => new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: site.timezone }).format(new Date()),
    () => "--:--",
  );
  return <time className="tabular-nums">{time}</time>;
}

const subscribeOnline = (cb: () => void) => {
  window.addEventListener("online", cb);
  window.addEventListener("offline", cb);
  return () => {
    window.removeEventListener("online", cb);
    window.removeEventListener("offline", cb);
  };
};

export function OfflineStatus() {
  const online = useSyncExternalStore(
    subscribeOnline,
    () => navigator.onLine,
    () => true,
  );
  const [cached, setCached] = useState(false);
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.ready.then(() => setCached(true)).catch(() => {});
  }, []);
  return (
    <span className="inline-flex items-center gap-2">
      <span className={cn("size-1.5 rounded-full", online ? "bg-signal" : "bg-amber-500")} aria-hidden="true" />
      {online ? (cached ? "Online · cached for offline" : "Online") : "Offline: served from the service worker"}
    </span>
  );
}

export function CopyEmail({ className }: { className?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(site.email);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }}
      className={cn(
        "border-line-strong text-muted hover:text-fg inline-flex h-12 items-center gap-3 rounded-full border px-5 font-mono text-sm transition-colors",
        className,
      )}
    >
      <span>{site.email}</span>
      <span aria-live="polite" className={cn("text-xs", copied ? "text-signal" : "text-subtle")}>
        {copied ? "copied ✓" : "copy"}
      </span>
    </button>
  );
}
