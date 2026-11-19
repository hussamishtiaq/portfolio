import Link from "next/link";
import { Serif } from "@/components/section";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-start px-5 py-32 sm:px-8">
      <p className="text-signal font-mono text-xs">HTTP 404</p>
      <h1 className="mt-4 text-5xl font-semibold sm:text-7xl">
        This route <Serif>doesn&apos;t exist</Serif>.
      </h1>
      <p className="text-muted mt-6 text-lg">Unlike my systems, this page failed gracefully. Press ⌘K to search, or go home.</p>
      <Link href="/" className="bg-signal text-signal-fg mt-10 inline-flex h-12 items-center rounded-full px-6 font-medium">
        ← Back home
      </Link>
    </div>
  );
}
