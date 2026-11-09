"use client";

import { ErrorBoundary } from "@/components/shared/error-boundary";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { ColorInspector } from "./color-inspector";
import { PercentageCalc } from "./percentage";
import { UnitConverter } from "./unit-converter";
import { WordCounter } from "./word-counter";

const tools = [
  { id: "word-counter", Component: WordCounter },
  { id: "percentage-calculator", Component: PercentageCalc },
  { id: "unit-converter", Component: UnitConverter },
  { id: "color-picker", Component: ColorInspector },
];

export function QuickTools() {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section
      id="quick-tools"
      ref={ref}
      className="w-full bg-surface py-10 sm:py-12 md:py-14 -mt-4 sm:-mt-6 relative z-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div
          className={`flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-10 gap-2 animate-on-scroll ${
            isVisible ? "is-visible" : ""
          }`}
        >
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs text-primary uppercase tracking-widest font-bold mb-1">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
              Four Browser-Based Utilities
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-on-surface">
              Quick Utilities — Use Right Now
            </h2>
            <p className="text-sm md:text-base text-on-surface-variant mt-1">
              Use these four mini-tools directly on this page. Your input is
              processed in your browser.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-outline">No file uploads</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {tools.map(({ id, Component }, index) => (
            <div
              key={id}
              id={id}
              className={`${
                index % 2 === 0 ? "animate-slide-left" : "animate-slide-right"
              } stagger-${index + 1} ${isVisible ? "is-visible" : ""}`}
            >
              <ErrorBoundary>
                <Component />
              </ErrorBoundary>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
