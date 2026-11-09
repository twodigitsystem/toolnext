import {
  ArrowRight,
  Check,
  Compass,
  Layers3,
  LockKeyhole,
  Sparkles,
  Wrench,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  MarketingPageFrame,
  MarketingSection,
} from "@/components/marketing/marketing-page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { availableTools, plannedTools } from "@/lib/tool-registry/tools";

export const metadata: Metadata = {
  title: "About ToolNext",
  description:
    "Learn what ToolNext is building: a growing, clearly labeled collection of useful browser-based tools.",
  alternates: { canonical: "/about" },
};

const principles = [
  {
    icon: Check,
    title: "Honest availability",
    description:
      "A listing is not a promise that a tool works today. We distinguish ready-to-use tools from ideas still in development.",
  },
  {
    icon: LockKeyhole,
    title: "Local-first where practical",
    description:
      "The available tools currently run in your browser. We aim to explain clearly if a future tool needs an online service.",
  },
  {
    icon: Wrench,
    title: "Useful before numerous",
    description:
      "We would rather ship a smaller set that behaves predictably than claim a huge collection of unfinished utilities.",
  },
];

export default function AboutPage() {
  return (
    <MarketingPageFrame
      eyebrow="About ToolNext"
      title="Small tasks deserve thoughtful tools."
      description="ToolNext is growing into a practical collection of everyday utilities: easy to find, straightforward to use, and clear about what is ready."
      icon={Sparkles}
    >
      <div className="mb-8 flex justify-center overflow-hidden rounded-3xl border border-border/70 bg-white p-5 shadow-sm sm:p-8">
        <Image
          src="/icons/toolnext-logo-lockup.svg"
          alt="ToolNext — The Modern Toolkit"
          width={760}
          height={220}
          className="h-auto w-full max-w-[520px]"
        />
      </div>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(260px,0.7fr)]">
        <div className="space-y-8">
          <MarketingSection id="why-toolnext" title="Why we are building this">
            <p>
              Everyday work is full of small jobs: checking a word count,
              calculating a percentage, converting a measurement, or testing a
              color value. ToolNext brings these focused helpers together so you
              can complete a task without installing a separate app or creating
              an account.
            </p>
            <p>
              The product is in active development. The catalog is designed to
              grow across categories, but each listing is labeled by its real
              status. A planned entry is a roadmap item—not a working tool.
            </p>
          </MarketingSection>

          <MarketingSection id="how-we-build" title="How we build the catalog">
            <p>
              Every tool has one stable page and a category in the catalog.
              Shared navigation, search, and status labels make it possible to
              browse a large collection without creating a separate site
              experience for every utility.
            </p>
            <ol className="list-decimal space-y-2 pl-6">
              <li>
                We choose a focused task and define the expected inputs and
                output.
              </li>
              <li>
                We implement the tool and check its behavior, including common
                edge cases.
              </li>
              <li>
                We publish it as available only when its implementation is
                connected to the public tool page.
              </li>
              <li>
                If it needs a server or an external provider, that dependency
                should be clearly identified before you use it.
              </li>
            </ol>
          </MarketingSection>

          <MarketingSection
            id="privacy-by-design"
            title="Privacy is part of the experience"
          >
            <p>
              The {availableTools.length} tools currently marked available run
              their tool logic in your browser. Four homepage quick tools also
              save some inputs in this browser so they can be restored later;
              other tool-page inputs are not saved by those tools. Recent
              searches may also be stored locally. You can reset quick-tool
              values or clear ToolNext site data in your browser settings.
            </p>
            <p>
              “Runs in your browser” does not mean the website itself makes no
              network requests. Your browser must request the site, and the
              hosting provider may process routine request information. Read the{" "}
              <Link
                href="/privacy"
                className="font-semibold text-primary underline-offset-4 hover:underline"
              >
                Privacy Policy
              </Link>{" "}
              for the current details and limits.
            </p>
          </MarketingSection>
        </div>

        <aside className="space-y-4">
          <div className="rounded-3xl border border-primary/15 bg-gradient-to-br from-primary/[0.08] via-card to-secondary/[0.08] p-6 sm:p-7">
            <div className="flex items-center gap-2 text-sm font-bold text-primary">
              <Compass className="size-4" aria-hidden="true" />
              The catalog today
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-border/70 bg-card/80 p-4">
                <p className="font-heading text-3xl font-bold text-on-surface">
                  {availableTools.length}
                </p>
                <p className="mt-1 text-xs font-medium text-on-surface-variant">
                  available now
                </p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-card/80 p-4">
                <p className="font-heading text-3xl font-bold text-on-surface">
                  {plannedTools.length}
                </p>
                <p className="mt-1 text-xs font-medium text-on-surface-variant">
                  planned listings
                </p>
              </div>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-on-surface-variant">
              Planned listings are shown for discovery and may change. They
              should not be mistaken for finished tools.
            </p>
            <Button asChild className="mt-5 w-full rounded-xl">
              <Link href="/tools">
                Explore the directory
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card p-6">
            <div className="flex items-center gap-2 font-heading font-bold text-on-surface">
              <Layers3 className="size-4 text-primary" aria-hidden="true" />
              Built to grow carefully
            </div>
            <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
              ToolNext has a shared route and registry structure for a growing
              number of categories. That structure helps keep discovery
              consistent; it does not mean every planned tool is already
              implemented.
            </p>
          </div>
        </aside>
      </div>

      <section
        aria-labelledby="principles-heading"
        className="mt-8 rounded-3xl border border-border/70 bg-surface-low/70 p-6 sm:p-8"
      >
        <div className="max-w-2xl">
          <Badge className="rounded-full bg-primary/10 text-primary">
            Product principles
          </Badge>
          <h2
            id="principles-heading"
            className="mt-3 font-heading text-2xl font-bold tracking-tight text-on-surface sm:text-3xl"
          >
            Helpful, clear, and built with care.
          </h2>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {principles.map(({ icon: Icon, title, description: detail }) => (
            <div
              key={title}
              className="rounded-2xl border border-border/70 bg-card p-5"
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-heading font-bold text-on-surface">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                {detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-border/70 bg-card p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <h2 className="font-heading text-lg font-bold text-on-surface">
            Want to understand how your data is handled?
          </h2>
          <p className="mt-1 text-sm text-on-surface-variant">
            See what the current browser tools store and what the site does not
            promise.
          </p>
        </div>
        <Button asChild variant="secondary" className="shrink-0 rounded-xl">
          <Link href="/privacy">
            Read the privacy policy
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </MarketingPageFrame>
  );
}
