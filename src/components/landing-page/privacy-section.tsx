"use client";

import { Cpu, Eraser, FileCheck, ShieldCheck, UserX } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { availableTools, plannedTools } from "@/lib/tool-registry/tools";

const points = [
  {
    icon: Cpu,
    title: "Browser-Based Processing",
    description: `${availableTools.length} available tools process your inputs in your browser without uploading them to a processing service.`,
    tag: `${availableTools.length} Tools Available`,
    iconClass: "bg-primary-fixed text-primary",
    tagClass: "text-primary",
  },
  {
    icon: Eraser,
    title: "Local Browser Storage",
    description:
      "The four homepage quick tools save some inputs, and recent searches may be saved in this browser. Clear this site's browser data to remove them.",
    tag: "Stored on This Device",
    iconClass: "bg-secondary-fixed text-secondary",
    tagClass: "text-secondary",
  },
  {
    icon: UserX,
    title: "No Account Required",
    description: "The available homepage mini-tools do not require an account.",
    tag: "Instant Access",
    iconClass: "bg-surface-high text-primary",
    tagClass: "text-primary",
  },
  {
    icon: FileCheck,
    title: "Clear Availability",
    description: `The ${plannedTools.length} catalog entries are labeled Coming Soon; their dedicated tool pages are not available yet.`,
    tag: `${plannedTools.length} Planned Listings`,
    iconClass: "bg-primary-fixed text-on-primary-fixed",
    tagClass: "text-primary",
  },
];

export function PrivacySection() {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section
      id="privacy"
      ref={ref}
      className="w-full bg-card py-10 sm:py-12 md:py-14 scroll-mt-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div
          className={`max-w-3xl mb-6 sm:mb-10 animate-on-scroll ${
            isVisible ? "is-visible" : ""
          }`}
        >
          <Badge className="mb-3 px-3 py-1 rounded-full bg-surface-highest text-primary text-[11px] font-bold uppercase">
            <ShieldCheck className="size-4 animate-subtle-pulse" />
            Architecture Transparency
          </Badge>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-on-surface">
            Browser-first tools, clearly explained
          </h2>
          <p className="text-sm md:text-base text-on-surface-variant mt-2 leading-relaxed">
            The {availableTools.length} available tools run in your browser and
            do not upload their inputs to a processing service. The four
            homepage quick tools save some inputs in local storage; clear this
            site&apos;s browser data to remove them. This describes tool inputs,
            not routine website requests or hosting logs. Other catalog tools
            are still in development.
          </p>
          <Link
            href="/privacy"
            className="mt-3 inline-flex text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            Read the full Privacy Policy
          </Link>
        </div>

        {/* Decorative privacy illustration */}
        <div className="relative flex items-center justify-center mb-8 sm:mb-12">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shadow-lg">
            <ShieldCheck className="size-8 text-primary" />
          </div>
          <div className="absolute w-32 h-32 rounded-full border-2 border-dashed border-primary/10 animate-float" />
          <div className="absolute w-48 h-48 rounded-full border border-dashed border-secondary/5 animate-float-delay" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {points.map((point, index) => (
            <Card
              key={point.title}
              className={`bg-surface-low/50 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all duration-500 group ${
                index % 2 === 0 ? "animate-slide-left" : "animate-slide-right"
              } stagger-${index + 1} ${isVisible ? "is-visible" : ""} ring-0 gap-0 py-0 border border-border/30 hover:border-primary/10`}
            >
              <CardContent className="p-4 sm:p-6 flex flex-col justify-between h-full">
                <div>
                  <div
                    className={`w-12 h-12 rounded-xl ${point.iconClass} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                  >
                    <point.icon className="size-6" />
                  </div>
                  <h3 className="font-heading text-base sm:text-lg font-bold text-on-surface group-hover:text-primary transition-colors duration-300">
                    {point.title}
                  </h3>
                  <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
                    {point.description}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={`font-mono text-[11px] ${point.tagClass} font-bold mt-4 rounded-md border-0 bg-transparent px-0 justify-start`}
                >
                  {point.tag}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
