"use client";

import {
  Captions,
  Circle,
  MessageCircle,
  RotateCcw,
  Shuffle,
} from "lucide-react";
import { useState } from "react";
import { ToolCard } from "@/components/landing-page/quick-tools/tool-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ToolOutput } from "./tool-output";

function formatSubtitles(source: string, direction: "srt-vtt" | "vtt-srt") {
  const normalized = source.replace(/\r\n?/g, "\n").trim();
  if (!normalized) throw new Error("Paste subtitle cues to convert.");

  const blocks = normalized
    .split(/\n[ \t]*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  if (direction === "vtt-srt") {
    const header = blocks.shift();
    if (!header || !/^WEBVTT(?:[ \t].*)?$/.test(header.split("\n")[0])) {
      throw new Error("WebVTT input must start with a WEBVTT header.");
    }
  }

  const output: string[] = [];
  let cueNumber = 1;
  for (const block of blocks) {
    const lines = block.split("\n");
    if (/^(NOTE|STYLE|REGION)(?:\s|$)/.test(lines[0])) {
      throw new Error("NOTE, STYLE, and REGION blocks are not supported.");
    }
    const timingIndex = lines.findIndex((line) => line.includes("-->"));
    if (timingIndex < 0) {
      if (
        direction === "vtt-srt" &&
        !output.length &&
        /^WEBVTT(?:[ \t].*)?$/.test(lines[0])
      )
        continue;
      throw new Error("A cue is missing its start --> end timestamp line.");
    }
    const match = lines[timingIndex].match(
      /^(\d{2}:\d{2}:\d{2})[,.](\d{3}) --> (\d{2}:\d{2}:\d{2})[,.](\d{3})$/,
    );
    if (!match) {
      throw new Error(
        "Use simple HH:MM:SS,mmm SRT or HH:MM:SS.mmm WebVTT timestamps without cue settings.",
      );
    }
    if (Number(match[2]) > 59 || Number(match[4]) > 59) {
      throw new Error(
        "Subtitle timestamps must use valid minute and second values.",
      );
    }
    const cueText = lines.slice(timingIndex + 1);
    if (!cueText.some((line) => line.trim())) {
      throw new Error("Every subtitle cue needs text.");
    }
    const punctuation = direction === "srt-vtt" ? "." : ",";
    const timestamps = `${match[1]}${punctuation}${match[2]} --> ${match[3]}${punctuation}${match[4]}`;
    output.push(
      direction === "srt-vtt"
        ? [timestamps, ...cueText].join("\n")
        : [String(cueNumber++), timestamps, ...cueText].join("\n"),
    );
  }

  if (!output.length) throw new Error("No supported subtitle cues were found.");
  return direction === "srt-vtt"
    ? `WEBVTT\n\n${output.join("\n\n")}`
    : output.join("\n\n");
}

export function SubtitleConverter() {
  const [direction, setDirection] = useState<"srt-vtt" | "vtt-srt">("srt-vtt");
  const [source, setSource] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const convert = () => {
    try {
      setResult(formatSubtitles(source, direction));
      setError("");
    } catch (cause) {
      setResult("");
      setError(
        cause instanceof Error ? cause.message : "Could not convert subtitles.",
      );
    }
  };

  return (
    <ToolCard
      icon={Captions}
      title="Subtitle Converter"
      badge="Media"
      action={
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={!source && !result && !error}
          onClick={() => {
            setSource("");
            setResult("");
            setError("");
          }}
          aria-label="Clear subtitle text"
        >
          <RotateCcw className="size-3.5" aria-hidden="true" />
          Clear
        </Button>
      }
      footer={
        <p className="text-xs text-on-surface-variant">
          Converts simple SRT and WebVTT cue text locally. Advanced cue settings
          and metadata blocks are not supported.
        </p>
      }
    >
      <label
        htmlFor="subtitle-format"
        className="mb-1.5 text-xs font-semibold text-on-surface-variant"
      >
        Conversion
      </label>
      <select
        id="subtitle-format"
        value={direction}
        onChange={(event) => {
          if (
            event.target.value === "srt-vtt" ||
            event.target.value === "vtt-srt"
          ) {
            setDirection(event.target.value);
            setResult("");
            setError("");
          }
        }}
        className="h-9 w-full rounded-lg border border-input bg-card px-3 text-sm text-on-surface"
      >
        <option value="srt-vtt">SRT to WebVTT</option>
        <option value="vtt-srt">WebVTT to SRT</option>
      </select>
      <label
        htmlFor="subtitle-input"
        className="mb-1.5 mt-3 text-xs font-semibold text-on-surface-variant"
      >
        Subtitle text
      </label>
      <Textarea
        id="subtitle-input"
        value={source}
        onChange={(event) => {
          setSource(event.target.value);
          setResult("");
          setError("");
        }}
        placeholder={
          direction === "srt-vtt"
            ? "1\n00:00:01,000 --> 00:00:03,000\nHello!"
            : "WEBVTT\n\n00:00:01.000 --> 00:00:03.000\nHello!"
        }
        rows={6}
        spellCheck={false}
        className="resize-y bg-surface-low font-mono text-xs"
      />
      <Button type="button" className="mt-3 w-full" onClick={convert}>
        Convert subtitles
      </Button>
      {error && (
        <p role="alert" className="mt-3 text-xs text-destructive">
          {error}
        </p>
      )}
      <div className="mt-3">
        <ToolOutput
          value={result}
          label={direction === "srt-vtt" ? "WebVTT output" : "SRT output"}
          rows={6}
        />
      </div>
    </ToolCard>
  );
}

export function WhatsAppLink() {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const digits = phone.replace(/\D/g, "");
  const validPhone = digits.length >= 7 && digits.length <= 15;
  const result = validPhone
    ? `https://wa.me/${digits}${message ? `?text=${encodeURIComponent(message)}` : ""}`
    : "";

  return (
    <ToolCard
      icon={MessageCircle}
      title="WhatsApp Link"
      badge="Social"
      footer={
        <p className="text-xs text-on-surface-variant">
          Use an international number with country code. This creates a link; it
          does not send a message.
        </p>
      }
    >
      <label
        htmlFor="whatsapp-phone"
        className="mb-1.5 text-xs font-semibold text-on-surface-variant"
      >
        Phone number
      </label>
      <Input
        id="whatsapp-phone"
        type="tel"
        autoComplete="tel"
        value={phone}
        onChange={(event) => setPhone(event.target.value)}
        placeholder="+1 555 123 4567"
        className="bg-surface-low"
      />
      <p className="mt-1 text-[11px] text-outline">
        Enter 7–15 digits, including your country code.
      </p>
      <label
        htmlFor="whatsapp-message"
        className="mb-1.5 mt-3 text-xs font-semibold text-on-surface-variant"
      >
        Optional message
      </label>
      <Textarea
        id="whatsapp-message"
        value={message}
        maxLength={1000}
        onChange={(event) => setMessage(event.target.value)}
        placeholder="Hi! I wanted to get in touch."
        rows={3}
        className="resize-y bg-surface-low"
      />
      {!!phone && !validPhone && (
        <p role="alert" className="mt-2 text-xs text-destructive">
          Enter a valid international phone number with 7–15 digits.
        </p>
      )}
      <div className="mt-3">
        <ToolOutput value={result} label="WhatsApp link" rows={2} />
      </div>
    </ToolCard>
  );
}

export function CoinFlip() {
  const [result, setResult] = useState<"Heads" | "Tails" | null>(null);
  const [flips, setFlips] = useState({ heads: 0, tails: 0 });
  const [error, setError] = useState("");

  const flip = () => {
    try {
      const buffer = new Uint32Array(1);
      crypto.getRandomValues(buffer);
      const outcome = buffer[0] % 2 === 0 ? "Heads" : "Tails";
      setResult(outcome);
      setFlips((previous) => ({
        heads: previous.heads + Number(outcome === "Heads"),
        tails: previous.tails + Number(outcome === "Tails"),
      }));
      setError("");
    } catch {
      setError("Your browser could not generate a random result.");
    }
  };

  const reset = () => {
    setResult(null);
    setFlips({ heads: 0, tails: 0 });
    setError("");
  };

  return (
    <ToolCard
      icon={Circle}
      title="Coin Flip"
      badge="Utility"
      action={
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={reset}
          disabled={!result}
          aria-label="Reset coin flip"
        >
          <RotateCcw className="size-3.5" aria-hidden="true" />
          Reset
        </Button>
      }
      footer={
        <p className="text-xs text-on-surface-variant">
          Random result generated on this device. Not intended for cryptographic
          or high-stakes use.
        </p>
      }
    >
      <div
        aria-live="polite"
        className="flex min-h-40 flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10"
      >
        <div className="flex size-20 items-center justify-center rounded-full border border-primary/20 bg-card shadow-sm">
          <span className="font-heading text-center text-sm font-bold text-primary">
            {result ?? "Ready?"}
          </span>
        </div>
        <p className="mt-3 text-sm font-semibold text-on-surface">
          {result ?? "Flip the coin"}
        </p>
      </div>
      <Button type="button" className="mt-4 w-full" onClick={flip}>
        <Shuffle className="size-4" aria-hidden="true" />
        Flip coin
      </Button>
      <div className="mt-3 flex justify-center gap-6 text-xs text-on-surface-variant">
        <span>Heads: {flips.heads}</span>
        <span>Tails: {flips.tails}</span>
      </div>
      {error && (
        <p role="alert" className="mt-2 text-center text-xs text-destructive">
          {error}
        </p>
      )}
    </ToolCard>
  );
}
