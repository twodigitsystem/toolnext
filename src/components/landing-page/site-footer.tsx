import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Layers3,
  Mail,
  Wrench,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { contactEmail } from "@/lib/site";
import { categories } from "@/lib/tool-registry/categories";
import { availableTools } from "@/lib/tool-registry/tools";
import { BackToTop } from "./back-to-top";

const readyCategories = categories.filter((category) =>
  availableTools.some((tool) => tool.category === category.id),
);

export function SiteFooter() {
  return (
    <footer className="relative isolate w-full overflow-hidden border-t border-white/10 bg-[#0c1022] text-slate-100">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-80 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.18),transparent_65%)]"
      />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400/80 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 pb-6 pt-8 sm:px-6 sm:pb-8 sm:pt-12">
        <div className="relative mb-10 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-5 sm:mb-14 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-8">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-20 size-56 rounded-full bg-violet-500/10 blur-3xl"
          />
          <div className="relative flex items-start gap-4">
            <div className="hidden size-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-400/10 text-indigo-300 sm:flex">
              <Wrench className="size-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-300">
                Make the next task easier
              </p>
              <h2 className="mt-1 font-heading text-xl font-bold tracking-tight text-white sm:text-2xl">
                Find the right tool. Get right back to work.
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-300">
                Browse what is ready today, with planned tools clearly marked as
                they are built.
              </p>
            </div>
          </div>
          <Link
            href="/tools"
            className="group relative mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0c1022] sm:mt-0 sm:w-auto sm:shrink-0"
          >
            Explore all tools
            <ArrowRight
              className="size-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>

        <div className="grid gap-10 border-b border-white/10 pb-10 sm:grid-cols-2 sm:gap-8 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-12 lg:pb-12">
          <div className="max-w-sm">
            <Link
              href="/"
              className="group inline-flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
            >
              <Image
                src="/icons/toolnext-monogram.svg"
                alt=""
                width={40}
                height={40}
                className="transition-transform group-hover:scale-105"
              />
              <span className="font-heading text-xl font-bold tracking-tight text-white">
                Tool<span className="text-indigo-300">Next</span>
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-slate-300">
              Handy browser-based utilities for the little tasks that add up. No
              account needed for the tools available today.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-300/[0.07] px-3 py-1.5 text-xs font-semibold text-emerald-200">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-300 opacity-40" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-300" />
                </span>
                {availableTools.length} tools ready
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-300">
                <Check
                  className="size-3.5 text-indigo-300"
                  aria-hidden="true"
                />
                Inputs processed in your browser
              </span>
            </div>
          </div>

          <FooterLinkGroup title="Explore">
            {readyCategories.map((category) => (
              <FooterLink
                key={category.id}
                href={`/categories/${category.id}`}
                label={category.label}
              />
            ))}
            <FooterLink
              href="/tools"
              label="Browse all categories"
              emphasized
            />
          </FooterLinkGroup>

          <FooterLinkGroup title="Available tools">
            {availableTools.map((tool) => (
              <FooterLink key={tool.id} href={tool.href} label={tool.name} />
            ))}
            <FooterLink
              href="/tools"
              label="See the full directory"
              emphasized
            />
          </FooterLinkGroup>

          <FooterLinkGroup title="ToolNext">
            <FooterLink href="/about" label="About us" />
            <FooterLink href="/privacy" label="Privacy policy" />
            <FooterLink href="/terms" label="Terms of use" />
            {contactEmail && (
              <li>
                <a
                  href={`mailto:${contactEmail}`}
                  className="group inline-flex items-center gap-2 text-sm text-slate-300 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
                >
                  <Mail className="size-4 text-slate-500 transition-colors group-hover:text-indigo-300" />
                  Contact
                  <ArrowUpRight
                    className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100"
                    aria-hidden="true"
                  />
                </a>
              </li>
            )}
          </FooterLinkGroup>
        </div>

        <div className="flex flex-col gap-4 pt-5 sm:flex-row sm:items-center sm:justify-between sm:pt-6">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Layers3 className="size-4 text-slate-500" aria-hidden="true" />
            <span>© 2026 ToolNext</span>
            <span aria-hidden="true" className="text-slate-600">
              ·
            </span>
            <span>Built for everyday tasks.</span>
          </div>
          <p className="text-xs leading-relaxed text-slate-500 sm:text-right">
            Availability is labeled. Planned tools are still in development.
          </p>
        </div>
      </div>
      <BackToTop />
    </footer>
  );
}

function FooterLinkGroup({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <nav aria-label={title}>
      <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
        {title}
      </h2>
      <ul className="mt-4 flex flex-col items-start gap-3">{children}</ul>
    </nav>
  );
}

function FooterLink({
  href,
  label,
  emphasized = false,
}: {
  href: string;
  label: string;
  emphasized?: boolean;
}) {
  return (
    <li>
      <Link
        href={href}
        className={`group inline-flex items-center gap-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 ${
          emphasized
            ? "font-semibold text-indigo-300 hover:text-indigo-200"
            : "text-slate-300 hover:text-white"
        }`}
      >
        {label}
        <ArrowUpRight
          className="size-3.5 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
          aria-hidden="true"
        />
      </Link>
    </li>
  );
}
