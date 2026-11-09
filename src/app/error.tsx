"use client";

import { AlertTriangle, ArrowLeft, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ErrorPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background">
      {/* Background decorative elements */}
      <div className="pointer-events-none absolute inset-0 bg-dot-grid opacity-50" />

      {/* Floating gradient orbs */}
      <div className="pointer-events-none absolute -top-32 -left-32 size-96 rounded-full bg-linear-to-br from-primary/30 to-secondary/20 blur-3xl animate-float" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 size-96 rounded-full bg-linear-to-br from-tertiary/25 to-primary/15 blur-3xl animate-float-delay" />
      <div className="pointer-events-none absolute top-1/3 left-1/2 size-64 -translate-x-1/2 rounded-full bg-linear-to-tr from-secondary/20 to-accent/30 blur-2xl animate-float" />

      {/* Secondary small orbs for depth */}
      <div className="pointer-events-none absolute top-1/4 right-[25%] size-32 rounded-full bg-linear-to-br from-tertiary/15 to-transparent blur-2xl animate-float-delay" />
      <div className="pointer-events-none absolute bottom-1/3 left-[15%] size-40 rounded-full bg-linear-to-tl from-primary/15 to-transparent blur-2xl animate-float" />

      {/* Main content card */}
      <div className="relative z-10 mx-4 w-full max-w-md">
        <div
          className={cn(
            "group relative rounded-2xl bg-card p-8 text-center shadow-2xl",
            "ring-1 ring-foreground/5",
            "hover:shadow-[0_20px_60px_-15px_rgba(79,70,229,0.25)]",
            "transition-shadow duration-500",
          )}
        >
          {/* Gradient border glow on hover */}
          <div className="pointer-events-none absolute inset-0 rounded-2xl bg-linear-to-br from-primary/10 via-transparent to-secondary/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          {/* Animated error icon */}
          <div className="relative mx-auto mb-6 flex size-20 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-linear-to-br from-tertiary/20 to-destructive/10 blur-xl" />
            <div className="relative flex size-16 items-center justify-center rounded-full bg-linear-to-br from-tertiary to-destructive shadow-lg shadow-destructive/30">
              <AlertTriangle className="size-8 text-white" />
            </div>
            <div
              className="absolute inset-0 rounded-full border-2 border-tertiary/20 animate-ping"
              style={{ animationDuration: "3s" }}
            />
          </div>

          {/* Title with gradient text */}
          <h1 className="bg-linear-to-r from-tertiary via-destructive to-secondary bg-clip-text text-5xl font-bold tracking-tight text-transparent">
            Oops!
          </h1>
          <p className="mt-2 font-mono text-sm text-muted-foreground">
            Something went wrong
          </p>

          <p className="mt-4 text-muted-foreground">
            We hit an unexpected error while loading this page. Our team has
            been notified and is working on a fix.
          </p>

          {/* Action buttons */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild variant="default" size="lg" className="group/btn">
              <Link href="/" className="flex items-center gap-2">
                <Home className="size-4 transition-transform group-hover/btn:-translate-y-0.5" />
                Back home
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="group/btn"
              onClick={() => window.history.back()}
            >
              <span className="flex items-center gap-2">
                <ArrowLeft className="size-4 transition-transform group-hover/btn:-translate-x-0.5" />
                Go back
              </span>
            </Button>
          </div>

          {/* Decorative bottom accent */}
          <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-linear-to-r from-primary to-secondary" />
        </div>
      </div>

      {/* Footer status */}
      <div className="absolute bottom-6 text-center">
        <p className="font-mono text-xs text-muted-foreground/60">
          Error ID: <span className="text-muted-foreground">unknown</span>
        </p>
      </div>
    </div>
  );
}
