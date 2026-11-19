# hussamqureshi.dev

Personal site of Hussam Ishtiaq Qureshi. Next.js 16 (App Router), React 19, Tailwind CSS 4, TypeScript.
Every route is prerendered; the only client JS is a handful of small islands.

```bash
pnpm install
pnpm dev                       # http://localhost:3000
pnpm build && pnpm start       # production build
STATIC_EXPORT=1 pnpm build     # plain static site in ./out (any host)
pnpm lint && pnpm format
```

## Editing content

| What | Where |
| --- | --- |
| Name, email, socials, calendar link, résumé, domain | `src/lib/site.ts` (or `NEXT_PUBLIC_SITE_URL`) |
| Case studies (diagrams, decisions, metrics) | `src/content/projects.ts` |
| Work history (section appears once non-empty) | `src/content/experience.ts` |
| Home page copy | `src/app/page.tsx` |
| Colours / tokens | `src/app/globals.css` |

Drop a `resume.pdf` in `public/` and set `resume: "/resume.pdf"` to enable the résumé links.

## What's under the hood

- **Live Web Vitals panel**: native `PerformanceObserver`, measures the visitor's own page load.
- **Architecture diagrams**: hand-built SVG, keyboard-steppable (← →), animated with CSS only.
- **⌘K / `/` command palette** on the native `<dialog>`, lazy-loaded on idle or first use.
- **View transitions**: card → case study morphs via React's `<ViewTransition>`.
- **Offline**: hand-written service worker (`public/sw.js`). Bump `VERSION` when changing caching rules.
- **Zero-JS scroll reveals** with CSS scroll-driven animations; `content-visibility` on off-screen sections.
- **SEO**: per-page metadata + canonical, JSON-LD (Person, WebSite, ProfilePage, CreativeWork, BreadcrumbList),
  build-time OG images, sitemap, robots, manifest.
- **Security headers / CSP** in `vercel.json`.
