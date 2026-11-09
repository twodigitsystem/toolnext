"use client";

import { ArrowRight, Search, ShieldCheck, X } from "lucide-react";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Kbd } from "@/components/ui/kbd";
import { plannedTools } from "@/lib/tool-registry/tools";
import { popularSearches } from "./landing-data";
import { useSearch } from "./search-context";

export function Hero() {
  const { query, setQuery } = useSearch();
  const inputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToTools = () => {
    document.getElementById("tools")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    scrollToTools();
  };

  const selectSearch = (term: string) => {
    setQuery(term);
    scrollToTools();
  };

  const filteredSuggestions = popularSearches.filter((term) =>
    term.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-surface via-surface-low to-surface py-8 sm:py-10 md:py-16">
      <div className="absolute inset-0 pointer-events-none bg-dot-grid opacity-[0.35]" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-tr from-primary/25 via-secondary/20 to-tertiary/10 blur-[100px] rounded-full animate-float" />
        <div className="absolute top-48 -left-24 w-[500px] h-[500px] bg-primary-fixed/50 blur-[100px] rounded-full animate-float-delay" />
        <div className="absolute top-20 -right-24 w-[500px] h-[500px] bg-secondary-fixed/50 blur-[100px] rounded-full animate-float" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-gradient-to-br from-tertiary/10 to-transparent blur-3xl rounded-full" />
        <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-gradient-to-tl from-primary/10 to-transparent blur-3xl rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 flex flex-col items-center text-center">
        <Badge
          variant="secondary"
          className={`mb-4 sm:mb-6 px-3 py-1 rounded-full bg-surface-highest/60 text-primary shadow-sm animate-on-scroll ${
            mounted ? "is-visible" : ""
          }`}
        >
          <ShieldCheck className="size-4 animate-subtle-pulse" />
          <span className="text-xs uppercase tracking-wider font-semibold">
            4 Free Browser-Based Quick Tools
          </span>
        </Badge>

        {/* Ctrl+K Callout Badge */}
        <Badge
          variant="secondary"
          className="mb-4 sm:mb-6 px-3 py-1 rounded-full bg-surface-highest/60 text-primary shadow-sm animate-on-scroll"
        >
          <Search className="size-4" />
          <span className="text-xs uppercase tracking-wider">
            Press{"Ctrl+"}K{" to focus search"}
          </span>
        </Badge>

        <h1
          className={`font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-on-surface max-w-4xl tracking-tight leading-tight animate-on-scroll stagger-1 ${
            mounted ? "is-visible" : ""
          }`}
        >
          Quick Tools for <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-primary via-secondary to-secondary bg-clip-text text-transparent">
            Everyday Tasks.
          </span>
        </h1>

        <p
          className={`mt-4 sm:mt-5 text-sm sm:text-base md:text-lg text-on-surface-variant max-w-2xl leading-relaxed animate-on-scroll stagger-2 ${
            mounted ? "is-visible" : ""
          }`}
        >
          Use the available tools right now, or search the{" "}
          {plannedTools.length} more utilities in the catalog.
        </p>

        {/* Tool spotlight */}
        <p
          className={`mt-2 text-xs sm:text-sm text-secondary font-mono font-semibold tracking-wide animate-on-scroll stagger-2 ${
            mounted ? "is-visible" : ""
          }`}
        >
          ⚡ Try now:{" "}
          <a className="text-primary hover:underline" href="#word-counter">
            Word Counter
          </a>{" "}
          ·{" "}
          <a
            className="text-primary hover:underline"
            href="#percentage-calculator"
          >
            Percentage Calculator
          </a>{" "}
          ·{" "}
          <a className="text-primary hover:underline" href="#unit-converter">
            Unit Converter
          </a>
        </p>

        <form
          onSubmit={submitSearch}
          className={`w-full max-w-3xl min-w-0 mt-8 sm:mt-10 animate-on-scroll stagger-3 ${
            mounted ? "is-visible" : ""
          }`}
        >
          <InputGroup className="h-auto w-full min-w-0 rounded-2xl bg-card/80 backdrop-blur-sm p-2 shadow-[0_8px_32px_rgba(79,70,229,0.12)] transition-all group focus-within:shadow-[0_8px_40px_rgba(79,70,229,0.2)] focus-within:ring-4 focus-within:ring-primary/10">
            <InputGroupAddon className="shrink-0">
              <Search className="size-6" />
            </InputGroupAddon>
            <InputGroupInput
              ref={inputRef}
              id="hero-search-input"
              aria-label="Search utilities"
              className="w-0 min-w-0 py-3.5 px-3 text-base placeholder:text-outline"
              placeholder="Search tools..."
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  onClick={() => setQuery("")}
                  title="Clear search"
                  className="text-outline hover:text-on-surface"
                >
                  <X className="size-5" />
                </InputGroupButton>
              </InputGroupAddon>
            )}
            <InputGroupAddon align="inline-end" className="hidden sm:flex">
              <Kbd>
                <span>⌘</span>
                <span>K</span>
              </Kbd>
            </InputGroupAddon>
            <InputGroupAddon align="inline-end" className="shrink-0">
              <Button
                type="submit"
                className="px-4 sm:px-6 py-3.5 h-auto bg-gradient-to-r from-primary to-secondary text-primary-foreground text-sm font-semibold rounded-xl shadow-md hover:shadow-lg hover:brightness-105 active:scale-95 transition-all flex items-center gap-1.5 shrink-0"
              >
                <span>Search</span>
                <ArrowRight className="size-4" />
              </Button>
            </InputGroupAddon>
          </InputGroup>

          {/* Type-ahead Suggestions */}
          {filteredSuggestions.length > 0 && query.length > 0 && (
            <div className="mt-3 max-w-xl w-full text-left">
              <p className="text-xs sm:text text-primary uppercase tracking-widest mb-1">
                Did you mean?
              </p>
              <div className="flex flex-wrap gap-1.5">
                {filteredSuggestions.slice(0, 5).map((term) => (
                  <Button
                    key={term}
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => selectSearch(term)}
                    className="rounded-full bg-card hover:bg-surface-low text-on-surface shadow-sm text-xs sm:text-sm capitalize h-auto px-2.5 py-1"
                  >
                    {term}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-3 sm:mt-4 text-on-surface-variant text-xs sm:text-sm">
            <span className="text-xs text-outline font-semibold">Popular:</span>
            {popularSearches.map((term, index) => (
              <Button
                key={term}
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => selectSearch(term)}
                className={`rounded-full bg-card hover:bg-surface-low text-on-surface shadow-sm text-xs sm:text-sm h-auto px-2.5 py-1 animate-on-scroll stagger-${
                  index + 1
                } ${mounted ? "is-visible" : ""}`}
              >
                {term}
              </Button>
            ))}
          </div>
        </form>
      </div>
    </section>
  );
}
