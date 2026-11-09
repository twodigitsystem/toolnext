"use client";

import { ArrowRight, LayoutGrid, RotateCcw, SearchX, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { categories } from "@/lib/tool-registry/categories";
import { tools } from "@/lib/tool-registry/tools";
import type { RegisteredTool } from "@/lib/tool-registry/types";
import { cn } from "@/lib/utils";
import { useSearch } from "./search-context";

const sortOptions = [
  { value: "name-asc", label: "Name (A-Z)" },
  { value: "name-desc", label: "Name (Z-A)" },
];

const filterTabs = [
  { id: "available", label: "Available now" },
  ...categories.map((c) => ({ id: c.id, label: c.label })),
];

function ToolCard({ tool }: { tool: RegisteredTool }) {
  const Icon = tool.icon;
  const isAvailable = tool.status === "available";
  return (
    <Link href={tool.href} className="block group">
      <Card className="glass-card h-full rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 gap-0 ring-0 py-0 cursor-pointer hover-glow">
        <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-primary group-hover:bg-gradient-to-br group-hover:from-primary group-hover:to-secondary group-hover:text-primary-foreground group-hover:scale-110 group-hover:shadow-lg transition-all duration-500">
              <Icon className="size-5" />
            </div>
          </div>
          <Badge
            className={
              isAvailable
                ? "rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold"
                : "rounded-full bg-surface-high text-on-surface-variant font-bold"
            }
          >
            {isAvailable ? "Available now" : "Coming soon"}
          </Badge>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 flex-1 flex flex-col">
          <CardTitle className="font-heading text-base sm:text-lg font-bold text-on-surface group-hover:text-primary transition-colors duration-300">
            {tool.name}
          </CardTitle>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-2 line-clamp-2">
            {tool.description}
          </p>
          <div className="pt-3 sm:pt-4 flex items-center justify-between border-t border-border/20 mt-3">
            <span className="text-xs sm:text-sm text-outline">
              {isAvailable ? "Ready to use" : "In development"}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs text-primary font-bold group-hover:translate-x-1 transition-transform duration-300">
              {isAvailable ? "Open tool" : "View details"}
              <ArrowRight className="size-4" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function ToolDirectory() {
  const [activeTab, setActiveTab] = useState<string>("available");
  const [sortBy, setSortBy] = useState<string>("name-asc");
  const { query, setQuery } = useSearch();
  const { ref, isVisible } = useScrollAnimation(0.1);

  const visibleTools = useMemo(() => {
    const q = query.toLowerCase().trim();
    let filtered = tools.filter((tool) => {
      const matchesCategory =
        activeTab === "available" || tool.category === activeTab;
      const matchesAvailability =
        activeTab !== "available" || tool.status === "available";
      const matchesQuery =
        !q || `${tool.name} ${tool.description}`.toLowerCase().includes(q);
      return matchesCategory && matchesAvailability && matchesQuery;
    });

    // Apply sorting
    if (sortBy === "name-desc") {
      filtered = [...filtered].sort((a, b) => b.name.localeCompare(a.name));
    } else {
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [activeTab, query, sortBy]);

  return (
    <section
      id="tools"
      ref={ref}
      className="w-full bg-surface-low/70 py-12 sm:py-14 scroll-mt-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div
          className={`flex flex-col lg:flex-row lg:items-end justify-between mb-6 sm:mb-10 gap-4 animate-on-scroll ${
            isVisible ? "is-visible" : ""
          }`}
        >
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-on-surface">
                Browse tools
              </h2>
              <Badge className="rounded-full bg-surface-highest text-primary text-[11px] font-bold whitespace-nowrap">
                {query
                  ? `${visibleTools.length} result${visibleTools.length !== 1 ? "s" : ""}`
                  : activeTab === "available"
                    ? `${visibleTools.length} available tools`
                    : `${visibleTools.length} tools`}
              </Badge>
            </div>
            <p className="text-sm md:text-base text-on-surface-variant mt-1">
              {query
                ? `Showing tools matching "${query}"`
                : activeTab === "available"
                  ? "Ready-to-use tools that run directly in your browser."
                  : `Tools in ${categories.find((category) => category.id === activeTab)?.label ?? "this category"}; planned tools are clearly marked.`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Clear search button — shown when query is active */}
            {query && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => {
                  setQuery("");
                  setActiveTab("available");
                }}
                className="h-9 px-3 rounded-xl bg-card text-on-surface-variant hover:text-destructive hover:border-destructive/30 text-xs font-semibold gap-1.5 border border-border transition-all"
              >
                <X className="size-3.5" />
                Clear search
              </Button>
            )}
            {/* Sort Dropdown */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-36 lg:w-44 bg-card h-9">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="mb-6 sm:mb-8 relative"
        >
          <div className="relative">
            {/* Right fade indicator for overflow on mobile */}
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-surface-low/70 to-transparent z-10 lg:hidden" />
            <TabsList className="bg-transparent p-0 h-auto gap-1.5 overflow-x-auto justify-start w-full scrollbar-none">
              {filterTabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className={cn(
                    "rounded-xl px-3.5 py-2 text-sm font-semibold whitespace-nowrap data-active:bg-primary data-active:text-primary-foreground data-active:shadow-sm dark:data-active:bg-primary dark:data-active:text-primary-foreground dark:data-active:border-transparent hover:scale-105 bg-card text-on-surface-variant hover:text-on-surface hover:shadow-md transition-all shrink-0",
                  )}
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>

        {visibleTools.length === 0 ? (
          <Empty className="py-16 border border-dashed border-border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <SearchX />
              </EmptyMedia>
              <EmptyTitle className="text-lg font-medium text-on-surface">
                {query
                  ? `No tools match "${query}"`
                  : "No tools in this category yet"}
              </EmptyTitle>
              <EmptyDescription>
                {query
                  ? "Try a different keyword or browse all categories."
                  : "More tools are being added regularly."}
              </EmptyDescription>
            </EmptyHeader>
            <div className="mt-6 flex items-center justify-center gap-3">
              {(query || activeTab !== "all") && (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setQuery("");
                    setActiveTab("all");
                  }}
                  className="rounded-xl bg-card text-on-surface text-sm font-semibold gap-1.5 h-9 px-4"
                >
                  <RotateCcw className="size-3.5" />
                  Reset filters
                </Button>
              )}
              <Button
                type="button"
                variant="secondary"
                size="sm"
                asChild
                className="rounded-xl bg-card text-on-surface text-sm font-semibold gap-1.5 h-9 px-4"
              >
                <Link href="/tools">
                  <LayoutGrid className="size-3.5" />
                  Browse all tools
                </Link>
              </Button>
            </div>
          </Empty>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {visibleTools.map((tool, index) => (
              <div
                key={tool.id}
                className={`${
                  index % 2 === 0 ? "animate-slide-left" : "animate-slide-right"
                } stagger-${(index % 5) + 1} ${isVisible ? "is-visible" : ""}`}
              >
                <ToolCard tool={tool} />
              </div>
            ))}
          </div>
        )}

        {/* Bottom CTA — hidden when showing all tools unfiltered (redundant on home page) */}
        {(query || activeTab !== "all") && (
          <div
            className={`mt-8 sm:mt-10 text-center animate-on-scroll ${
              isVisible ? "is-visible" : ""
            }`}
          >
            <Button
              asChild
              variant="secondary"
              className="h-auto px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl bg-card hover:bg-surface-low text-on-surface text-xs sm:text-sm font-bold shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <Link href="/tools">
                <span>Browse all {tools.length} tools</span>
                <LayoutGrid className="size-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
