"use client";

import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { ErrorBoundary } from "@/components/shared/error-boundary";
import { CssThemePanel } from "./css-theme";
import { DataConverterPanel } from "./data-converter";
import { TextCasePanel } from "./text-case";

export function Playground() {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section ref={ref} className="w-full bg-surface py-10 sm:py-12 md:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div
          className={`mb-6 sm:mb-10 animate-on-scroll ${
            isVisible ? "is-visible" : ""
          }`}
        >
          <span className="text-xs text-primary uppercase tracking-widest font-bold">
            Interactive Sandbox
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-on-surface mt-1">
            Daily Utilities Playground
          </h2>
          <p className="text-sm md:text-base text-on-surface-variant mt-1">
            Test run our interactive utilities right in your browser with
            real-time reactive engines.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div
            className={`animate-slide-left stagger-1 ${isVisible ? "is-visible" : ""}`}
          >
            <ErrorBoundary>
              <TextCasePanel />
            </ErrorBoundary>
          </div>
          <div
            className={`animate-slide-right stagger-2 ${isVisible ? "is-visible" : ""}`}
          >
            <ErrorBoundary>
              <CssThemePanel />
            </ErrorBoundary>
          </div>
          <div
            className={`animate-slide-left stagger-3 ${isVisible ? "is-visible" : ""}`}
          >
            <ErrorBoundary>
              <DataConverterPanel />
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </section>
  );
}
