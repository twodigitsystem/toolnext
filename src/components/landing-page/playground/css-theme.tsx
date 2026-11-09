"use client";

import { Palette } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const tokens = [
  { name: "--color-primary", value: "#4F46E5 (Indigo 600)", hex: "#4F46E5" },
  {
    name: "--color-primary-light",
    value: "#818CF8 (Indigo 400)",
    hex: "#818CF8",
  },
  {
    name: "--color-primary-dark",
    value: "#312E81 (Indigo 900)",
    hex: "#312E81",
  },
];

export function CssThemePanel() {
  const copyCss = async () => {
    const css = `:root {\n  --color-primary: #4F46E5;\n  --color-primary-light: #818CF8;\n  --color-primary-dark: #312E81;\n}`;
    try {
      await navigator.clipboard.writeText(css);
      toast.success("CSS variables copied to clipboard");
    } catch {
      toast.error("Failed to copy CSS");
    }
  };

  return (
    <Card className="h-full rounded-2xl shadow-md gap-0 ring-0 py-0">
      <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6">
        <div className="flex items-center gap-2">
          <Palette className="text-secondary size-5" />
          <h3 className="font-heading text-base sm:text-lg font-bold text-on-surface">
            CSS Theme Generator
          </h3>
        </div>
        <Badge
          variant="outline"
          className="font-mono text-[11px] text-outline border-0 bg-transparent px-0"
        >
          CSS3
        </Badge>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 flex-1 flex flex-col">
        <p className="text-sm text-on-surface-variant mb-3">
          Dynamic tokens computed from root accent:
        </p>
        <div className="space-y-2">
          {tokens.map((token) => (
            <div
              key={token.name}
              className="flex items-center gap-2 p-2 rounded-xl bg-surface-low"
            >
              <div
                className="w-8 h-8 rounded-lg shrink-0 shadow-sm"
                style={{ backgroundColor: token.hex }}
              />
              <div className="flex-1 min-w-0">
                <span className="block font-mono text-[11px] text-outline">
                  {token.name}
                </span>
                <span className="block font-mono text-sm text-on-surface font-bold truncate">
                  {token.value}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-auto pt-3 sm:pt-4 flex items-center justify-between">
          <span className="text-[11px] text-outline font-mono">
            AA WCAG Compliant
          </span>
          <Button
            type="button"
            size="sm"
            onClick={copyCss}
            className="px-4 py-2 h-auto rounded-xl bg-secondary text-secondary-foreground text-xs font-semibold hover:brightness-105 transition-all shadow-sm"
          >
            Copy CSS Variables
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
