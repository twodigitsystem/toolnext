"use client";

import {
  ArrowUpRight,
  Download,
  Hash,
  Image as ImageIcon,
  Link2,
  LockKeyhole,
  Shuffle,
} from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { ToolCard } from "@/components/landing-page/quick-tools/tool-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ToolOutput } from "./tool-output";

function ToolField({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  min,
  max,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  min?: number;
  max?: number;
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="text-xs font-semibold text-on-surface-variant"
      >
        {label}
      </label>
      <Input
        id={id}
        type={type}
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="bg-surface-low"
      />
    </div>
  );
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function PlaceholderImage() {
  const [width, setWidth] = useState("640");
  const [height, setHeight] = useState("360");
  const [label, setLabel] = useState("");
  const [background, setBackground] = useState("#E8EAFE");
  const [foreground, setForeground] = useState("#3730A3");

  const widthValue = Number(width);
  const heightValue = Number(height);
  const valid =
    Number.isInteger(widthValue) &&
    Number.isInteger(heightValue) &&
    widthValue >= 1 &&
    widthValue <= 4096 &&
    heightValue >= 1 &&
    heightValue <= 4096 &&
    /^#[\da-f]{6}$/i.test(background) &&
    /^#[\da-f]{6}$/i.test(foreground);
  const svg = valid
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="${widthValue}" height="${heightValue}" viewBox="0 0 ${widthValue} ${heightValue}"><rect width="100%" height="100%" fill="${background}"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="${foreground}" font-family="Arial, sans-serif" font-size="${Math.max(14, Math.min(widthValue, heightValue) / 12)}">${escapeXml(label || `${widthValue} × ${heightValue}`)}</text></svg>`
    : "";
  const dataUrl = useMemo(
    () =>
      svg ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}` : "",
    [svg],
  );

  return (
    <ToolCard
      icon={ImageIcon}
      title="Placeholder Image"
      badge="Image"
      footer={
        <p className="text-xs text-on-surface-variant">
          Creates a lightweight SVG locally. Maximum dimensions: 4096 × 4096.
        </p>
      }
    >
      <div className="grid grid-cols-2 gap-3">
        <ToolField
          id="placeholder-width"
          label="Width (px)"
          type="number"
          min={1}
          max={4096}
          value={width}
          onChange={setWidth}
        />
        <ToolField
          id="placeholder-height"
          label="Height (px)"
          type="number"
          min={1}
          max={4096}
          value={height}
          onChange={setHeight}
        />
      </div>
      <div className="mt-3 space-y-1.5">
        <label
          htmlFor="placeholder-label"
          className="text-xs font-semibold text-on-surface-variant"
        >
          Label
        </label>
        <Input
          id="placeholder-label"
          value={label}
          maxLength={120}
          onChange={(event) => setLabel(event.target.value)}
          placeholder={`${width || "Width"} × ${height || "height"}`}
          className="bg-surface-low"
        />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <ToolField
          id="placeholder-background"
          label="Background HEX"
          value={background}
          onChange={setBackground}
        />
        <ToolField
          id="placeholder-foreground"
          label="Text HEX"
          value={foreground}
          onChange={setForeground}
        />
      </div>
      {!valid && (
        <p role="alert" className="mt-3 text-xs text-destructive">
          Enter whole-number dimensions from 1 to 4096 and valid six-digit HEX
          colors.
        </p>
      )}
      {dataUrl && (
        <div className="mt-4 space-y-3">
          <div className="overflow-hidden rounded-xl border border-border bg-surface-low">
            <Image
              src={dataUrl}
              width={widthValue}
              height={heightValue}
              alt={label || `Placeholder image ${widthValue} by ${heightValue}`}
              unoptimized
              className="h-auto max-h-56 w-full object-contain"
            />
          </div>
          <Button asChild className="w-full">
            <a
              href={dataUrl}
              download={`placeholder-${widthValue}x${heightValue}.svg`}
            >
              <Download className="size-4" aria-hidden="true" />
              Download SVG
            </a>
          </Button>
        </div>
      )}
    </ToolCard>
  );
}

function secureRandomInteger(min: number, max: number) {
  const range = max - min + 1;
  if (!Number.isSafeInteger(range) || range < 1 || range > 0x100000000) {
    throw new Error("Choose a range no larger than 4,294,967,296 values.");
  }
  const limit = Math.floor(0x100000000 / range) * range;
  const buffer = new Uint32Array(1);
  let value: number;
  do {
    crypto.getRandomValues(buffer);
    value = buffer[0];
  } while (value >= limit);
  return min + (value % range);
}

export function RandomNumber() {
  const [min, setMin] = useState("1");
  const [max, setMax] = useState("100");
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState("");

  const generate = () => {
    const minValue = Number(min);
    const maxValue = Number(max);
    if (
      min.trim() === "" ||
      max.trim() === "" ||
      !Number.isSafeInteger(minValue) ||
      !Number.isSafeInteger(maxValue) ||
      minValue > maxValue
    ) {
      setError(
        "Enter whole numbers with a minimum no greater than the maximum.",
      );
      setResult(null);
      return;
    }
    try {
      setResult(secureRandomInteger(minValue, maxValue));
      setError("");
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not generate a number.",
      );
      setResult(null);
    }
  };

  return (
    <ToolCard
      icon={Shuffle}
      title="Random Number"
      badge="Generator"
      footer={
        <p className="text-xs text-on-surface-variant">
          Uses your browser’s cryptographic random-number generator. Both
          endpoints are included.
        </p>
      }
    >
      <div className="grid grid-cols-2 gap-3">
        <ToolField
          id="random-min"
          label="Minimum"
          type="number"
          value={min}
          onChange={setMin}
        />
        <ToolField
          id="random-max"
          label="Maximum"
          type="number"
          value={max}
          onChange={setMax}
        />
      </div>
      <Button type="button" className="mt-4 w-full" onClick={generate}>
        Generate number
      </Button>
      {error && (
        <p role="alert" className="mt-3 text-xs text-destructive">
          {error}
        </p>
      )}
      <div
        aria-live="polite"
        className="mt-4 rounded-xl bg-primary/5 p-5 text-center"
      >
        <p className="text-xs font-semibold text-on-surface-variant">
          Your number
        </p>
        <p className="mt-1 font-heading text-3xl font-bold text-primary">
          {result ?? "—"}
        </p>
      </div>
    </ToolCard>
  );
}

export function UtmLinkBuilder() {
  const [urlValue, setUrlValue] = useState("");
  const [source, setSource] = useState("");
  const [medium, setMedium] = useState("");
  const [campaign, setCampaign] = useState("");
  const [term, setTerm] = useState("");
  const [content, setContent] = useState("");

  const result = useMemo(() => {
    if (!urlValue.trim() || !source.trim()) return "";
    try {
      const url = new URL(urlValue.trim());
      if (url.protocol !== "http:" && url.protocol !== "https:") {
        return "";
      }
      url.searchParams.set("utm_source", source.trim());
      if (medium.trim()) url.searchParams.set("utm_medium", medium.trim());
      if (campaign.trim())
        url.searchParams.set("utm_campaign", campaign.trim());
      if (term.trim()) url.searchParams.set("utm_term", term.trim());
      if (content.trim()) url.searchParams.set("utm_content", content.trim());
      return url.toString();
    } catch {
      return "";
    }
  }, [campaign, content, medium, source, term, urlValue]);

  return (
    <ToolCard
      icon={Link2}
      title="UTM Link Builder"
      badge="SEO & web"
      footer={
        <p className="text-xs text-on-surface-variant">
          Existing query parameters are preserved. UTM fields are added or
          replaced in your browser.
        </p>
      }
    >
      <div className="space-y-3">
        <ToolField
          id="utm-url"
          label="Destination URL"
          value={urlValue}
          onChange={setUrlValue}
          placeholder="https://example.com/page"
        />
        <div className="grid grid-cols-2 gap-3">
          <ToolField
            id="utm-source"
            label="Source (required)"
            value={source}
            onChange={setSource}
            placeholder="newsletter"
          />
          <ToolField
            id="utm-medium"
            label="Medium"
            value={medium}
            onChange={setMedium}
            placeholder="email"
          />
          <ToolField
            id="utm-campaign"
            label="Campaign"
            value={campaign}
            onChange={setCampaign}
            placeholder="spring_launch"
          />
          <ToolField
            id="utm-term"
            label="Term"
            value={term}
            onChange={setTerm}
            placeholder="optional"
          />
        </div>
        <ToolField
          id="utm-content"
          label="Content"
          value={content}
          onChange={setContent}
          placeholder="optional"
        />
      </div>
      {!result && (urlValue || source) && (
        <p role="alert" className="mt-3 text-xs text-destructive">
          Enter a valid absolute HTTP or HTTPS URL and a source.
        </p>
      )}
      <div className="mt-3">
        <ToolOutput value={result} label="Campaign URL" rows={3} />
      </div>
    </ToolCard>
  );
}

export function UrlParser() {
  const [source, setSource] = useState("");
  const parsed = useMemo(() => {
    if (!source.trim()) return null;
    try {
      const url = new URL(source.trim());
      return {
        protocol: url.protocol,
        hostname: url.hostname,
        port: url.port || "(default)",
        pathname: url.pathname,
        query: url.search || "(none)",
        fragment: url.hash || "(none)",
        origin: url.origin,
      };
    } catch {
      return null;
    }
  }, [source]);

  return (
    <ToolCard
      icon={ArrowUpRight}
      title="URL Parser"
      badge="Network"
      footer={
        <p className="text-xs text-on-surface-variant">
          Parses locally; this tool does not request or visit the entered URL.
        </p>
      }
    >
      <label
        htmlFor="url-parser-input"
        className="mb-1.5 text-xs font-semibold text-on-surface-variant"
      >
        Absolute URL
      </label>
      <Input
        id="url-parser-input"
        type="url"
        value={source}
        onChange={(event) => setSource(event.target.value)}
        placeholder="https://example.com/path?query=value#section"
        className="bg-surface-low"
      />
      {!parsed && source && (
        <p role="alert" className="mt-2 text-xs text-destructive">
          Enter a valid absolute URL, including its scheme (for example
          https://).
        </p>
      )}
      {parsed && (
        <div className="mt-4 space-y-2">
          {Object.entries(parsed).map(([key, value]) => (
            <div
              key={key}
              className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-2 rounded-lg bg-surface-low px-3 py-2 text-xs"
            >
              <span className="font-semibold capitalize text-on-surface-variant">
                {key}
              </span>
              <code className="break-all text-on-surface">{value}</code>
            </div>
          ))}
        </div>
      )}
    </ToolCard>
  );
}

export function HashGenerator() {
  const [input, setInput] = useState("");
  const [algorithm, setAlgorithm] = useState<"SHA-256" | "SHA-384" | "SHA-512">(
    "SHA-256",
  );
  const [digest, setDigest] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const generate = async () => {
    if (!input) {
      setDigest("");
      setError("Enter text to hash.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const bytes = new TextEncoder().encode(input);
      const hash = await crypto.subtle.digest(algorithm, bytes);
      setDigest(
        Array.from(new Uint8Array(hash), (byte) =>
          byte.toString(16).padStart(2, "0"),
        ).join(""),
      );
    } catch {
      setDigest("");
      setError(
        "This browser could not create the hash. Use a modern browser over HTTPS.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolCard
      icon={Hash}
      title="Hash Generator"
      badge="Developer"
      footer={
        <p className="text-xs text-on-surface-variant">
          SHA-2 digest only. Hashing is one-way and is not encryption or a
          password-storage scheme.
        </p>
      }
    >
      <label
        htmlFor="hash-input"
        className="mb-1.5 text-xs font-semibold text-on-surface-variant"
      >
        Text to hash
      </label>
      <Textarea
        id="hash-input"
        value={input}
        onChange={(event) => {
          setInput(event.target.value);
          setDigest("");
          setError("");
        }}
        placeholder="Enter text to generate a digest"
        rows={3}
        className="resize-y bg-surface-low"
      />
      <label
        htmlFor="hash-algorithm"
        className="mb-1.5 mt-3 text-xs font-semibold text-on-surface-variant"
      >
        Algorithm
      </label>
      <select
        id="hash-algorithm"
        value={algorithm}
        onChange={(event) => {
          const value = event.target.value;
          if (value === "SHA-256" || value === "SHA-384" || value === "SHA-512")
            setAlgorithm(value);
        }}
        className="h-9 w-full rounded-lg border border-input bg-card px-3 text-sm text-on-surface"
      >
        <option value="SHA-256">SHA-256</option>
        <option value="SHA-384">SHA-384</option>
        <option value="SHA-512">SHA-512</option>
      </select>
      <Button
        type="button"
        className="mt-3 w-full"
        disabled={busy}
        onClick={() => void generate()}
      >
        <LockKeyhole className="size-4" aria-hidden="true" />
        {busy ? "Hashing…" : "Generate hash"}
      </Button>
      {error && (
        <p role="alert" className="mt-3 text-xs text-destructive">
          {error}
        </p>
      )}
      <div className="mt-3">
        <ToolOutput value={digest} label={`${algorithm} digest`} rows={3} />
      </div>
    </ToolCard>
  );
}
