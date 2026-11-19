import Link from "next/link";
import { site } from "@/lib/site";
import { ThemeToggle } from "./theme";
import { PaletteButton } from "./islands";

const nav = [
  { href: "/#work", label: "Work" },
  { href: "/#capabilities", label: "Capabilities" },
  { href: "/#process", label: "Process" },
  { href: "/#contact", label: "Contact" },
];

export function Header() {
  return (
    <header className="no-print border-line bg-bg/75 supports-[backdrop-filter]:bg-bg/60 sticky top-0 z-40 border-b backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link
          href="/"
          className="group flex items-center gap-3 rounded-md"
          aria-label={`${site.initials} ${site.shortName}, home`}
        >
          <span className="bg-fg text-bg grid size-8 place-items-center rounded-md font-mono text-xs font-semibold transition-transform group-hover:-rotate-6">
            {site.initials}
          </span>
          <span className="hidden text-sm font-medium tracking-tight md:block">{site.shortName}</span>
        </Link>
        <nav aria-label="Primary" className="hidden sm:block">
          <ul className="text-muted flex items-center gap-1 text-sm">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="hover:text-fg rounded-md px-3 py-2 transition-colors">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-1.5">
          <PaletteButton />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
