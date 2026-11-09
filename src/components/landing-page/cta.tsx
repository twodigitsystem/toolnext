"use client";

import { ArrowRight, Megaphone } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { plannedTools } from "@/lib/tool-registry/tools";

export function Cta() {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section
      ref={ref}
      className="w-full bg-surface pb-10 sm:pb-12 md:pb-14 pt-4"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div
          className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-surface-low via-surface-high to-surface-highest p-6 sm:p-8 md:p-16 shadow-lg hover:shadow-xl transition-shadow duration-300 gradient-border animate-on-scroll ${
            isVisible ? "is-visible" : ""
          }`}
        >
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none animate-float" />
          <div className="absolute -left-20 -top-20 w-80 h-80 bg-secondary/10 rounded-full blur-3xl pointer-events-none animate-float-delay" />

          <div className="relative z-10 max-w-3xl">
            <Badge className="mb-4 px-3 py-1 rounded-full bg-card text-primary text-[11px] font-bold uppercase shadow-sm">
              <Megaphone className="size-4" />
              Available Now &amp; In Development
            </Badge>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight">
              Start with a tool that works today
            </h2>
            <p className="mt-3 text-base md:text-lg text-on-surface-variant leading-relaxed">
              Try one of the available browser-based tools, or browse the{" "}
              {plannedTools.length} catalog entries in development.
            </p>

            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Button
                asChild
                className="h-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-gradient-to-r from-primary to-secondary text-primary-foreground text-xs sm:text-sm font-bold rounded-xl shadow-md hover:shadow-lg hover:brightness-105 hover:-translate-y-1 active:scale-95 transition-all duration-300"
              >
                <Link href="/#quick-tools">
                  <ArrowRight className="size-5" />
                  <span>Use the available tools</span>
                </Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                className="h-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-card text-on-surface hover:bg-surface-low text-xs sm:text-sm font-bold rounded-xl shadow-sm hover:shadow hover:-translate-y-1 transition-all duration-300"
              >
                <Link href="/tools">Browse planned tools</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
