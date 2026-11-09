import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

type MarketingPageFrameProps = {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  children: ReactNode;
  updatedAt?: string;
};

export function MarketingPageFrame({
  eyebrow,
  title,
  description,
  icon: Icon,
  children,
  updatedAt,
}: MarketingPageFrameProps) {
  return (
    <article className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:py-16">
      <nav aria-label="Breadcrumb" className="mb-8 text-sm">
        <ol className="flex items-center gap-2 text-on-surface-variant">
          <li>
            <Link href="/" className="transition-colors hover:text-primary">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="font-medium text-on-surface">
            {title}
          </li>
        </ol>
      </nav>

      <header className="relative isolate overflow-hidden rounded-3xl border border-border/70 bg-card px-6 py-8 shadow-sm sm:px-10 sm:py-12">
        <div
          aria-hidden="true"
          className="absolute -right-20 -top-32 -z-10 size-80 rounded-full bg-primary/10 blur-3xl"
        />
        <div className="flex max-w-3xl items-start gap-4 sm:gap-5">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary sm:size-14">
            <Icon className="size-6 sm:size-7" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary sm:text-sm">
              {eyebrow}
            </p>
            <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight text-on-surface sm:text-4xl lg:text-5xl">
              {title}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-on-surface-variant sm:text-lg">
              {description}
            </p>
            {updatedAt && (
              <p className="mt-5 text-xs font-medium text-outline">
                Last updated: {updatedAt}
              </p>
            )}
          </div>
        </div>
      </header>

      <div className="mt-8 sm:mt-10">{children}</div>
    </article>
  );
}

export type PolicySectionData = {
  id: string;
  title: string;
  content: ReactNode;
};

export function PolicySections({
  sections,
}: {
  sections: PolicySectionData[];
}) {
  return (
    <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12">
      <nav
        aria-label="On this page"
        className="h-fit min-w-0 rounded-2xl border border-border/70 bg-card p-5 lg:sticky lg:top-24"
      >
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-outline">
          On this page
        </p>
        <ol className="flex min-w-0 max-w-full gap-2 overflow-x-auto pb-1 text-sm lg:flex-col lg:overflow-visible lg:pb-0">
          {sections.map((section, index) => (
            <li key={section.id} className="shrink-0 lg:shrink">
              <a
                href={`#${section.id}`}
                className="inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-on-surface-variant transition-colors hover:bg-primary/5 hover:text-primary"
              >
                <span className="hidden text-xs text-outline lg:inline">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {section.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="min-w-0">
        <div className="mb-6 rounded-2xl border border-primary/15 bg-primary/[0.04] p-5 sm:p-6">
          <p className="text-sm leading-relaxed text-on-surface-variant">
            These pages describe the current ToolNext website and its
            browser-based tools. The catalog is growing; a tool marked “Coming
            soon” is not yet available for use. We will update these pages as
            the product or its data practices change.
          </p>
        </div>

        <div className="divide-y divide-border/70 rounded-2xl border border-border/70 bg-card px-5 sm:px-8">
          {sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-28 py-7 first:pt-7 last:pb-8 sm:py-8"
            >
              <h2 className="font-heading text-xl font-bold tracking-tight text-on-surface sm:text-2xl">
                {section.title}
              </h2>
              <div className="policy-prose mt-4 space-y-4 text-sm leading-7 text-on-surface-variant sm:text-base">
                {section.content}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

export function MarketingSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-28 rounded-2xl border border-border/70 bg-card p-6 shadow-sm sm:p-8"
    >
      <h2 className="font-heading text-xl font-bold tracking-tight text-on-surface sm:text-2xl">
        {title}
      </h2>
      <div className="mt-4 space-y-4 text-sm leading-7 text-on-surface-variant sm:text-base">
        {children}
      </div>
    </section>
  );
}
