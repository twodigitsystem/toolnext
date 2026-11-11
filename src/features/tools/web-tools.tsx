"use client";

import {
  ArrowUpRight,
  Crop,
  Download,
  FileCode,
  Hash,
  Image as ImageIcon,
  Link2,
  LockKeyhole,
  Shuffle,
  Upload,
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

/* ──────────────────────────────────────────────────────────────────────────────
 * Meta Tag Generator (SEO)
 * ──────────────────────────────────────────────────────────────────────────── */

export function MetaTagGenerator() {
  const [title, setTitle] = useState("My Amazing Page");
  const [description, setDescription] = useState("Discover the best tools for developers and creators.");
  const [url, setUrl] = useState("https://example.com");
  const [image, setImage] = useState("https://example.com/og-image.png");
  const [siteName, setSiteName] = useState("ToolNext");

  const metaTags = useMemo(() => {
    const tags = [
      `<title>${escapeXml(title)}</title>`,
      `<meta name="description" content="${escapeXml(description)}" />`,
      `<meta property="og:title" content="${escapeXml(title)}" />`,
      `<meta property="og:description" content="${escapeXml(description)}" />`,
      `<meta property="og:url" content="${escapeXml(url)}" />`,
      `<meta property="og:type" content="website" />`,
      `<meta name="twitter:card" content="summary_large_image" />`,
      `<meta name="twitter:title" content="${escapeXml(title)}" />`,
      `<meta name="twitter:description" content="${escapeXml(description)}" />`,
    ];
    if (image.trim()) {
      tags.push(`<meta property="og:image" content="${escapeXml(image.trim())}" />`);
      tags.push(`<meta name="twitter:image" content="${escapeXml(image.trim())}" />`);
    }
    if (siteName.trim()) {
      tags.push(`<meta property="og:site_name" content="${escapeXml(siteName.trim())}" />`);
    }
    return tags.join("\n");
  }, [title, description, url, image, siteName]);

  return (
    <ToolCard
      icon={FileCode}
      title="Meta Tag Generator"
      badge="SEO & web"
      footer={
        <p className="text-xs text-on-surface-variant">
          Generates Open Graph and Twitter Card meta tags for your HTML head.
        </p>
      }
    >
      <div className="space-y-3">
        <ToolField id="meta-title" label="Page title" value={title} onChange={setTitle} />
        <ToolField id="meta-desc" label="Description" value={description} onChange={setDescription} />
        <ToolField id="meta-url" label="Page URL" value={url} onChange={setUrl} placeholder="https://example.com" />
        <div className="grid grid-cols-2 gap-3">
          <ToolField id="meta-image" label="OG image URL" value={image} onChange={setImage} />
          <ToolField id="meta-site" label="Site name" value={siteName} onChange={setSiteName} />
        </div>
      </div>
      <div className="mt-3">
        <ToolOutput value={metaTags} label="Meta tags" rows={8} />
      </div>
    </ToolCard>
  );
}

/* ──────────────────────────────────────────────────────────────────────────────
 * Image Resizer
 * ──────────────────────────────────────────────────────────────────────────── */

export function ImageResizer() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [width, setWidth] = useState("400");
  const [height, setHeight] = useState("300");
  const [maintainAspect, setMaintainAspect] = useState(true);
  const [resultUrl, setResultUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResultUrl("");
    setError("");

    // Set initial dimensions from image
    const img = new window.Image();
    img.onload = () => {
      setWidth(String(img.naturalWidth));
      setHeight(String(img.naturalHeight));
    };
    img.src = URL.createObjectURL(f);
  };

  const resize = () => {
    if (!file) {
      setError("Select an image first.");
      return;
    }
    const w = Number(width);
    const h = Number(height);
    if (!Number.isInteger(w) || !Number.isInteger(h) || w < 1 || h < 1 || w > 4096 || h > 4096) {
      setError("Dimensions must be whole numbers from 1 to 4096.");
      return;
    }
    setBusy(true);
    setError("");

    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setError("Your browser does not support canvas operations.");
        setBusy(false);
        return;
      }
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, w, h);
      const dataUrl = canvas.toDataURL(file?.type || "image/png", 0.92);
      setResultUrl(dataUrl);
      setBusy(false);
    };
    img.onerror = () => {
      setError("Could not load the image.");
      setBusy(false);
    };
    img.src = preview;
  };

  const download = () => {
    if (!resultUrl) return;
    const link = document.createElement("a");
    const ext = file?.type.split("/")[1] || "png";
    link.download = `resized-${width}x${height}.${ext}`;
    link.href = resultUrl;
    link.click();
  };

  return (
    <ToolCard
      icon={Crop}
      title="Image Resizer"
      badge="Image"
      footer={
        <p className="text-xs text-on-surface-variant">
          All processing happens locally in your browser. Original image is not uploaded.
        </p>
      }
    >
      <div className="space-y-3">
        <label
          htmlFor="image-resizer-file"
          className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-input bg-surface-low p-6 text-center hover:border-primary/50 transition-colors"
        >
          <Upload className="size-6 text-on-surface-variant" aria-hidden="true" />
          <span className="text-sm font-medium text-on-surface-variant">
            {file ? file.name : "Click to choose an image"}
          </span>
          <span className="text-xs text-outline">
            PNG, JPEG, WebP, GIF, BMP
          </span>
          <input
            id="image-resizer-file"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif,image/bmp"
            onChange={handleFile}
            className="hidden"
          />
        </label>
        {preview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="Preview"
            className="max-h-40 w-full rounded-xl border border-border object-contain bg-surface-low"
          />
        )}
        <div className="grid grid-cols-2 gap-3">
          <ToolField
            id="resize-width"
            label="Width (px)"
            type="number"
            min={1}
            max={4096}
            value={width}
            onChange={(v) => {
              setWidth(v);
              if (maintainAspect && file && Number(v) > 0) {
                const ratio = Number(v) / Number(width);
                if (Number.isFinite(ratio)) {
                  setHeight(String(Math.round(Number(height) * ratio)));
                }
              }
            }}
          />
          <ToolField
            id="resize-height"
            label="Height (px)"
            type="number"
            min={1}
            max={4096}
            value={height}
            onChange={(v) => {
              setHeight(v);
              if (maintainAspect && file && Number(v) > 0) {
                const ratio = Number(v) / Number(height);
                if (Number.isFinite(ratio)) {
                  setWidth(String(Math.round(Number(width) * ratio)));
                }
              }
            }}
          />
        </div>
        <label className="flex items-center gap-2 text-xs text-on-surface-variant cursor-pointer">
          <input
            type="checkbox"
            checked={maintainAspect}
            onChange={(e) => setMaintainAspect(e.target.checked)}
            className="size-3.5 accent-primary"
          />
          Maintain aspect ratio
        </label>
      </div>
      <Button
        type="button"
        className="mt-3 w-full"
        onClick={() => resize()}
        disabled={busy || !file}
      >
        {busy ? "Resizing…" : "Resize image"}
      </Button>
      {error && <p role="alert" className="mt-2 text-xs text-destructive">{error}</p>}
      {resultUrl && (
        <div className="mt-4 space-y-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={resultUrl}
            alt="Resized result"
            className="max-h-48 w-full rounded-xl border border-border object-contain bg-surface-low"
          />
          <Button type="button" variant="outline" className="w-full" onClick={download}>
            <Download className="size-4 mr-2" />
            Download resized image
          </Button>
        </div>
      )}
    </ToolCard>
  );
}

/* ──────────────────────────────────────────────────────────────────────────────
 * Image Compressor
 * ──────────────────────────────────────────────────────────────────────────── */

export function ImageCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [quality, setQuality] = useState("0.7");
  const [resultUrl, setResultUrl] = useState("");
  const [originalSize, setOriginalSize] = useState(0);
  const [resultSize, setResultSize] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResultUrl("");
    setOriginalSize(f.size);
    setError("");
  };

  const compress = () => {
    if (!file) { setError("Select an image first."); return; }
    const q = Number(quality);
    if (q < 0.01 || q > 1) { setError("Quality must be between 0.01 and 1."); return; }
    setBusy(true); setError("");

    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) { setError("Canvas not supported."); setBusy(false); return; }
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (!blob) { setError("Compression failed."); setBusy(false); return; }
        setResultUrl(URL.createObjectURL(blob));
        setResultSize(blob.size);
        setBusy(false);
      }, file.type || "image/jpeg", q);
    };
    img.onerror = () => { setError("Could not load image."); setBusy(false); };
    img.src = preview;
  };

  const download = () => {
    if (!resultUrl) return;
    const link = document.createElement("a");
    const ext = file?.type.split("/")[1] || "jpg";
    link.download = `compressed.${ext}`;
    link.href = resultUrl;
    link.click();
  };

  const savings = originalSize > 0 && resultSize > 0
    ? Math.round((1 - resultSize / originalSize) * 100)
    : 0;

  return (
    <ToolCard
      icon={Hash}
      title="Image Compressor"
      badge="Image"
      footer={<p className="text-xs text-on-surface-variant">All processing happens locally. Nothing is uploaded.</p>}
    >
      <label
        htmlFor="ic-file"
        className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-input bg-surface-low p-6 text-center hover:border-primary/50 transition-colors"
      >
        <span className="text-sm font-medium text-on-surface-variant">
          {file ? file.name : "Click to choose an image"}
        </span>
        <input id="ic-file" type="file" accept="image/png,image/jpeg,image/webp" onChange={handleFile} className="hidden" />
      </label>
      {preview && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt="Preview" className="mt-3 max-h-32 w-full rounded-xl border border-border object-contain bg-surface-low" />
      )}
      {file && (
        <div className="mt-3 space-y-1.5">
          <label htmlFor="ic-quality" className="text-xs font-semibold text-on-surface-variant">
            Quality: {quality} ({Math.round(originalSize / 1024)} KB → {Math.round(resultSize / 1024)} KB)
          </label>
          <input id="ic-quality" type="range" min="0.01" max="1" step="0.01" value={quality} onChange={(e) => setQuality(e.target.value)} className="w-full accent-primary" />
        </div>
      )}
      <Button type="button" className="mt-3 w-full" onClick={compress} disabled={busy || !file}>
        {busy ? "Compressing…" : "Compress image"}
      </Button>
      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
      {resultUrl && (
        <div className="mt-4 space-y-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={resultUrl} alt="Compressed" className="max-h-40 w-full rounded-xl border border-border object-contain bg-surface-low" />
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded-xl bg-surface-low p-2">
              <p className="font-bold text-on-surface">{Math.round(originalSize / 1024)} KB</p>
              <p className="text-on-surface-variant">Original</p>
            </div>
            <div className="rounded-xl bg-surface-low p-2">
              <p className="font-bold text-on-surface">{Math.round(resultSize / 1024)} KB</p>
              <p className="text-on-surface-variant">Compressed</p>
            </div>
            <div className="rounded-xl bg-green-500/10 p-2">
              <p className="font-bold text-green-600">{savings}%</p>
              <p className="text-on-surface-variant">Saved</p>
            </div>
          </div>
          <Button type="button" variant="outline" className="w-full" onClick={download}>
            <Download className="size-4 mr-2" />
            Download compressed image
          </Button>
        </div>
      )}
    </ToolCard>
  );
}
