"use client";

import { ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { categories } from "@/lib/tool-registry/categories";
import { getToolsByCategory } from "@/lib/tool-registry/tools";

export function Categories() {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section
      id="categories"
      ref={ref}
      className="w-full bg-surface py-10 sm:py-12 md:py-14 scroll-mt-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div
          className={`flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-10 gap-2 animate-on-scroll ${
            isVisible ? "is-visible" : ""
          }`}
        >
          <div>
            <span className="text-xs text-primary uppercase tracking-widest font-bold">
              Taxonomy Directory
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-on-surface mt-1">
              Browse by Category
            </h2>
            <p className="text-sm md:text-base text-on-surface-variant mt-1">
              Structured suites organized for rapid workflow navigation.
            </p>
          </div>
          <Link
            href="/tools"
            className="inline-flex items-center gap-1 text-sm text-primary hover:text-secondary transition-colors font-semibold group"
          >
            <span>Browse All Categories</span>
            <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            const categoryTools = getToolsByCategory(category.id);
            const availableCount = categoryTools.filter(
              (tool) => tool.status === "available",
            ).length;
            return (
              <Link
                key={category.id}
                href={`/categories/${category.id}`}
                className={`${
                  index % 2 === 0 ? "animate-slide-left" : "animate-slide-right"
                } stagger-${index + 1} ${isVisible ? "is-visible" : ""}`}
              >
                <Card className="group h-full rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 gap-0 ring-0 py-0 border-2 border-transparent hover:border-primary/10">
                  <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-primary group-hover:bg-gradient-to-br group-hover:from-primary group-hover:to-secondary group-hover:text-primary-foreground group-hover:scale-110 group-hover:shadow-lg transition-all duration-500">
                        <Icon className="size-7" />
                      </div>
                    </div>
                    <Badge className="rounded-full bg-surface-low text-[11px] text-on-surface-variant font-bold group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                      {categoryTools.length} tools
                    </Badge>
                    <Badge className="rounded-full bg-emerald-500/10 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                      {availableCount} ready
                    </Badge>
                  </CardHeader>
                  <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 flex-1 flex flex-col">
                    <h3 className="font-heading text-base sm:text-lg font-bold text-on-surface group-hover:text-primary transition-colors duration-300">
                      {category.label}
                    </h3>
                    <p className="text-xs sm:text-sm text-on-surface-variant mt-2 leading-relaxed">
                      {category.description}
                    </p>
                    <div className="flex items-center gap-1 text-[11px] sm:text-xs text-primary font-semibold mt-3 sm:mt-4 group-hover:translate-x-1 transition-transform duration-300">
                      <span>Explore Suite</span>
                      <ChevronRight className="size-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
