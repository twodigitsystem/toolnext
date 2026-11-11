"use client";

import { Binary, Clock3, Globe2, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { ToolCard } from "@/components/landing-page/quick-tools/tool-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function parseUnixTimestamp(value: string) {
  const timestamp = Number(value.trim());
  if (!value.trim() || !Number.isFinite(timestamp)) return null;
  const milliseconds =
    Math.abs(timestamp) < 100_000_000_000 ? timestamp * 1000 : timestamp;
  const date = new Date(milliseconds);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function UnixTimestamp() {
  const [timestamp, setTimestamp] = useState("");
  const [dateTime, setDateTime] = useState("");
  const parsedDate = useMemo(
    () => (timestamp ? parseUnixTimestamp(timestamp) : null),
    [timestamp],
  );
  const selectedDate = dateTime ? new Date(dateTime) : null;
  const selectedDateValid =
    selectedDate !== null && Number.isFinite(selectedDate.getTime());

  return (
    <ToolCard
      icon={Clock3}
      title="Unix Timestamp Converter"
      badge="Date & time"
      footer={
        <p className="text-xs text-on-surface-variant">
          Timestamps below 100 billion are treated as seconds; larger values are
          milliseconds. ISO output is UTC.
        </p>
      }
    >
      <label
        htmlFor="unix-timestamp-input"
        className="mb-1.5 text-xs font-semibold text-on-surface-variant"
      >
        Unix timestamp
      </label>
      <Input
        id="unix-timestamp-input"
        inputMode="decimal"
        value={timestamp}
        onChange={(event) => setTimestamp(event.target.value)}
        placeholder="For example, 1700000000"
        className="bg-surface-low"
      />
      {timestamp && !parsedDate && (
        <p role="alert" className="mt-2 text-xs text-destructive">
          Enter a valid seconds or milliseconds timestamp.
        </p>
      )}
      {parsedDate && (
        <div className="mt-3 space-y-2 rounded-xl bg-primary/5 p-4">
          <p className="text-xs font-semibold text-on-surface-variant">
            UTC date
          </p>
          <p className="break-all font-mono text-sm text-primary">
            {parsedDate.toISOString()}
          </p>
          <p className="text-xs text-on-surface-variant">
            {Math.floor(parsedDate.getTime() / 1000)} seconds ·{" "}
            {parsedDate.getTime()} milliseconds
          </p>
        </div>
      )}
      <div className="my-5 border-t border-border" />
      <label
        htmlFor="unix-date-input"
        className="mb-1.5 text-xs font-semibold text-on-surface-variant"
      >
        Date and time
      </label>
      <Input
        id="unix-date-input"
        type="datetime-local"
        value={dateTime}
        onChange={(event) => setDateTime(event.target.value)}
        className="bg-surface-low"
      />
      {selectedDateValid && (
        <div className="mt-3 rounded-xl bg-surface-low p-4">
          <p className="text-xs text-on-surface-variant">
            {Math.floor(selectedDate.getTime() / 1000)} seconds
          </p>
          <p className="mt-1 text-xs text-on-surface-variant">
            {selectedDate.getTime()} milliseconds
          </p>
          <p className="mt-1 break-all font-mono text-xs text-on-surface">
            {selectedDate.toISOString()} UTC
          </p>
        </div>
      )}
    </ToolCard>
  );
}

/* ──────────────────────────────────────────────────────────────────────────────
 * Timestamp Converter (converter category)
 * ──────────────────────────────────────────────────────────────────────────── */

export function TimestampConverter() {
  const [timestamp, setTimestamp] = useState("");

  const result = useMemo(() => {
    if (!timestamp.trim()) return null;
    const num = Number(timestamp.trim());
    if (!Number.isFinite(num)) return null;
    const ms = Math.abs(num) < 100_000_000_000 ? num * 1000 : num;
    const date = new Date(ms);
    if (!Number.isFinite(date.getTime())) return null;
    return {
      utc: date.toISOString(),
      local: date.toLocaleString(),
      seconds: Math.floor(date.getTime() / 1000),
      milliseconds: date.getTime(),
    };
  }, [timestamp]);

  return (
    <ToolCard
      icon={Clock3}
      title="Timestamp Converter"
      badge="Convert"
      action={
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setTimestamp("")}
          disabled={!timestamp}
          aria-label="Clear"
        >
          <RotateCcw className="size-3.5" aria-hidden="true" />
          Clear
        </Button>
      }
      footer={
        <p className="text-xs text-on-surface-variant">
          Values below 100 billion are treated as seconds; larger as milliseconds.
        </p>
      }
    >
      <label
        htmlFor="ts-input"
        className="mb-1.5 text-xs font-semibold text-on-surface-variant"
      >
        Unix timestamp
      </label>
      <Input
        id="ts-input"
        inputMode="decimal"
        value={timestamp}
        onChange={(e) => setTimestamp(e.target.value)}
        placeholder="1700000000"
        className="bg-surface-low"
      />
      {timestamp && !result && (
        <p role="alert" className="mt-2 text-xs text-destructive">
          Enter a valid seconds or milliseconds timestamp.
        </p>
      )}
      {result && (
        <div className="mt-3 space-y-2 rounded-xl bg-primary/5 p-4">
          <div>
            <p className="text-xs text-on-surface-variant">UTC (ISO 8601)</p>
            <p className="break-all font-mono text-sm text-primary">{result.utc}</p>
          </div>
          <div>
            <p className="text-xs text-on-surface-variant">Local</p>
            <p className="text-sm text-on-surface">{result.local}</p>
          </div>
          <div className="flex gap-4 text-xs text-on-surface-variant">
            <span>{result.seconds} seconds</span>
            <span>{result.milliseconds} ms</span>
          </div>
        </div>
      )}
    </ToolCard>
  );
}

/* ──────────────────────────────────────────────────────────────────────────────
 * Timezone Converter (datetime category)
 * ──────────────────────────────────────────────────────────────────────────── */

const TIMEZONES = Intl.supportedValuesOf
  ? Intl.supportedValuesOf("timeZone")
  : [
      "UTC", "America/New_York", "America/Chicago", "America/Denver",
      "America/Los_Angeles", "Europe/London", "Europe/Paris", "Europe/Berlin",
      "Asia/Tokyo", "Asia/Shanghai", "Asia/Kolkata", "Australia/Sydney",
      "Pacific/Auckland",
    ];

export function TimezoneConverter() {
  const [fromTz, setFromTz] = useState("UTC");
  const [toTz, setToTz] = useState("America/New_York");
  const [now, setNow] = useState(() => new Date());

  const refresh = () => setNow(new Date());

  const formatInTz = (tz: string) =>
    new Intl.DateTimeFormat(undefined, {
      timeZone: tz,
      dateStyle: "full",
      timeStyle: "long",
    }).format(now);

  return (
    <ToolCard
      icon={Globe2}
      title="Timezone Converter"
      badge="Date & time"
      action={
        <Button type="button" variant="ghost" size="sm" onClick={refresh} aria-label="Refresh now">
          <RotateCcw className="size-3.5" aria-hidden="true" />
          Refresh
        </Button>
      }
      footer={
        <p className="text-xs text-on-surface-variant">
          Shows the current moment formatted in two timezones. Click Refresh to update.
        </p>
      }
    >
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label htmlFor="tz-from" className="text-xs font-semibold text-on-surface-variant">
            From
          </label>
          <Select value={fromTz} onValueChange={setFromTz}>
            <SelectTrigger id="tz-from" className="bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {TIMEZONES.map((tz) => (
                <SelectItem key={tz} value={tz}>
                  {tz.replace(/_/g, " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <label htmlFor="tz-to" className="text-xs font-semibold text-on-surface-variant">
            To
          </label>
          <Select value={toTz} onValueChange={setToTz}>
            <SelectTrigger id="tz-to" className="bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {TIMEZONES.map((tz) => (
                <SelectItem key={tz} value={tz}>
                  {tz.replace(/_/g, " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="mt-4 space-y-2 rounded-xl bg-primary/5 p-4">
        <p className="text-xs text-on-surface-variant">
          {fromTz.replace(/_/g, " ")}
        </p>
        <p className="text-sm font-semibold text-on-surface">{formatInTz(fromTz)}</p>
        <div className="border-t border-border/50" />
        <p className="text-xs text-on-surface-variant">
          {toTz.replace(/_/g, " ")}
        </p>
        <p className="text-sm font-semibold text-primary">{formatInTz(toTz)}</p>
        <p className="mt-1 text-[11px] text-on-surface-variant">
          Difference: {formatInTz(fromTz) !== formatInTz(toTz) ? "different day/time" : "same time"}
        </p>
      </div>
    </ToolCard>
  );
}

/* ──────────────────────────────────────────────────────────────────────────────
 * Number Base Converter
 * ──────────────────────────────────────────────────────────────────────────── */

export function NumberBaseConverter() {
  const [number, setNumber] = useState("255");
  const [fromBase, setFromBase] = useState("10");

  const decimal = fromBase === "10" ? Number(number) : Number.parseInt(number, Number(fromBase));
  const valid = number.trim() !== "" && Number.isFinite(decimal);

  return (
    <ToolCard
      icon={Binary}
      title="Number Base Converter"
      badge="Convert"
      footer={<p className="text-xs text-on-surface-variant">Convert between binary, octal, decimal, and hexadecimal.</p>}
    >
      <div className="flex gap-3">
        <div className="flex-1 space-y-1.5">
          <label htmlFor="nb-number" className="text-xs font-semibold text-on-surface-variant">Number</label>
          <input id="nb-number" value={number} onChange={(e) => setNumber(e.target.value)} className="h-9 w-full rounded-lg border border-input bg-surface-low px-3 font-mono text-sm text-on-surface" />
        </div>
        <div className="w-24 space-y-1.5">
          <label htmlFor="nb-base" className="text-xs font-semibold text-on-surface-variant">Base</label>
          <select id="nb-base" value={fromBase} onChange={(e) => setFromBase(e.target.value)} className="h-9 w-full rounded-lg border border-input bg-card px-3 text-sm text-on-surface">
            <option value="2">Binary</option>
            <option value="8">Octal</option>
            <option value="10">Decimal</option>
            <option value="16">Hex</option>
          </select>
        </div>
      </div>
      {!valid && number.trim() && <p className="mt-1 text-xs text-destructive">Invalid number for the selected base.</p>}
      {valid && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          {[
            ["Binary", decimal.toString(2)],
            ["Octal", decimal.toString(8)],
            ["Decimal", decimal.toString(10)],
            ["Hex", decimal.toString(16).toUpperCase()],
          ].map(([label, val]) => (
            <div key={label} className="rounded-xl bg-primary/5 p-3">
              <p className="text-[10px] text-on-surface-variant">{label}</p>
              <p className="break-all font-mono text-sm font-bold text-primary">{val}</p>
            </div>
          ))}
        </div>
      )}
    </ToolCard>
  );
}

/* ──────────────────────────────────────────────────────────────────────────────
 * Roman Numeral Converter
 * ──────────────────────────────────────────────────────────────────────────── */

const ROMAN_MAP: [number, string][] = [
  [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
  [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
  [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
];

function toRoman(n: number): string {
  if (n <= 0 || n >= 4000 || !Number.isInteger(n)) return "";
  let result = "";
  let remaining = n;
  for (const [value, symbol] of ROMAN_MAP) {
    while (remaining >= value) {
      result += symbol;
      remaining -= value;
    }
  }
  return result;
}

function fromRoman(s: string): number {
  const romanValues: Record<string, number> = { M: 1000, D: 500, C: 100, L: 50, X: 10, V: 5, I: 1 };
  let total = 0;
  let prev = 0;
  for (let i = s.length - 1; i >= 0; i--) {
    const curr = romanValues[s[i]] ?? 0;
    if (curr === 0) return 0;
    total += curr < prev ? -curr : curr;
    prev = curr;
  }
  return total;
}

export function RomanNumeral() {
  const [number, setNumber] = useState("2024");
  const [roman, setRoman] = useState("MMXXIV");
  const n = Number(number);
  const numValid = Number.isInteger(n) && n >= 1 && n <= 3999;
  const romanStr = numValid ? toRoman(n) : "";

  return (
    <ToolCard
      icon={Binary}
      title="Roman Numeral"
      badge="Convert"
      footer={<p className="text-xs text-on-surface-variant">Supports numbers 1–3999.</p>}
    >
      <div className="space-y-3">
        <div className="space-y-1.5">
          <label htmlFor="rn-number" className="text-xs font-semibold text-on-surface-variant">Number</label>
          <div className="flex gap-2">
            <input id="rn-number" type="number" min="1" max="3999" value={number} onChange={(e) => { setNumber(e.target.value); setRoman(fromRoman(roman) === Number(e.target.value) ? roman : ""); }} className="h-9 flex-1 rounded-lg border border-input bg-surface-low px-3 text-sm text-on-surface" />
            <span className="flex items-center text-xs text-on-surface-variant">→</span>
            <input readOnly value={romanStr} className="h-9 flex-1 rounded-lg border border-input bg-surface-low px-3 font-mono text-sm text-on-surface" />
          </div>
        </div>
        <div className="space-y-1.5">
          <label htmlFor="rn-roman" className="text-xs font-semibold text-on-surface-variant">Roman numeral</label>
          <div className="flex gap-2">
            <input id="rn-roman" value={roman} onChange={(e) => { setRoman(e.target.value.toUpperCase()); setNumber(String(fromRoman(e.target.value.toUpperCase())) || ""); }} className="h-9 flex-1 rounded-lg border border-input bg-surface-low px-3 font-mono text-sm text-on-surface" />
            <span className="flex items-center text-xs text-on-surface-variant">→</span>
            <input readOnly value={fromRoman(roman) > 0 ? String(fromRoman(roman)) : "?"} className="h-9 flex-1 rounded-lg border border-input bg-surface-low px-3 text-sm text-on-surface" />
          </div>
        </div>
      </div>
      {number && !numValid && <p className="mt-1 text-xs text-destructive">Enter a whole number between 1 and 3999.</p>}
    </ToolCard>
  );
}

/* ──────────────────────────────────────────────────────────────────────────────
 * Binary Converter (text to binary and back)
 * ──────────────────────────────────────────────────────────────────────────── */

function textToBinary(text: string) {
  const bytes = new TextEncoder().encode(text);
  return Array.from(bytes, (b) => b.toString(2).padStart(8, "0")).join(" ");
}

function binaryToText(bin: string) {
  const cleaned = bin.replace(/\s+/g, "");
  if (!/^[01]+$/.test(cleaned) || cleaned.length % 8 !== 0) return null;
  const bytes = new Uint8Array(cleaned.match(/.{8}/g)!.map((b) => Number.parseInt(b, 2)));
  return new TextDecoder().decode(bytes);
}

export function BinaryConverter() {
  const [text, setText] = useState("");
  const [binary, setBinary] = useState("");

  const textToBin = () => { setBinary(textToBinary(text)); };
  const binToText = () => {
    const result = binaryToText(binary);
    if (result !== null) setText(result);
  };

  return (
    <ToolCard
      icon={Binary}
      title="Binary Converter"
      badge="Convert"
      footer={<p className="text-xs text-on-surface-variant">Converts UTF-8 text to binary and back.</p>}
    >
      <label htmlFor="bin-text" className="text-xs font-semibold text-on-surface-variant">Text</label>
      <div className="flex gap-2 mt-1">
        <input id="bin-text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Hello" className="h-9 flex-1 rounded-lg border border-input bg-surface-low px-3 text-sm text-on-surface" />
        <Button type="button" variant="outline" size="sm" onClick={textToBin}>→</Button>
      </div>
      <label htmlFor="bin-binary" className="mt-3 block text-xs font-semibold text-on-surface-variant">Binary</label>
      <div className="flex gap-2 mt-1">
        <input id="bin-binary" value={binary} onChange={(e) => setBinary(e.target.value)} placeholder="01001000 01100101" className="h-9 flex-1 rounded-lg border border-input bg-surface-low px-3 font-mono text-xs text-on-surface" />
        <Button type="button" variant="outline" size="sm" onClick={binToText}>←</Button>
      </div>
      {binary && !/^[01\s]+$/.test(binary) && <p className="mt-1 text-xs text-destructive">Binary can only contain 0 and 1.</p>}
    </ToolCard>
  );
}
