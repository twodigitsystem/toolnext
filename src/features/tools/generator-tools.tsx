"use client";

import { Dices, Fingerprint } from "lucide-react";
import { useState } from "react";
import { ToolCard } from "@/components/landing-page/quick-tools/tool-card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToolOutput } from "./tool-output";

function createUuidV4() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0"));
  return `${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}-${hex
    .slice(6, 8)
    .join("")}-${hex.slice(8, 10).join("")}-${hex.slice(10).join("")}`;
}

export function UuidGenerator() {
  const [count, setCount] = useState("1");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const generate = () => {
    const quantity = Number(count);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100) {
      setResult("");
      setError("Choose a whole number between 1 and 100.");
      return;
    }
    try {
      setResult(Array.from({ length: quantity }, createUuidV4).join("\n"));
      setError("");
    } catch {
      setResult("");
      setError("Your browser could not generate secure random values.");
    }
  };

  return (
    <ToolCard
      icon={Fingerprint}
      title="UUID Generator"
      badge="Developer"
      footer={
        <p className="text-xs text-on-surface-variant">
          Generates random UUID version 4 identifiers in this browser.
        </p>
      }
    >
      <label
        htmlFor="uuid-count"
        className="mb-1.5 block text-xs font-semibold text-on-surface-variant"
      >
        Number of UUIDs (1–100)
      </label>
      <input
        id="uuid-count"
        type="number"
        min="1"
        max="100"
        step="1"
        value={count}
        onChange={(event) => setCount(event.target.value)}
        className="h-10 w-full rounded-lg border border-input bg-surface-low px-3 text-sm text-on-surface"
      />
      <Button type="button" className="mt-3 w-full" onClick={generate}>
        Generate UUIDs
      </Button>
      {error && (
        <p role="alert" className="mt-3 text-xs text-destructive">
          {error}
        </p>
      )}
      <div className="mt-3">
        <ToolOutput value={result} label="UUID v4 output" rows={5} />
      </div>
    </ToolCard>
  );
}

function secureRandomIndex(max: number) {
  const limit = Math.floor(0x1_0000_0000 / max) * max;
  const buffer = new Uint32Array(1);
  let value: number;
  do {
    crypto.getRandomValues(buffer);
    value = buffer[0];
  } while (value >= limit);
  return value % max;
}

export function RandomPicker() {
  const [source, setSource] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const options = source
    .split(/\r\n?|\n/u)
    .map((option) => option.trim())
    .filter(Boolean);

  const pick = () => {
    if (!options.length) {
      setResult("");
      setError("Enter at least one non-empty option, one per line.");
      return;
    }
    try {
      setResult(options[secureRandomIndex(options.length)]);
      setError("");
    } catch {
      setResult("");
      setError("Your browser could not generate a secure random choice.");
    }
  };

  return (
    <ToolCard
      icon={Dices}
      title="Random Picker"
      badge="Generator"
      footer={
        <p className="text-xs text-on-surface-variant">
          Each non-empty line is one option. Duplicate lines count as separate
          choices.
        </p>
      }
    >
      <label
        htmlFor="random-picker-options"
        className="mb-1.5 block text-xs font-semibold text-on-surface-variant"
      >
        Options (one per line)
      </label>
      <Textarea
        id="random-picker-options"
        value={source}
        onChange={(event) => {
          setSource(event.target.value);
          setError("");
        }}
        placeholder={"Pizza\nTacos\nPasta"}
        rows={5}
        className="resize-y bg-surface-low"
      />
      <Button type="button" className="mt-3 w-full" onClick={pick}>
        Pick one
      </Button>
      {error && (
        <p role="alert" className="mt-3 text-xs text-destructive">
          {error}
        </p>
      )}
      <div aria-live="polite" className="mt-3">
        <ToolOutput value={result} label="Selected option" rows={2} />
      </div>
    </ToolCard>
  );
}
