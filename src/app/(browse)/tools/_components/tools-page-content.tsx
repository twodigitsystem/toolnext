"use client";

import { ArrowRight, Search, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories } from "@/lib/tool-registry/categories";
import { availableTools, plannedTools, tools } from "@/lib/tool-registry/tools";
import type { RegisteredTool, ToolStatus } from "@/lib/tool-registry/types";

const pageSize = 24;
const statusOptions: { value: "all" | ToolStatus; label: string }[] = [
  { value: "available", label: `Available now (${availableTools.length})` },
  { value: "planned", label: `Coming soon (${plannedTools.length})` },
  { value: "all", label: `All tools (${tools.length})` },
];

function isToolStatus(value: string): value is "all" | ToolStatus {
  return value === "all" || value === "available" || value === "planned";
}

const sortOptions = [
  { value: "name-asc", label: "Name (A–Z)" },
  { value: "name-desc", label: "Name (Z–A)" },
];

function ToolCard({ tool }: { tool: RegisteredTool }) {
  const Icon = tool.icon;
  const isAvailable = tool.status === "available";

  return (
    <Link href={tool.href} className="group block h-full">
      <Card className="h-full rounded-2xl border-border/70 bg-card transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg">
        <CardHeader className="flex-row items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <Icon className="size-5" aria-hidden="true" />
            </div>
            <CardTitle className="line-clamp-2 text-base font-semibold leading-snug text-on-surface group-hover:text-primary">
              {tool.name}
            </CardTitle>
          </div>
          <Badge
            className={
              isAvailable
                ? "shrink-0 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                : "shrink-0 bg-surface-high text-on-surface-variant"
            }
          >
            {isAvailable ? "Available" : "Coming soon"}
          </Badge>
        </CardHeader>
        <CardContent className="flex h-[calc(100%-5rem)] flex-col pt-0">
          <p className="line-clamp-3 text-sm leading-relaxed text-on-surface-variant">
            {tool.description}
          </p>
          <div className="mt-auto flex items-center justify-between pt-5 text-xs font-semibold">
            <span className="text-outline">
              {tool.requiresBackend ? "Service required" : "Browser tool"}
            </span>
            <span className="inline-flex items-center gap-1 text-primary">
              {isAvailable ? "Open tool" : "Details"}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function ToolsPageContent() {
  const searchRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState<"all" | ToolStatus>("available");
  const [sortBy, setSortBy] = useState("name-asc");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const selectedCategory = params.get("category");
    const selectedStatus = params.get("status");

    if (categories.some((item) => item.id === selectedCategory)) {
      setCategory(selectedCategory ?? "all");
    }
    if (
      selectedStatus === "available" ||
      selectedStatus === "planned" ||
      selectedStatus === "all"
    ) {
      setStatus(selectedStatus);
    }
    if (params.get("focus") === "search") {
      searchRef.current?.focus();
    }
  }, []);

  const filteredTools = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = tools.filter((tool) => {
      const matchesQuery =
        !normalizedQuery ||
        `${tool.name} ${tool.description} ${tool.category}`
          .toLowerCase()
          .includes(normalizedQuery);
      const matchesCategory = category === "all" || tool.category === category;
      const matchesStatus = status === "all" || tool.status === status;

      return matchesQuery && matchesCategory && matchesStatus;
    });

    return filtered.sort((a, b) =>
      sortBy === "name-desc"
        ? b.name.localeCompare(a.name)
        : a.name.localeCompare(b.name),
    );
  }, [category, query, sortBy, status]);

  const pageCount = Math.max(1, Math.ceil(filteredTools.length / pageSize));
  const visibleTools = filteredTools.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  return (
    <section aria-labelledby="tools-heading" className="mx-auto max-w-7xl">
      <div className="mb-8 flex flex-col gap-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Tool directory
          </p>
          <h1
            id="tools-heading"
            className="mt-1 font-heading text-3xl font-bold tracking-tight text-on-surface sm:text-4xl"
          >
            Find the right tool
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-on-surface-variant sm:text-base">
            Start with tools you can use now. Choose “Coming soon” or “All
            tools” in the availability filter to explore planned listings.
          </p>
        </div>

        <div className="grid gap-3 rounded-2xl border border-border/70 bg-card p-3 sm:grid-cols-2 lg:grid-cols-[minmax(16rem,1fr)_12rem_12rem_10rem]">
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-outline"
              aria-hidden="true"
            />
            <Input
              ref={searchRef}
              id="tools-search-input"
              aria-label="Search tools"
              placeholder="Search by tool name or description"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              className="h-10 pl-9 pr-9"
            />
            {query && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Clear search"
                onClick={() => setQuery("")}
                className="absolute right-1 top-1/2 size-8 -translate-y-1/2"
              >
                <X className="size-4" />
              </Button>
            )}
          </div>

          <Select
            value={category}
            onValueChange={(value) => {
              setCategory(value);
              setPage(1);
            }}
          >
            <SelectTrigger aria-label="Filter by category" className="h-10">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={status}
            onValueChange={(value) => {
              if (isToolStatus(value)) {
                setStatus(value);
                setPage(1);
              }
            }}
          >
            <SelectTrigger aria-label="Filter by availability" className="h-10">
              <SelectValue placeholder="Available now" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={sortBy}
            onValueChange={(value) => {
              setSortBy(value);
              setPage(1);
            }}
          >
            <SelectTrigger aria-label="Sort tools" className="h-10">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div
          className="flex flex-wrap items-center justify-between gap-2"
          aria-live="polite"
        >
          <p className="text-sm text-on-surface-variant">
            Showing {visibleTools.length} of {filteredTools.length} matching
            tools
          </p>
          <p className="text-xs text-outline">
            {availableTools.length} ready to use · {plannedTools.length} coming
            soon
          </p>
        </div>
      </div>

      {visibleTools.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visibleTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
          <h2 className="font-heading text-lg font-semibold text-on-surface">
            {status === "available" && query
              ? "No available tools match that search"
              : "No tools match those filters"}
          </h2>
          <p className="mt-2 text-sm text-on-surface-variant">
            {status === "available" && query
              ? "The tool may still be in development. Search planned listings or adjust your filters."
              : "Try a different search or reset the filters."}
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {status === "available" && query && (
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setStatus("planned");
                  setPage(1);
                }}
              >
                Search coming-soon tools
              </Button>
            )}
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setQuery("");
                setCategory("all");
                setStatus("available");
                setPage(1);
              }}
            >
              Reset filters
            </Button>
          </div>
        </div>
      )}

      {pageCount > 1 && (
        <nav
          aria-label="Tool directory pages"
          className="mt-8 flex items-center justify-between gap-4"
        >
          <Button
            type="button"
            variant="secondary"
            disabled={page === 1}
            onClick={() => setPage((current) => current - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-on-surface-variant">
            Page {page} of {pageCount}
          </span>
          <Button
            type="button"
            variant="secondary"
            disabled={page === pageCount}
            onClick={() => setPage((current) => current + 1)}
          >
            Next
          </Button>
        </nav>
      )}
    </section>
  );
}
