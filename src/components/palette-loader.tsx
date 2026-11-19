"use client";

import { useEffect, useState, type ComponentType } from "react";

export const OPEN_EVENT = "palette:open";
export const openPalette = () => window.dispatchEvent(new Event(OPEN_EVENT));

type Palette = ComponentType<{ openOnMount?: boolean }>;

/**
 * Keeps the command palette (and the case-study index it searches) out of the
 * first-load bundle. It's fetched when the browser is idle, or immediately on ⌘K.
 */
export function PaletteLoader() {
  const [state, setState] = useState<{ Palette: Palette; open: boolean } | null>(null);

  useEffect(() => {
    if (state) return;
    let cancelled = false;
    let wantOpen = false;
    const load = (open: boolean) => {
      wantOpen ||= open;
      return import("./command-palette").then(
        (m) => !cancelled && setState((s) => s ?? { Palette: m.CommandPalette, open: wantOpen }),
      );
    };

    const onOpen = () => load(true);
    const onKey = (e: KeyboardEvent) => {
      const typing =
        e.target instanceof HTMLElement && (e.target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName));
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        load(true);
      }
    };
    window.addEventListener(OPEN_EVENT, onOpen);
    window.addEventListener("keydown", onKey);
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 2500));
    const id = idle(() => load(false), { timeout: 4000 });
    return () => {
      cancelled = true;
      window.removeEventListener(OPEN_EVENT, onOpen);
      window.removeEventListener("keydown", onKey);
      (window.cancelIdleCallback ?? window.clearTimeout)(id);
    };
  }, [state]);

  return state ? <state.Palette openOnMount={state.open} /> : null;
}
