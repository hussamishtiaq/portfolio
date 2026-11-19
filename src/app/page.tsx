import Link from "next/link";
import { projects, moreWork } from "@/content/projects";
import { experience } from "@/content/experience";
import { contactHref, site } from "@/lib/site";
import { LiveVitals } from "@/components/live-vitals";
import { ProjectCard } from "@/components/project-card";
import { Section, Serif } from "@/components/section";
import { CopyEmail, LocalTime, PaletteButton } from "@/components/islands";

const proof = [
  { value: "83k", label: "lines in a realtime platform I built solo" },
  { value: "6", label: "SDK targets generated from one API contract" },
  { value: "3", label: "offline-first sync architectures built" },
  { value: "200+", label: "test files in my solo systems" },
];

const capabilities = [
  {
    title: "Offline-first & sync",
    body: "Apps that keep selling, booking and recording with the network down, then converge without losing a write. PowerSync, CouchDB replication, custom outboxes.",
    evidence: ["offline-pos", "dashboard-desktop", "clinic"],
  },
  {
    title: "Realtime & video",
    body: "WebSocket fan-out, presence, read receipts and LiveKit meetings, with event delivery guarantees instead of hope.",
    evidence: ["schoolchat"],
  },
  {
    title: "Multi-tenant SaaS",
    body: "Tenant isolation enforced by Postgres Row-Level Security, permission-key RBAC, franchise hierarchies, per-tenant plans and branding.",
    evidence: ["schoolchat", "nuxused"],
  },
  {
    title: "Distributed backends",
    body: "NestJS and .NET services, database-per-service, RabbitMQ with transactional outboxes, idempotency and dead-letter queues.",
    evidence: ["nuxused", "schoolchat"],
  },
  {
    title: "Security engineering",
    body: "Ed25519 device identity, signed presence tokens, Argon2, refresh-token rotation, end-to-end encryption, threat models written down.",
    evidence: ["presence", "schoolchat"],
  },
  {
    title: "Product-grade frontends",
    body: "React and Next.js that feel instant on bad connections: smart caching, optimistic updates, accessibility and performance budgets.",
    evidence: ["nuxused"],
  },
];

const receipts = [
  {
    claim: "Statically prerendered",
    verify: "Every page is HTML at build time. View source: the content is all there before JavaScript runs.",
  },
  {
    claim: "JavaScript that earns its place",
    verify:
      "Content renders on the server; only small islands (menu, theme, this panel) hydrate. No UI kit, animation or state library. The panel above shows the exact KB.",
  },
  { claim: "Works offline", verify: "Load once, switch off your Wi-Fi and reload. A hand-written service worker serves it." },
  {
    claim: "Keyboard-first",
    verify: "Press ⌘K (or /) for the command menu, or Tab through the page. The skip link appears first.",
  },
  {
    claim: "Accessible by default",
    verify: "Semantic landmarks, visible focus, AA contrast in both themes, and motion that respects reduced-motion.",
  },
  {
    claim: "Zero layout shift",
    verify: "Fonts are self-hosted with metric-matched fallbacks; animations touch only transform and opacity.",
  },
  {
    claim: "Scroll effects without JS",
    verify: "Reveals use CSS scroll-driven animations; card → case study morphs use the View Transitions API.",
  },
  { claim: "No trackers, no cookies", verify: "Open DevTools → Application. There is nothing to consent to." },
];

const process = [
  {
    step: "Understand the business",
    body: "Before choosing a stack, I find out what failure costs you: a lost sale, a leaked record, a missed deadline. That decides the architecture.",
  },
  {
    step: "Design the system on paper",
    body: "Data model, boundaries, failure modes and the trade-offs I'm rejecting, written down and agreed before code.",
  },
  {
    step: "Ship in thin vertical slices",
    body: "Working software end to end every week: schema, API, UI, tests and deploy, so you see progress you can click.",
  },
  {
    step: "Own it in production",
    body: "CI/CD, health checks, rollbacks, backups and docs. I build things that someone else can run at 3 a.m.",
  },
];

export default function Home() {
  return (
    <>
      {/* ---------------- Hero ---------------- */}
      <div className="border-line relative overflow-hidden border-b">
        <div
          aria-hidden="true"
          className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]"
        />
        <div className="relative mx-auto grid max-w-6xl gap-14 px-5 pt-16 pb-20 sm:px-8 sm:pt-24 sm:pb-28 lg:grid-cols-[1.35fr_1fr] lg:items-end">
          <div>
            <p className="border-line bg-elevated/60 text-muted inline-flex flex-wrap items-center gap-x-3 gap-y-1 rounded-full border px-3 py-1.5 font-mono text-xs">
              <span className="relative flex size-2">
                <span className="animate-ping-soft bg-signal absolute inline-flex size-full rounded-full" />
                <span className="bg-signal relative inline-flex size-2 rounded-full" />
              </span>
              {site.availability}
              <span className="text-subtle">
                · <LocalTime /> in Pakistan
              </span>
            </p>
            <h1 className="mt-8 text-[2.75rem] leading-[1.02] font-semibold tracking-[-0.04em] sm:text-7xl lg:text-[5.25rem]">
              I engineer software that <Serif>holds up</Serif> in the real world.
            </h1>
            <p className="text-muted mt-8 max-w-xl text-lg leading-relaxed sm:text-xl">
              I&apos;m <strong className="text-fg font-medium">{site.name}</strong>, a senior full-stack engineer. I design and
              ship multi-tenant SaaS, realtime platforms and offline-first apps, from the Postgres schema to the one-click
              installer.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a
                href={contactHref}
                className="bg-signal text-signal-fg inline-flex h-12 items-center gap-2 rounded-full px-6 font-medium transition-transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Start a conversation <span aria-hidden="true">→</span>
              </a>
              <Link
                href="#work"
                className="border-line-strong hover:bg-line inline-flex h-12 items-center rounded-full border px-6 font-medium transition-colors"
              >
                See the work
              </Link>
              <span className="text-subtle hidden items-center gap-2 pl-2 text-sm md:inline-flex">
                or <PaletteButton compact />
              </span>
            </div>
          </div>
          <div className="space-y-4">
            <Link
              href={`/work/${projects[0].slug}`}
              className="spotlight group border-line bg-elevated/40 hover:border-line-strong block rounded-xl border p-4 transition-colors"
            >
              <p className="text-subtle font-mono text-[11px] tracking-wider uppercase">Latest build</p>
              <p className="mt-2 flex items-baseline justify-between gap-3">
                <span className="font-semibold">{projects[0].name}</span>
                <span className="text-subtle group-hover:text-fg text-sm transition-colors">case study →</span>
              </p>
              <p className="text-muted mt-1 text-sm leading-relaxed">{projects[0].tagline}</p>
            </Link>
            <LiveVitals />
            <p className="text-subtle mt-3 px-1 text-xs leading-relaxed">
              Don&apos;t take my word for it. This panel is measuring <em>this page</em> in your browser right now, with the
              native Performance APIs.{" "}
              <a href="#this-site" className="decoration-line-strong hover:text-fg underline underline-offset-4">
                How it&apos;s built →
              </a>
            </p>
          </div>
        </div>

        {/* Proof strip */}
        <ul className="border-line relative mx-auto grid max-w-6xl grid-cols-2 border-t md:grid-cols-4">
          {proof.map((p, i) => (
            <li
              key={p.label}
              className={`px-5 py-7 sm:px-8 ${i % 2 === 0 ? "border-line border-r" : "md:border-r"} ${i < 2 ? "border-line border-b md:border-b-0" : ""} md:last:border-r-0`}
            >
              <p className="text-3xl font-semibold tracking-tight tabular-nums sm:text-4xl">{p.value}</p>
              <p className="text-subtle mt-1 text-sm">{p.label}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* ---------------- Work ---------------- */}
      <Section
        id="work"
        index="01"
        eyebrow="Selected work"
        title={
          <>
            Systems I&apos;ve designed, built and <Serif>shipped</Serif>.
          </>
        }
        intro="Each case study walks through the problem, the constraints, the architecture (step through it) and the trade-offs I chose not to make."
      >
        <div className="grid gap-5 md:grid-cols-2">
          {projects.map((p, i) => (
            <ProjectCard
              key={p.slug}
              project={p}
              featured={i === 0 || (i === projects.length - 1 && projects.length % 2 === 0)}
            />
          ))}
        </div>

        <div className="reveal mt-16">
          <h3 className="text-subtle font-mono text-xs tracking-wider uppercase">Also built</h3>
          <ul className="divide-line border-line mt-4 divide-y border-y">
            {moreWork.map((w) => (
              <li key={w.name} className="grid gap-1 py-5 md:grid-cols-[260px_1fr_auto] md:items-baseline md:gap-8">
                <p className="font-medium">{w.name}</p>
                <p className="text-muted text-sm">{w.note}</p>
                <p className="text-subtle font-mono text-xs">{w.stack}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* ---------------- Capabilities ---------------- */}
      <Section
        id="capabilities"
        index="02"
        eyebrow="Capabilities"
        title={
          <>
            Problems I solve, <Serif>with receipts</Serif>.
          </>
        }
        intro="Not a wall of logos. Every capability links to a system where I actually did it."
        className="border-line border-t"
      >
        <ul className="border-line bg-line grid gap-px overflow-hidden rounded-2xl border sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((c) => (
            <li key={c.title} className="spotlight reveal bg-bg flex flex-col p-7">
              <h3 className="text-lg font-semibold">{c.title}</h3>
              <p className="text-muted mt-3 flex-1 text-sm leading-relaxed">{c.body}</p>
              <p className="mt-6 flex flex-wrap gap-2">
                {c.evidence.map((slug) => {
                  const p = projects.find((x) => x.slug === slug)!;
                  return (
                    <Link
                      key={slug}
                      href={`/work/${slug}`}
                      className="border-line text-muted hover:border-signal hover:text-signal rounded-full border px-3 py-1 font-mono text-xs transition-colors"
                    >
                      {p.name} ↗
                    </Link>
                  );
                })}
              </p>
            </li>
          ))}
        </ul>
        <p className="reveal text-subtle mt-8 font-mono text-xs leading-relaxed">
          Languages: {site.languages.join(" · ")} · plus NestJS, Next.js, React, Express, ASP.NET Core, Django, FastAPI, Electron,
          Flutter, PostgreSQL, Redis, RabbitMQ, Docker
        </p>
      </Section>

      {/* ---------------- This site ---------------- */}
      <Section
        id="this-site"
        index="03"
        eyebrow="This website"
        title={
          <>
            The portfolio is <Serif>also</Serif> the proof.
          </>
        }
        intro="Anyone can claim performance and craft. Here's what this site does, and how you can check each claim yourself in under a minute."
        className="border-line border-t"
      >
        <ol className="grid gap-x-10 md:grid-cols-2">
          {receipts.map((r, i) => (
            <li key={r.claim} className="reveal border-line grid grid-cols-[2.5rem_1fr] border-t py-6">
              <span className="text-signal font-mono text-xs">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="font-semibold">{r.claim}</h3>
                <p className="text-muted mt-1.5 text-sm leading-relaxed">{r.verify}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* ---------------- Process ---------------- */}
      <Section
        id="process"
        index="04"
        eyebrow="How I work"
        title={
          <>
            Senior means you <Serif>don&apos;t</Serif> have to manage me.
          </>
        }
        intro="Clients and teams hire me to take an ambiguous problem and return a running system, with the decisions documented."
        className="border-line border-t"
      >
        <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {process.map((p, i) => (
            <li key={p.step} className="reveal border-line rounded-2xl border p-6">
              <p className="text-subtle font-mono text-xs">
                <span className="text-signal">0{i + 1}</span> / 04
              </p>
              <h3 className="mt-8 text-lg font-semibold">{p.step}</h3>
              <p className="text-muted mt-3 text-sm leading-relaxed">{p.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* ---------------- Experience (renders once filled in) ---------------- */}
      {experience.length > 0 && (
        <Section id="experience" index="05" eyebrow="Experience" title="Where I've done it." className="border-line border-t">
          <ol className="divide-line border-line divide-y border-y">
            {experience.map((e) => (
              <li key={`${e.company}-${e.period}`} className="reveal grid gap-2 py-7 md:grid-cols-[180px_1fr]">
                <p className="text-subtle font-mono text-xs">{e.period}</p>
                <div>
                  <h3 className="font-semibold">
                    {e.role} ·{" "}
                    {e.href ? (
                      <a href={e.href} className="decoration-line-strong hover:text-signal underline underline-offset-4">
                        {e.company}
                      </a>
                    ) : (
                      e.company
                    )}
                  </h3>
                  <p className="text-muted mt-2 max-w-2xl text-sm leading-relaxed">{e.summary}</p>
                </div>
              </li>
            ))}
          </ol>
        </Section>
      )}

      {/* ---------------- Contact ---------------- */}
      <section id="contact" aria-labelledby="contact-title" className="defer-render border-line relative overflow-hidden border-t">
        <div
          aria-hidden="true"
          className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_bottom,black_20%,transparent_70%)]"
        />
        <div className="reveal relative mx-auto max-w-6xl px-5 py-28 text-center sm:px-8 sm:py-40">
          <p className="text-subtle font-mono text-xs tracking-wider uppercase">
            <span className="text-signal">{experience.length > 0 ? "06" : "05"}</span> / Contact
          </p>
          <h2 id="contact-title" className="mx-auto mt-6 max-w-4xl text-4xl leading-[1.05] font-semibold sm:text-7xl">
            Have a hard problem? <Serif>Let&apos;s talk.</Serif>
          </h2>
          <p className="text-muted mx-auto mt-6 max-w-xl text-lg">
            Full-time, contract or a single gnarly system. Tell me what&apos;s at stake and I&apos;ll tell you how I&apos;d
            approach it.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a
              href={contactHref}
              className="bg-signal text-signal-fg inline-flex h-12 items-center gap-2 rounded-full px-6 font-medium transition-transform hover:-translate-y-0.5"
            >
              {site.calendar ? "Book a 20-minute call" : "Email me"} <span aria-hidden="true">→</span>
            </a>
            <CopyEmail />
          </div>
          <ul className="text-muted mt-10 flex justify-center gap-6 text-sm">
            <li>
              <a href={site.socials.github} rel="me noopener" target="_blank" className="hover:text-fg">
                GitHub ↗
              </a>
            </li>
            <li>
              <a href={site.socials.linkedin} rel="me noopener" target="_blank" className="hover:text-fg">
                LinkedIn ↗
              </a>
            </li>
            {site.resume && (
              <li>
                <a href={site.resume} className="hover:text-fg">
                  Résumé (PDF) ↓
                </a>
              </li>
            )}
          </ul>
        </div>
      </section>
    </>
  );
}
