"use client";

import { PiggyBank, ShieldCheck, Unlock, Zap } from "lucide-react";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const values = [
  {
    icon: Zap,
    title: "Ready to Use",
    description:
      "Four interactive mini-tools are available on the homepage now.",
    iconClass: "bg-primary-fixed text-primary",
  },
  {
    icon: PiggyBank,
    title: "Free to Use",
    description:
      "The available homepage mini-tools are free and do not require an account.",
    iconClass: "bg-secondary-fixed text-secondary",
  },
  {
    icon: ShieldCheck,
    title: "Browser-Based Processing",
    description:
      "Homepage mini-tool inputs are processed in your browser and are not uploaded to a processing service.",
    iconClass: "bg-surface-high text-primary",
  },
  {
    icon: Unlock,
    title: "Catalog Status Is Clear",
    description:
      "The 12 catalog listings are marked Coming Soon until their individual tools are available.",
    iconClass: "bg-primary-fixed/40 text-primary",
  },
];

export function TrustStrip() {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section
      ref={ref}
      className="w-full bg-card/50 backdrop-blur-sm py-6 sm:py-8 border-y border-border/30"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {values.map((value, index) => (
            <Item
              key={value.title}
              className={`flex items-start gap-3 sm:gap-4 p-2 sm:p-3 group animate-on-scroll stagger-${
                index + 1
              } ${isVisible ? "is-visible" : ""}`}
            >
              <ItemMedia
                className={`w-12 h-12 rounded-2xl ${value.iconClass} flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
              >
                <value.icon className="size-6" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle className="font-heading text-sm sm:text-base font-bold text-on-surface group-hover:text-primary transition-colors duration-300">
                  {value.title}
                </ItemTitle>
                <ItemDescription className="text-sm text-on-surface-variant mt-1 leading-snug line-clamp-none">
                  {value.description}
                </ItemDescription>
              </ItemContent>
            </Item>
          ))}
        </div>
      </div>
    </section>
  );
}
