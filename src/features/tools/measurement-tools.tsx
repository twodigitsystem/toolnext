"use client";

import {
  Banknote,
  CalendarDays,
  Pipette,
  Receipt,
  Thermometer,
} from "lucide-react";
import { useMemo, useState } from "react";
import { ToolCard } from "@/components/landing-page/quick-tools/tool-card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToolOutput } from "./tool-output";

type TemperatureUnit = "C" | "F" | "K";

const temperatureUnits: Record<TemperatureUnit, string> = {
  C: "Celsius (°C)",
  F: "Fahrenheit (°F)",
  K: "Kelvin (K)",
};

function convertTemperature(
  value: number,
  from: TemperatureUnit,
  to: TemperatureUnit,
) {
  const celsius =
    from === "C"
      ? value
      : from === "F"
        ? ((value - 32) * 5) / 9
        : value - 273.15;
  return to === "C"
    ? celsius
    : to === "F"
      ? (celsius * 9) / 5 + 32
      : celsius + 273.15;
}

function displayNumber(value: number) {
  return Number(value.toFixed(4)).toLocaleString(undefined, {
    maximumFractionDigits: 4,
  });
}

function displayPrice(value: number) {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function TemperatureConverter() {
  const [value, setValue] = useState("20");
  const [from, setFrom] = useState<TemperatureUnit>("C");
  const [to, setTo] = useState<TemperatureUnit>("F");
  const number = Number(value);
  const celsius =
    from === "C"
      ? number
      : from === "F"
        ? ((number - 32) * 5) / 9
        : number - 273.15;
  const valid =
    value.trim() !== "" && Number.isFinite(number) && celsius >= -273.150000001;
  const result = valid ? convertTemperature(number, from, to) : null;

  return (
    <ToolCard
      icon={Thermometer}
      title="Temperature Converter"
      badge="Convert"
      footer={
        <p className="text-xs text-on-surface-variant">
          Kelvin cannot be below absolute zero (0 K).
        </p>
      }
    >
      <label
        htmlFor="temperature-value"
        className="mb-1.5 text-xs font-semibold text-on-surface-variant"
      >
        Temperature
      </label>
      <Input
        id="temperature-value"
        type="number"
        step="any"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="bg-surface-low"
      />
      <div className="mt-3 grid grid-cols-2 gap-3">
        {(
          [
            ["From", from, setFrom],
            ["To", to, setTo],
          ] as const
        ).map(([label, selected, onChange]) => (
          <div key={label} className="space-y-1.5">
            <label
              htmlFor={`temperature-${label.toLowerCase()}`}
              className="text-xs font-semibold text-on-surface-variant"
            >
              {label}
            </label>
            <Select
              value={selected}
              onValueChange={(next) => {
                if (next === "C" || next === "F" || next === "K")
                  onChange(next);
              }}
            >
              <SelectTrigger
                id={`temperature-${label.toLowerCase()}`}
                className="bg-card"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(temperatureUnits).map(([unit, unitLabel]) => (
                  <SelectItem key={unit} value={unit}>
                    {unitLabel}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
      {value.trim() !== "" && !valid && (
        <p role="alert" className="mt-3 text-xs text-destructive">
          Temperatures cannot be below absolute zero (0 K).
        </p>
      )}
      <div className="mt-4 rounded-xl bg-primary/5 p-4">
        <p className="text-xs font-semibold text-on-surface-variant">
          Converted temperature
        </p>
        <p className="mt-1 font-heading text-2xl font-bold text-primary">
          {result === null
            ? "—"
            : `${displayNumber(result)}${to === "K" ? " K" : ` °${to}`}`}
        </p>
      </div>
    </ToolCard>
  );
}

export function DiscountCalculator() {
  const [price, setPrice] = useState("100");
  const [discount, setDiscount] = useState("20");
  const original = Number(price);
  const percent = Number(discount);
  const valid =
    price.trim() !== "" &&
    discount.trim() !== "" &&
    Number.isFinite(original) &&
    Number.isFinite(percent) &&
    original >= 0 &&
    percent >= 0 &&
    percent <= 100;
  const savings = valid ? (original * percent) / 100 : null;
  const finalPrice = savings === null ? null : original - savings;

  return (
    <ToolCard
      icon={Receipt}
      title="Discount Calculator"
      badge="Calculate"
      footer={
        <p className="text-xs text-on-surface-variant">
          Results use the same currency unit as your entered price.
        </p>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label
            htmlFor="discount-price"
            className="text-xs font-semibold text-on-surface-variant"
          >
            Original price
          </label>
          <Input
            id="discount-price"
            type="number"
            min="0"
            step="any"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            className="bg-surface-low"
          />
        </div>
        <div className="space-y-1.5">
          <label
            htmlFor="discount-percent"
            className="text-xs font-semibold text-on-surface-variant"
          >
            Discount
          </label>
          <div className="relative">
            <Input
              id="discount-percent"
              type="number"
              min="0"
              max="100"
              step="any"
              value={discount}
              onChange={(event) => setDiscount(event.target.value)}
              className="bg-surface-low pr-8"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-outline">
              %
            </span>
          </div>
        </div>
      </div>
      {!valid && (
        <p role="alert" className="mt-3 text-xs text-destructive">
          Enter a price of zero or more and a discount from 0% to 100%.
        </p>
      )}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-primary/5 p-4">
          <p className="text-xs font-semibold text-on-surface-variant">
            You save
          </p>
          <p className="mt-1 font-heading text-xl font-bold text-primary">
            {savings === null ? "—" : displayPrice(savings)}
          </p>
        </div>
        <div className="rounded-xl bg-emerald-500/10 p-4">
          <p className="text-xs font-semibold text-on-surface-variant">
            Sale price
          </p>
          <p className="mt-1 font-heading text-xl font-bold text-emerald-700 dark:text-emerald-300">
            {finalPrice === null ? "—" : displayPrice(finalPrice)}
          </p>
        </div>
      </div>
    </ToolCard>
  );
}

export function TipCalculator() {
  const [bill, setBill] = useState("50");
  const [tipPercent, setTipPercent] = useState("18");
  const [people, setPeople] = useState("2");
  const amount = Number(bill);
  const percent = Number(tipPercent);
  const split = Number(people);
  const valid =
    bill.trim() !== "" &&
    tipPercent.trim() !== "" &&
    people.trim() !== "" &&
    Number.isFinite(amount) &&
    Number.isFinite(percent) &&
    Number.isInteger(split) &&
    amount >= 0 &&
    percent >= 0 &&
    split >= 1;
  const tip = valid ? (amount * percent) / 100 : null;
  const total = tip === null ? null : amount + tip;
  const perPerson = total === null ? null : total / split;

  return (
    <ToolCard
      icon={Banknote}
      title="Tip Calculator"
      badge="Calculate"
      footer={
        <p className="text-xs text-on-surface-variant">
          Results use the same currency unit as the bill amount.
        </p>
      }
    >
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="space-y-1.5">
          <label
            htmlFor="tip-bill"
            className="text-xs font-semibold text-on-surface-variant"
          >
            Bill amount
          </label>
          <Input
            id="tip-bill"
            type="number"
            min="0"
            step="any"
            value={bill}
            onChange={(event) => setBill(event.target.value)}
            className="bg-surface-low"
          />
        </div>
        <div className="space-y-1.5">
          <label
            htmlFor="tip-percent"
            className="text-xs font-semibold text-on-surface-variant"
          >
            Tip percentage
          </label>
          <Input
            id="tip-percent"
            type="number"
            min="0"
            step="any"
            value={tipPercent}
            onChange={(event) => setTipPercent(event.target.value)}
            className="bg-surface-low"
          />
        </div>
        <div className="space-y-1.5">
          <label
            htmlFor="tip-people"
            className="text-xs font-semibold text-on-surface-variant"
          >
            People
          </label>
          <Input
            id="tip-people"
            type="number"
            min="1"
            step="1"
            value={people}
            onChange={(event) => setPeople(event.target.value)}
            className="bg-surface-low"
          />
        </div>
      </div>
      {!valid && (
        <p role="alert" className="mt-3 text-xs text-destructive">
          Enter a non-negative bill and tip, plus at least one whole person.
        </p>
      )}
      <div className="mt-4 grid grid-cols-3 gap-2">
        {[
          ["Tip", tip],
          ["Total", total],
          ["Per person", perPerson],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl bg-primary/5 p-3 text-center">
            <p className="text-xs font-semibold text-on-surface-variant">
              {label}
            </p>
            <p className="mt-1 font-heading text-lg font-bold text-primary">
              {typeof value === "number" ? displayPrice(value) : "—"}
            </p>
          </div>
        ))}
      </div>
    </ToolCard>
  );
}

function getIsoWeek(dateValue: string) {
  const date = new Date(`${dateValue}T00:00:00.000Z`);
  if (!Number.isFinite(date.getTime())) return null;
  const day = (date.getUTCDay() + 6) % 7;
  date.setUTCDate(date.getUTCDate() - day + 3);
  const firstThursday = new Date(Date.UTC(date.getUTCFullYear(), 0, 4));
  firstThursday.setUTCDate(
    firstThursday.getUTCDate() - ((firstThursday.getUTCDay() + 6) % 7) + 3,
  );
  const days = Math.round(
    (date.getTime() - firstThursday.getTime()) / 86400000,
  );
  return { year: date.getUTCFullYear(), week: 1 + Math.floor(days / 7) };
}

export function WeekNumber() {
  const [date, setDate] = useState("");
  const result = useMemo(() => (date ? getIsoWeek(date) : null), [date]);

  return (
    <ToolCard
      icon={CalendarDays}
      title="ISO Week Number"
      badge="Date & time"
      footer={
        <p className="text-xs text-on-surface-variant">
          Uses ISO 8601 weeks, starting on Monday. Week 1 contains the year’s
          first Thursday.
        </p>
      }
    >
      <label
        htmlFor="week-date"
        className="mb-1.5 text-xs font-semibold text-on-surface-variant"
      >
        Choose a date
      </label>
      <Input
        id="week-date"
        type="date"
        value={date}
        onChange={(event) => setDate(event.target.value)}
        className="bg-surface-low"
      />
      {result ? (
        <div className="mt-4 rounded-xl bg-primary/5 p-4">
          <p className="text-xs font-semibold text-on-surface-variant">
            ISO week for {date}
          </p>
          <p className="mt-1 font-heading text-2xl font-bold text-primary">
            Week {result.week}
          </p>
          <p className="mt-1 text-xs text-on-surface-variant">
            ISO week-year {result.year}
          </p>
        </div>
      ) : (
        <p className="mt-4 rounded-xl bg-surface-low p-4 text-sm text-on-surface-variant">
          Select a date to find its ISO week number.
        </p>
      )}
    </ToolCard>
  );
}

function parseHex(value: string) {
  const normalized = value.trim().replace(/^#/, "");
  if (!/^(?:[\da-f]{3}|[\da-f]{6})$/i.test(normalized)) return null;
  const expanded =
    normalized.length === 3
      ? normalized
          .split("")
          .map((digit) => digit + digit)
          .join("")
      : normalized;
  return {
    hex: `#${expanded.toUpperCase()}`,
    r: Number.parseInt(expanded.slice(0, 2), 16),
    g: Number.parseInt(expanded.slice(2, 4), 16),
    b: Number.parseInt(expanded.slice(4, 6), 16),
  };
}

export function HexToRgb() {
  const [hex, setHex] = useState("#4F46E5");
  const color = parseHex(hex);

  return (
    <ToolCard
      icon={Pipette}
      title="HEX to RGB"
      badge="Color"
      footer={
        <p className="text-xs text-on-surface-variant">
          Supports 3-digit and 6-digit hexadecimal colors, with or without #.
        </p>
      }
    >
      <label
        htmlFor="hex-color"
        className="mb-1.5 text-xs font-semibold text-on-surface-variant"
      >
        HEX color
      </label>
      <div className="flex items-center gap-2">
        <Input
          id="hex-color"
          value={hex}
          onChange={(event) => setHex(event.target.value)}
          spellCheck={false}
          placeholder="#4F46E5"
          className="bg-surface-low font-mono uppercase"
        />
        <span
          role="img"
          className="size-10 shrink-0 rounded-lg border border-border"
          style={{ backgroundColor: color?.hex ?? "transparent" }}
          aria-label={
            color ? `Preview of ${color.hex}` : "Invalid color preview"
          }
        />
      </div>
      {!color && (
        <p role="alert" className="mt-2 text-xs text-destructive">
          Enter a valid 3-digit or 6-digit HEX color.
        </p>
      )}
      <ToolOutput
        label="RGB value"
        value={color ? `rgb(${color.r}, ${color.g}, ${color.b})` : ""}
      />
      {color && (
        <p className="text-center font-mono text-xs text-on-surface-variant">
          {color.hex}
        </p>
      )}
    </ToolCard>
  );
}

/* ──────────────────────────────────────────────────────────────────────────────
 * RGB to HEX
 * ──────────────────────────────────────────────────────────────────────────── */

export function RgbToHex() {
  const [r, setR] = useState("79");
  const [g, setG] = useState("70");
  const [b, setB] = useState("229");

  const valid = [r, g, b].every((v) => {
    const n = Number(v);
    return Number.isInteger(n) && n >= 0 && n <= 255;
  });

  const hex = valid
    ? `#${[r, g, b].map((v) => Number(v).toString(16).padStart(2, "0").toUpperCase()).join("")}`
    : "";

  return (
    <ToolCard
      icon={Pipette}
      title="RGB to HEX"
      badge="Color"
      footer={<p className="text-xs text-on-surface-variant">Each value must be 0–255.</p>}
    >
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "R", value: r, set: setR },
          { label: "G", value: g, set: setG },
          { label: "B", value: b, set: setB },
        ].map(({ label, value, set }) => (
          <div key={label} className="space-y-1.5">
            <label htmlFor={`rgb-${label}`} className="text-xs font-semibold text-on-surface-variant">{label}</label>
            <input id={`rgb-${label}`} type="number" min="0" max="255" value={value} onChange={(e) => set(e.target.value)} className="h-9 w-full rounded-lg border border-input bg-surface-low px-3 text-sm text-on-surface" />
          </div>
        ))}
      </div>
      {!valid && <p role="alert" className="mt-2 text-xs text-destructive">All values must be whole numbers between 0 and 255.</p>}
      {hex && (
        <div className="mt-4 flex items-center gap-3">
          <span className="size-10 shrink-0 rounded-lg border border-border" style={{ backgroundColor: hex }} />
          <ToolOutput value={hex} label="HEX value" />
        </div>
      )}
    </ToolCard>
  );
}

/* ──────────────────────────────────────────────────────────────────────────────
 * HSL Converter
 * ──────────────────────────────────────────────────────────────────────────── */

function hslToRgb(h: number, s: number, l: number) {
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else { r = c; b = x; }
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

export function HslConverter() {
  const [h, setH] = useState("260");
  const [s, setS] = useState("75");
  const [l, setL] = useState("58");

  const valid = [h, s, l].every((v) => Number.isFinite(Number(v)))
    && Number(h) >= 0 && Number(h) <= 360
    && Number(s) >= 0 && Number(s) <= 100
    && Number(l) >= 0 && Number(l) <= 100;

  const rgb = valid ? hslToRgb(Number(h), Number(s), Number(l)) : null;
  const hex = rgb ? `#${[rgb.r, rgb.g, rgb.b].map((v) => v.toString(16).padStart(2, "0").toUpperCase()).join("")}` : "";

  return (
    <ToolCard
      icon={Pipette}
      title="HSL Converter"
      badge="Color"
      footer={<p className="text-xs text-on-surface-variant">Hue 0–360, Saturation & Lightness 0–100%.</p>}
    >
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "H", value: h, set: setH },
          { label: "S%", value: s, set: setS },
          { label: "L%", value: l, set: setL },
        ].map(({ label, value, set }) => (
          <div key={label} className="space-y-1.5">
            <label className="text-xs font-semibold text-on-surface-variant">{label}</label>
            <input type="number" min="0" max={label === "H" ? "360" : "100"} value={value} onChange={(e) => set(e.target.value)} className="h-9 w-full rounded-lg border border-input bg-surface-low px-3 text-sm text-on-surface" />
          </div>
        ))}
      </div>
      {!valid && <p role="alert" className="mt-2 text-xs text-destructive">Check ranges: H 0–360, S & L 0–100.</p>}
      {rgb && (
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-3">
            <span className="size-10 shrink-0 rounded-lg border border-border" style={{ backgroundColor: hex }} />
            <div className="flex-1">
              <p className="font-mono text-sm font-bold text-primary">{hex}</p>
              <p className="font-mono text-xs text-on-surface-variant">rgb({rgb.r}, {rgb.g}, {rgb.b})</p>
            </div>
          </div>
        </div>
      )}
    </ToolCard>
  );
}

/* ──────────────────────────────────────────────────────────────────────────────
 * Contrast Checker
 * ──────────────────────────────────────────────────────────────────────────── */

function hexToRgbValues(hex: string): { r: number; g: number; b: number } | null {
  const n = hex.trim().replace(/^#/, "");
  if (!/^(?:[\da-f]{3}|[\da-f]{6})$/i.test(n)) return null;
  const e = n.length === 3 ? n.split("").map((d) => d + d).join("") : n;
  return { r: Number.parseInt(e.slice(0, 2), 16), g: Number.parseInt(e.slice(2, 4), 16), b: Number.parseInt(e.slice(4, 6), 16) };
}

function relativeLuminance(r: number, g: number, b: number) {
  const [rs, gs, bs] = [r, g, b].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(c1: string, c2: string) {
  const rgb1 = hexToRgbValues(c1);
  const rgb2 = hexToRgbValues(c2);
  if (!rgb1 || !rgb2) return null;
  const l1 = relativeLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = relativeLuminance(rgb2.r, rgb2.g, rgb2.b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function wcagLevel(ratio: number) {
  const aa = ratio >= 4.5 ? "Pass" : ratio >= 3 ? "Pass (large)" : "Fail";
  const aaa = ratio >= 7 ? "Pass" : "Fail";
  return { aa, aaa };
}

export function ContrastChecker() {
  const [fg, setFg] = useState("#000000");
  const [bg, setBg] = useState("#FFFFFF");

  const ratio = contrastRatio(fg, bg);
  const level = ratio ? wcagLevel(ratio) : null;

  return (
    <ToolCard
      icon={Pipette}
      title="Contrast Checker"
      badge="Color"
      footer={<p className="text-xs text-on-surface-variant">WCAG 2.1 AA requires 4.5:1 (normal) or 3:1 (large). AAA requires 7:1.</p>}
    >
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label htmlFor="cc-fg" className="text-xs font-semibold text-on-surface-variant">Foreground</label>
          <div className="flex items-center gap-2">
            <input id="cc-fg" value={fg} onChange={(e) => setFg(e.target.value)} className="h-9 flex-1 rounded-lg border border-input bg-surface-low px-3 font-mono text-sm text-on-surface" />
            <span className="size-8 shrink-0 rounded-lg border border-border" style={{ backgroundColor: fg }} />
          </div>
        </div>
        <div className="space-y-1.5">
          <label htmlFor="cc-bg" className="text-xs font-semibold text-on-surface-variant">Background</label>
          <div className="flex items-center gap-2">
            <input id="cc-bg" value={bg} onChange={(e) => setBg(e.target.value)} className="h-9 flex-1 rounded-lg border border-input bg-surface-low px-3 font-mono text-sm text-on-surface" />
            <span className="size-8 shrink-0 rounded-lg border border-border" style={{ backgroundColor: bg }} />
          </div>
        </div>
      </div>
      {ratio !== null && level ? (
        <div className="mt-4 space-y-3">
          <div className="rounded-xl bg-primary/5 p-4 text-center">
            <p className="text-xs text-on-surface-variant">Contrast ratio</p>
            <p className="font-heading text-3xl font-bold text-primary">{ratio.toFixed(2)}:1</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className={`rounded-xl p-3 text-center text-sm font-semibold ${level.aa === "Fail" ? "bg-destructive/10 text-destructive" : "bg-green-500/10 text-green-700"}`}>
              AA: {level.aa}
            </div>
            <div className={`rounded-xl p-3 text-center text-sm font-semibold ${level.aaa === "Fail" ? "bg-destructive/10 text-destructive" : "bg-green-500/10 text-green-700"}`}>
              AAA: {level.aaa}
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 rounded-xl p-4 text-sm font-semibold" style={{ backgroundColor: bg, color: fg }}>
            Preview text
          </div>
        </div>
      ) : (
        <p className="mt-3 text-xs text-destructive">Enter valid 3- or 6-digit HEX colors.</p>
      )}
    </ToolCard>
  );
}
