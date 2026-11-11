"use client";

import { Dices, Fingerprint, KeyRound, QrCode, RotateCcw, RefreshCw, Copy } from "lucide-react";
import { useState, useCallback } from "react";
import { toast } from "sonner";
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

/* ──────────────────────────────────────────────────────────────────────────────
 * Password Generator
 * ──────────────────────────────────────────────────────────────────────────── */

const PASSWORD_LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const PASSWORD_UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const PASSWORD_DIGITS = "0123456789";
const PASSWORD_SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";

function generatePassword(
  length: number,
  useLower: boolean,
  useUpper: boolean,
  useDigits: boolean,
  useSymbols: boolean,
): string {
  let chars = "";
  if (useLower) chars += PASSWORD_LOWERCASE;
  if (useUpper) chars += PASSWORD_UPPERCASE;
  if (useDigits) chars += PASSWORD_DIGITS;
  if (useSymbols) chars += PASSWORD_SYMBOLS;

  if (!chars) return "";

  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (n) => chars[n % chars.length]).join("");
}

function estimateEntropy(length: number, poolSize: number) {
  if (poolSize === 0) return 0;
  return Math.round(length * Math.log2(poolSize));
}

export function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [useLower, setUseLower] = useState(true);
  const [useUpper, setUseUpper] = useState(true);
  const [useDigits, setUseDigits] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [result, setResult] = useState("");

  const generate = useCallback(() => {
    const pw = generatePassword(length, useLower, useUpper, useDigits, useSymbols);
    setResult(pw);
  }, [length, useLower, useUpper, useDigits, useSymbols]);

  const poolSize =
    (useLower ? PASSWORD_LOWERCASE.length : 0) +
    (useUpper ? PASSWORD_UPPERCASE.length : 0) +
    (useDigits ? PASSWORD_DIGITS.length : 0) +
    (useSymbols ? PASSWORD_SYMBOLS.length : 0);

  const entropy = estimateEntropy(length, poolSize);

  const copyPassword = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      toast.success("Password copied to clipboard.");
    } catch {
      toast.error("Could not copy to clipboard.");
    }
  };

  return (
    <ToolCard
      icon={KeyRound}
      title="Password Generator"
      badge="Generator"
      action={
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={generate}
          aria-label="Generate new password"
        >
          <RefreshCw className="size-3.5" aria-hidden="true" />
          Regenerate
        </Button>
      }
      footer={
        <p className="text-xs text-on-surface-variant">
          {poolSize === 0
            ? "Select at least one character set."
            : `${poolSize} characters · ${entropy} bits of entropy`}
        </p>
      }
    >
      <div className="flex items-center gap-3">
        <label
          htmlFor="password-length"
          className="text-xs font-semibold text-on-surface-variant"
        >
          Length: {length}
        </label>
        <input
          id="password-length"
          type="range"
          min="4"
          max="128"
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="flex-1 accent-primary"
        />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {[
          { id: "pw-lower", label: "a–z", checked: useLower, set: setUseLower },
          { id: "pw-upper", label: "A–Z", checked: useUpper, set: setUseUpper },
          { id: "pw-digits", label: "0–9", checked: useDigits, set: setUseDigits },
          { id: "pw-symbols", label: "!@#$%", checked: useSymbols, set: setUseSymbols },
        ].map(({ id, label, checked, set }) => (
          <label
            key={id}
            className="flex cursor-pointer items-center gap-2 rounded-xl border border-input bg-surface-low px-3 py-2 text-xs font-medium text-on-surface has-[:checked]:border-primary has-[:checked]:bg-primary/5"
          >
            <input
              id={id}
              type="checkbox"
              checked={checked}
              onChange={(e) => set(e.target.checked)}
              className="size-3.5 accent-primary"
            />
            {label}
          </label>
        ))}
      </div>
      <Button type="button" className="mt-3 w-full" onClick={generate}>
        Generate password
      </Button>
      {result && (
        <div className="mt-3">
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={result}
              className="flex-1 h-10 rounded-lg border border-input bg-surface-low px-3 font-mono text-sm text-on-surface"
              aria-label="Generated password"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={copyPassword}
              aria-label="Copy password"
            >
              <Copy className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </ToolCard>
  );
}

/* ──────────────────────────────────────────────────────────────────────────────
 * QR Code Generator
 * ──────────────────────────────────────────────────────────────────────────── */

export function QrCodeGenerator() {
  const [text, setText] = useState("https://toolnext.vercel.app");
  const [error, setError] = useState("");
  const [dataUrl, setDataUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!text.trim()) {
      setError("Enter a URL or text to encode.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const QRCode = (await import("qrcode")).default;
      const url = await QRCode.toDataURL(text.trim(), {
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      });
      setDataUrl(url);
    } catch (cause) {
      setDataUrl("");
      setError(
        cause instanceof Error ? cause.message : "Failed to generate QR code.",
      );
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    if (!dataUrl) return;
    const link = document.createElement("a");
    link.download = "qr-code.png";
    link.href = dataUrl;
    link.click();
  };

  return (
    <ToolCard
      icon={QrCode}
      title="QR Code Generator"
      badge="Generator"
      action={
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            setText("");
            setDataUrl("");
            setError("");
          }}
          disabled={!text && !dataUrl}
          aria-label="Clear"
        >
          <RotateCcw className="size-3.5" aria-hidden="true" />
          Clear
        </Button>
      }
      footer={
        <p className="text-xs text-on-surface-variant">
          QR codes are generated entirely in your browser. Nothing is sent to a
          server.
        </p>
      }
    >
      <label
        htmlFor="qr-input"
        className="mb-1.5 block text-xs font-semibold text-on-surface-variant"
      >
        URL or text to encode
      </label>
      <input
        id="qr-input"
        type="text"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setError("");
        }}
        placeholder="https://example.com"
        className="h-10 w-full rounded-lg border border-input bg-surface-low px-3 text-sm text-on-surface"
      />
      <Button
        type="button"
        className="mt-3 w-full"
        onClick={generate}
        disabled={loading || !text.trim()}
      >
        {loading ? "Generating…" : "Generate QR code"}
      </Button>
      {error && (
        <p role="alert" className="mt-2 text-xs text-destructive">
          {error}
        </p>
      )}
      {dataUrl && (
        <div className="mt-4 flex flex-col items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={dataUrl}
            alt={`QR code for ${text}`}
            className="rounded-xl border border-border"
            width={200}
            height={200}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={download}
          >
            Download PNG
          </Button>
        </div>
      )}
    </ToolCard>
  );
}
