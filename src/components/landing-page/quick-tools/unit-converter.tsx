"use client";

import { ArrowUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToolCard } from "./tool-card";

const UNITS = ["km", "mi", "m", "ft"] as const;
const TO_METERS: Record<string, number> = {
  km: 1000,
  mi: 1609.344,
  m: 1,
  ft: 0.3048,
};
const LABELS: Record<string, string> = {
  km: "Kilometers (km)",
  mi: "Miles (mi)",
  m: "Meters (m)",
  ft: "Feet (ft)",
};

const STORAGE_KEY = "toolnext-unit-converter";

export function UnitConverter() {
  const [value, setValue] = useState("1");
  const [from, setFrom] = useState<string>("km");
  const [to, setTo] = useState<string>("mi");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (
          typeof parsed !== "object" ||
          parsed === null ||
          !("value" in parsed) ||
          !("from" in parsed) ||
          !("to" in parsed) ||
          typeof parsed.value !== "string" ||
          typeof parsed.from !== "string" ||
          !UNITS.includes(parsed.from as (typeof UNITS)[number]) ||
          typeof parsed.to !== "string" ||
          !UNITS.includes(parsed.to as (typeof UNITS)[number])
        ) {
          toast.error("The saved converter settings could not be restored.");
          return;
        }
        setValue(parsed.value);
        setFrom(parsed.from);
        setTo(parsed.to);
      }
    } catch {
      toast.error("Could not restore the saved converter settings.");
    }
  }, []);

  const handleValueChange = (val: string) => {
    setValue(val);
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ value: val, from, to }),
      );
    } catch {
      toast.error("Could not save the converter settings.");
    }
  };

  const handleUnitChange = (key: "from" | "to", unit: string) => {
    const nextFrom = key === "from" ? unit : from;
    const nextTo = key === "to" ? unit : to;
    setFrom(nextFrom);
    setTo(nextTo);
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ value, from: nextFrom, to: nextTo }),
      );
    } catch {
      toast.error("Could not save the converter settings.");
    }
  };

  const meters = (parseFloat(value) || 0) * (TO_METERS[from] ?? 1);
  const result = meters / (TO_METERS[to] ?? 1);

  const swap = () => {
    const newFrom = to;
    const newTo = from;
    setFrom(newFrom);
    setTo(newTo);
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ value, from: newFrom, to: newTo }),
      );
    } catch {
      toast.error("Could not save the converter settings.");
    }
  };

  const reset = () => {
    setValue("1");
    setFrom("km");
    setTo("mi");
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      toast.error("Could not clear the saved converter settings.");
    }
  };

  return (
    <ToolCard
      icon={ArrowUpDown}
      title="Unit Converter"
      badge="Units"
      badgeClassName="bg-surface-high text-on-surface-variant"
      action={
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={reset}
          aria-label="Reset unit converter"
          className="px-2 text-xs"
        >
          Reset
        </Button>
      }
      footer={
        <div className="flex items-center justify-between">
          <span className="text-xs text-on-surface-variant">Equivalent:</span>
          <span className="font-mono text-base text-primary font-bold">
            {result.toFixed(4)} {to}
          </span>
        </div>
      }
    >
      <div className="space-y-2">
        <div className="flex gap-2">
          <Input
            className="w-20 bg-surface-low focus-visible:ring-primary/20"
            type="number"
            value={value}
            onChange={(e) => handleValueChange(e.target.value)}
          />
          <Select
            value={from}
            onValueChange={(v) => handleUnitChange("from", v)}
          >
            <SelectTrigger className="flex-1 bg-surface-low focus-visible:ring-primary/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {UNITS.map((u) => (
                <SelectItem key={u} value={u}>
                  {LABELS[u]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] text-outline tracking-wider font-bold">
            CONVERTS TO
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={swap}
            title="Swap Units"
            className="rounded-full bg-surface-low text-primary hover:bg-surface-high"
          >
            <ArrowUpDown className="size-3.5" />
          </Button>
        </div>
        <Select value={to} onValueChange={(v) => handleUnitChange("to", v)}>
          <SelectTrigger className="w-full bg-surface-low focus-visible:ring-primary/20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {UNITS.map((u) => (
              <SelectItem key={u} value={u}>
                {LABELS[u]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </ToolCard>
  );
}
