"use client";

import { Percent } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToolCard } from "./tool-card";

const STORAGE_KEY = "toolnext-percentage-calc";

export function PercentageCalc() {
  const [x, setX] = useState("15");
  const [y, setY] = useState("240");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (
          typeof parsed !== "object" ||
          parsed === null ||
          !("x" in parsed) ||
          !("y" in parsed) ||
          typeof parsed.x !== "string" ||
          typeof parsed.y !== "string"
        ) {
          toast.error("The saved calculator values could not be restored.");
          return;
        }
        setX(parsed.x);
        setY(parsed.y);
      }
    } catch {
      toast.error("Could not restore the saved calculator values.");
    }
  }, []);

  const handleChange = (key: "x" | "y", value: string) => {
    const nextX = key === "x" ? value : x;
    const nextY = key === "y" ? value : y;
    setX(nextX);
    setY(nextY);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ x: nextX, y: nextY }));
    } catch {
      toast.error("Could not save the calculator values.");
    }
  };

  const reset = () => {
    setX("15");
    setY("240");
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      toast.error("Could not clear the saved calculator values.");
    }
  };

  const result = ((parseFloat(x) || 0) / 100) * (parseFloat(y) || 0);

  return (
    <ToolCard
      icon={Percent}
      title="Percentage Calculator"
      badge="Math"
      badgeClassName="bg-secondary-fixed text-on-secondary-fixed"
      action={
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={reset}
          aria-label="Reset percentage calculator"
          className="px-2 text-xs"
        >
          Reset
        </Button>
      }
      footer={
        <div className="flex items-center justify-between">
          <span className="text-xs text-on-surface-variant">
            Calculation Result:
          </span>
          <span className="font-heading text-lg text-primary font-bold">
            {result.toFixed(2)}
          </span>
        </div>
      }
    >
      <p className="text-sm text-on-surface-variant mb-3">What is X% of Y?</p>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            className="bg-surface-low pr-7 focus-visible:ring-primary/20"
            type="number"
            value={x}
            onChange={(e) => handleChange("x", e.target.value)}
          />
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-outline text-sm font-bold pointer-events-none">
            %
          </span>
        </div>
        <span className="text-sm text-outline">of</span>
        <Input
          className="flex-1 bg-surface-low focus-visible:ring-primary/20"
          type="number"
          value={y}
          onChange={(e) => handleChange("y", e.target.value)}
        />
      </div>
    </ToolCard>
  );
}
