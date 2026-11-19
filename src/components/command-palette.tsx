"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { projects } from "@/content/projects";
import { contactHref, site } from "@/lib/site";
import { toggleTheme } from "./theme";
import { OPEN_EVENT } from "./palette-loader";
import { cn } from "@/lib/utils";

type Item = {
  id: string;
  group: string;
  label: string;
  hint?: string;
  keywords?: string;
  keepOpen?: boolean;
  run: () => void | Promise<void>;
};

/** ⌘K command palette on the native <dialog> element: focus trap, Esc and top layer for free. */
export function CommandPalette({ openOnMount = false }: { openOnMount?: boolean }) {
  const router = useRouter();
  const ref = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const [toast, setToast] = useState("");
  const listId = useId();

  const items = useMemo<Item[]>(() => {
    const go = (href: string) => () => router.push(href);
    const external = (href: string) => () => void window.open(href, "_blank", "noopener");
    const list: Item[] = [
      { id: "work", group: "Navigate", label: "Selected work", hint: "/#work", run: go("/#work") },
      { id: "cap", group: "Navigate", label: "Capabilities", hint: "/#capabilities", run: go("/#capabilities") },
      { id: "site", group: "Navigate", label: "How this site is built", hint: "/#this-site", run: go("/#this-site") },
      { id: "process", group: "Navigate", label: "How I work", hint: "/#process", run: go("/#process") },
      { id: "contact", group: "Navigate", label: "Contact", hint: "/#contact", run: go("/#contact") },
      ...projects.map((p) => ({
        id: p.slug,
        group: "Case studies",
        label: p.name,
        hint: p.kicker,
        keywords: `${p.tagline} ${p.stack.join(" ")}`,
        run: go(`/work/${p.slug}`),
      })),
      {
        id: "email",
        group: "Actions",
        label: "Copy email address",
        hint: site.email,
        keepOpen: true,
        run: async () => {
          await navigator.clipboard.writeText(site.email);
          setToast("Email copied to clipboard");
        },
      },
      {
        id: "talk",
        group: "Actions",
        label: "Start a conversation",
        hint: site.calendar ? "Book a call" : "Email",
        run: () => void (window.location.href = contactHref),
      },
      { id: "theme", group: "Actions", label: "Toggle light / dark theme", keywords: "dark light mode", run: toggleTheme },
      { id: "gh", group: "Links", label: "GitHub", run: external(site.socials.github) },
      { id: "li", group: "Links", label: "LinkedIn", run: external(site.socials.linkedin) },
    ];
    if (site.resume) list.push({ id: "cv", group: "Links", label: "Download résumé (PDF)", run: external(site.resume) });
    return list;
  }, [router]);

  const results = useMemo(() => {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return items;
    return items.filter((it) => {
      const hay = `${it.label} ${it.hint ?? ""} ${it.group} ${it.keywords ?? ""}`.toLowerCase();
      return terms.every((t) => hay.includes(t));
    });
  }, [items, query]);

  useEffect(() => {
    const open = () => {
      const d = ref.current;
      if (!d || d.open) return;
      setQuery("");
      setCursor(0);
      setToast("");
      d.showModal();
      inputRef.current?.focus();
    };
    const onKey = (e: KeyboardEvent) => {
      const typing =
        e.target instanceof HTMLElement && (e.target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName));
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        if (ref.current?.open) ref.current.close();
        else open();
      }
    };
    window.addEventListener(OPEN_EVENT, open);
    window.addEventListener("keydown", onKey);
    if (openOnMount) open();
    return () => {
      window.removeEventListener(OPEN_EVENT, open);
      window.removeEventListener("keydown", onKey);
    };
  }, [openOnMount]);

  const run = async (item: Item | undefined) => {
    if (!item) return;
    if (!item.keepOpen) ref.current?.close();
    await item.run();
  };

  const active = results[Math.min(cursor, results.length - 1)];
  let lastGroup = "";

  return (
    <dialog
      ref={ref}
      aria-label="Command palette"
      className="no-print border-line-strong bg-elevated text-fg m-0 mx-auto mt-[12vh] w-[min(640px,calc(100vw-2rem))] max-w-none overflow-hidden rounded-2xl border p-0 shadow-2xl"
      onClick={(e) => e.target === e.currentTarget && ref.current?.close()}
    >
      <div className="border-line flex items-center gap-3 border-b px-4">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-subtle shrink-0"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <label htmlFor={`${listId}-input`} className="sr-only">
          Search commands
        </label>
        <input
          id={`${listId}-input`}
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setCursor(0);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setCursor((c) => Math.min(c + 1, results.length - 1));
            }
            if (e.key === "ArrowUp") {
              e.preventDefault();
              setCursor((c) => Math.max(c - 1, 0));
            }
            if (e.key === "Enter") {
              e.preventDefault();
              run(active);
            }
          }}
          placeholder="Search projects, sections, actions…"
          role="combobox"
          aria-expanded="true"
          aria-controls={listId}
          aria-activedescendant={active ? `${listId}-${active.id}` : undefined}
          autoComplete="off"
          spellCheck={false}
          className="placeholder:text-subtle h-14 w-full bg-transparent text-[15px] outline-none"
        />
        <kbd className="border-line text-subtle rounded border px-1.5 py-0.5 font-mono text-[11px]">esc</kbd>
      </div>
      <ul
        id={listId}
        role="listbox"
        aria-label="Commands"
        className="max-h-[min(420px,60vh)] overflow-y-auto overscroll-contain p-2"
      >
        {results.length === 0 && <li className="text-subtle px-3 py-8 text-center text-sm">No results for “{query}”</li>}
        {results.map((it, n) => {
          const header = it.group !== lastGroup ? (lastGroup = it.group) : null;
          return (
            <li key={it.id} role="presentation">
              {header && (
                <div role="presentation" className="text-subtle px-3 pt-3 pb-1 font-mono text-[11px] tracking-wider uppercase">
                  {header}
                </div>
              )}
              <div
                id={`${listId}-${it.id}`}
                role="option"
                aria-selected={it === active}
                onPointerMove={() => setCursor(n)}
                onClick={() => run(it)}
                className={cn(
                  "flex cursor-pointer items-center justify-between gap-4 rounded-lg px-3 py-2.5 text-sm",
                  it === active ? "bg-line text-fg" : "text-muted",
                )}
              >
                <span>{it.label}</span>
                {it.hint && <span className="text-subtle truncate font-mono text-xs">{it.hint}</span>}
              </div>
            </li>
          );
        })}
      </ul>
      <div className="border-line text-subtle flex items-center justify-between border-t px-4 py-2.5 font-mono text-[11px]">
        <span aria-live="polite">{toast || "↑↓ to move · ↵ to select"}</span>
        <span>{site.initials} · ⌘K</span>
      </div>
    </dialog>
  );
}
