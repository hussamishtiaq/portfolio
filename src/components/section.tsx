import { cn } from "@/lib/utils";

export function Section({
  id,
  index,
  eyebrow,
  title,
  intro,
  children,
  className,
}: {
  id: string;
  index: string;
  eyebrow: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cn("defer-render mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32", className)}>
      <div className="reveal mb-14 grid gap-6 md:grid-cols-[180px_1fr]">
        <p className="text-subtle font-mono text-xs tracking-wider uppercase">
          <span className="text-signal">{index}</span> / {eyebrow}
        </p>
        <div className="max-w-3xl">
          <h2 id={`${id}-title`} className="text-3xl leading-[1.1] font-semibold sm:text-5xl">
            {title}
          </h2>
          {intro && <p className="text-muted mt-5 text-lg leading-relaxed">{intro}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

export function Serif({ children }: { children: React.ReactNode }) {
  return <em className="font-serif text-[1.08em] font-normal tracking-normal">{children}</em>;
}
