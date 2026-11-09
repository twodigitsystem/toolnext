"use client";

import { ChevronDown, Menu, Moon, Search, Sparkles, Sun } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { InstallPwaButton } from "./install-pwa-button";

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const navLinks = [
    { label: "All Tools", href: "/tools" },
    {
      label: "Categories",
      href: pathname === "/" ? "/#categories" : "/categories/developer",
    },
    { label: "About", href: "/about" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const focusSearch = useCallback(() => {
    const input = document.querySelector<HTMLInputElement>(
      "#hero-search-input, #tools-search-input",
    );
    if (input) {
      input.focus();
      input.select();
      input.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    router.push("/tools?focus=search");
  }, [router]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        focusSearch();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [focusSearch]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 w-full z-50 bg-card/90 backdrop-blur-md transition-all duration-300",
        scrolled ? "shadow-[0_4px_20px_rgba(0,0,0,0.08)]" : "shadow-none",
      )}
    >
      <div className="h-16 max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-primary-foreground shadow-sm group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
              <Sparkles className="size-5" />
            </div>
            <span className="font-heading text-xl font-bold tracking-tight text-on-surface flex items-center">
              Tool
              <span className="text-primary group-hover:scale-110 transition-transform duration-300 inline-block">
                Next
              </span>
            </span>
          </Link>
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors flex items-center gap-1 relative group",
                  (link.label === "All Tools" &&
                    pathname.startsWith("/tools")) ||
                    (link.label === "Categories" &&
                      pathname.startsWith("/categories")) ||
                    (link.label === "About" && pathname === "/about")
                    ? "text-primary font-bold"
                    : "text-on-surface-variant hover:text-on-surface",
                )}
              >
                {link.label}
                {link.label === "Categories" && (
                  <ChevronDown className="size-4 text-outline group-hover:rotate-180 transition-transform duration-300" />
                )}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <InstallPwaButton />
          {/* Mobile search button */}
          <Button
            type="button"
            variant="secondary"
            size="icon"
            onClick={focusSearch}
            className="sm:hidden rounded-xl bg-muted hover:bg-surface-high text-on-surface-variant hover:text-on-surface transition-all duration-300 hover:shadow-md"
            aria-label="Search utilities"
          >
            <Search className="size-5" />
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={focusSearch}
            aria-label="Search tools"
            className="hidden sm:flex justify-between w-56 lg:w-64 h-10 px-3 rounded-xl bg-muted hover:bg-surface-high text-on-surface-variant transition-all duration-300 hover:shadow-md"
          >
            <span className="flex items-center gap-2 text-sm">
              <Search className="size-4" />
              Quick search...
            </span>
            <Kbd>⌘K</Kbd>
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="icon"
            title="Toggle color mode"
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
            className="rounded-xl bg-muted hover:bg-surface-high text-on-surface-variant hover:text-on-surface transition-all duration-300 hover:shadow-md hover:rotate-12"
          >
            {resolvedTheme === "dark" ? (
              <Sun className="size-5" />
            ) : (
              <Moon className="size-5" />
            )}
          </Button>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="lg:hidden rounded-xl bg-muted hover:bg-surface-high text-on-surface transition-all duration-300 hover:shadow-md"
                aria-label="Toggle menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="top" className="pt-16">
              <SheetHeader className="sr-only">
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4 pb-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                      (link.label === "All Tools" &&
                        pathname.startsWith("/tools")) ||
                        (link.label === "Categories" &&
                          pathname.startsWith("/categories")) ||
                        (link.label === "About" && pathname === "/about")
                        ? "text-primary font-bold bg-primary-fixed/50"
                        : "text-on-surface-variant hover:bg-muted hover:translate-x-1",
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
