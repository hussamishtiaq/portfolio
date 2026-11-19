import { site } from "@/lib/site";
import { OfflineStatus } from "./islands";

export function Footer() {
  const sha = process.env.NEXT_PUBLIC_BUILD_SHA;
  const built = process.env.NEXT_PUBLIC_BUILD_TIME!;
  return (
    <footer className="border-line border-t">
      <div className="text-subtle mx-auto grid max-w-6xl gap-6 px-5 py-10 font-mono text-xs sm:grid-cols-[1fr_auto] sm:px-8">
        <div className="space-y-2">
          <p>
            © {built.slice(0, 4)} {site.name}. Designed and engineered by hand.
          </p>
          <p>Next.js 16 · React 19 · Tailwind 4 · zero UI kits · zero trackers · zero cookies</p>
        </div>
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 sm:text-right">
          <dt>build</dt>
          <dd>{sha}</dd>
          <dt>deployed</dt>
          <dd>
            <time dateTime={built}>{built.slice(0, 16).replace("T", " ")} UTC</time>
          </dd>
          <dt>status</dt>
          <dd>
            <OfflineStatus />
          </dd>
        </dl>
      </div>
    </footer>
  );
}
