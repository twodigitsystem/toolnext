"use client";

import { Palette } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ToolCard } from "./tool-card";

const SWATCHES = [
  { hex: "#4F46E5", name: "Indigo" },
  { hex: "#7C3AED", name: "Purple" },
  { hex: "#059669", name: "Emerald" },
  { hex: "#EA580C", name: "Orange" },
  { hex: "#0284C7", name: "Sky" },
  { hex: "#E11D48", name: "Rose" },
];

const STORAGE_KEY = "toolnext-color-inspector";

function hexToRgb(hex: string) {
  let clean = hex.replace("#", "");
  if (clean.length === 3) {
    clean = clean
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const num = Number.parseInt(clean, 16);
  if (Number.isNaN(num)) return null;
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function ColorInspector() {
  const [hex, setHex] = useState("#4F46E5");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        if (!/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(stored)) {
          toast.error("The saved color could not be restored.");
          return;
        }
        setHex(stored);
      }
    } catch {
      toast.error("Could not restore the saved color.");
    }
  }, []);

  const handleHexChange = (value: string) => {
    setHex(value);
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      toast.error("Could not save the selected color.");
    }
  };

  const updateColor = (colorHex: string) => {
    handleHexChange(colorHex);
  };

  const reset = () => {
    setHex("#4F46E5");
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      toast.error("Could not clear the saved color.");
    }
  };

  const isValid = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex);
  const rgb = isValid ? hexToRgb(hex) : null;

  const copy = async (kind: "hex" | "rgb") => {
    const text =
      kind === "hex"
        ? hex.toUpperCase()
        : rgb
          ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
          : "";
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${kind === "hex" ? "HEX" : "RGB"} copied to clipboard`);
    } catch {
      toast.error("Failed to copy color");
    }
  };

  return (
    <ToolCard
      icon={Palette}
      title="Color Picker"
      badge="Hex / RGB"
      action={
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={reset}
          aria-label="Reset color inspector"
          className="px-2 text-xs"
        >
          Reset
        </Button>
      }
      footer={
        <div className="flex gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => copy("hex")}
            className="flex-1 bg-surface-low text-on-surface text-[11px] font-bold hover:bg-surface-high"
          >
            Copy HEX
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => copy("rgb")}
            className="flex-1 bg-surface-low text-on-surface text-[11px] font-bold hover:bg-surface-high"
          >
            Copy RGB
          </Button>
        </div>
      }
    >
      <div className="flex items-center gap-3 mb-2">
        <div
          className="w-12 h-12 rounded-xl shadow-inner shrink-0 transition-colors"
          style={{
            backgroundColor: isValid ? hex : "var(--muted)",
          }}
        />
        <Input
          className={cn(
            "bg-surface-low font-mono uppercase tracking-wider focus-visible:ring-primary/20",
            !isValid && "text-red-500",
          )}
          type="text"
          value={hex}
          onChange={(e) => handleHexChange(e.target.value)}
          spellCheck={false}
        />
      </div>
      <div className="flex items-center justify-between gap-1.5 my-2">
        {SWATCHES.map((swatch) => (
          <button
            key={swatch.hex}
            type="button"
            title={swatch.name}
            onClick={() => updateColor(swatch.hex)}
            className="w-6 h-6 rounded-full hover:scale-110 transition-transform shadow-sm"
            style={{ backgroundColor: swatch.hex }}
          />
        ))}
      </div>
    </ToolCard>
  );
}
