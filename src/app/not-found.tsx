"use client";

import { ArrowLeft, ArrowRight, Home, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background">
      {/* Background: radial vignette + subtle dot-grid */}
      <div className="pointer-events-none absolute inset-0 bg-dot-grid opacity-[0.04]" />
      <div className="pointer-events-none absolute inset-0 bg-radial-[at_50%_35%] from-card to-transparent opacity-60" />

      {/* Floating decorative elements */}
      <div className="pointer-events-none absolute left-[12%] top-[20%] size-2 rounded-full bg-primary/30 animate-float" />
      <div className="pointer-events-none absolute right-[18%] top-[35%] size-1.5 rounded-full bg-secondary/40 animate-float-delay" />
      <div className="pointer-events-none absolute left-[8%] bottom-[30%] size-1.5 rounded-full bg-tertiary/30 animate-float" />
      <div className="pointer-events-none absolute right-[10%] bottom-[25%] size-2 rounded-full bg-primary/20 animate-float-delay" />

      <div className="relative z-10 mx-4 w-full max-w-2xl px-6 py-16">
        <div className="grid items-center gap-12 sm:grid-cols-2">
          {/* Left: large 404 with search icon */}
          <div className="flex flex-col items-center sm:items-start">
            <span className="font-mono text-[160px] font-extrabold leading-none tracking-tighter text-foreground/5">
              404
            </span>
            <div className="-mt-10 flex size-16 items-center justify-center rounded-full bg-surface-high shadow-sm">
              <Search className="size-7 text-on-surface-variant" />
            </div>
          </div>

          {/* Right: content */}
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <p className="font-mono text-xs uppercase tracking-widest text-primary">
              Page not found
            </p>
            <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight">
              You seem lost.
            </h1>
            <p className="mt-3 text-muted-foreground">
              The page you were looking for doesn&apos;t exist or has been
              moved. Let us help you find your way back.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
              <Button asChild variant="default" size="lg" className="group/btn">
                <Link href="/" className="flex items-center gap-2">
                  <Home className="size-4 transition-transform group-hover/btn:-translate-y-0.5" />
                  Back home
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="lg"
                onClick={() => window.history.back()}
                className="group/btn"
              >
                <span className="flex items-center gap-2">
                  <ArrowLeft className="size-4 transition-transform group-hover/btn:-translate-x-0.5" />
                  Go back
                </span>
              </Button>
            </div>

            <Link
              href="/tools"
              className="mt-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Browse all tools
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>

        {/* Bottom rule with accent dot */}
        <div className="mx-auto mt-16 flex items-center gap-2">
          <span className="h-px w-12 bg-gradient-to-r from-transparent to-border" />
          <span className="size-1.5 rounded-full bg-primary" />
          <span className="h-px w-12 bg-gradient-to-l from-transparent to-border" />
        </div>
      </div>
    </div>
  );
}
