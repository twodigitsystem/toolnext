"use client";

import {
  ArrowLeftRight,
  Braces,
  CaseSensitive,
  Hash,
  Link2,
  ListFilter,
  RotateCcw,
  TextCursorInput,
} from "lucide-react";
import { useState } from "react";
import { ToolCard } from "@/components/landing-page/quick-tools/tool-card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ToolOutput } from "./tool-output";

type CaseStyle = "upper" | "lower" | "title" | "camel" | "snake";
const caseStyles: CaseStyle[] = ["upper", "lower", "title", "camel", "snake"];

function isCaseStyle(value: string): value is CaseStyle {
  return caseStyles.some((style) => style === value);
}

function wordsFromText(text: string) {
  return text.match(/[\p{L}\p{N}]+/gu) ?? [];
}

function convertCase(text: string, style: CaseStyle) {
  const words = wordsFromText(text);
  switch (style) {
    case "upper":
      return text.toLocaleUpperCase();
    case "lower":
      return text.toLocaleLowerCase();
    case "title":
      return text
        .toLocaleLowerCase()
        .replace(
          /(^|[\s\p{P}])(\p{L})/gu,
          (_match, separator: string, letter: string) =>
            separator + letter.toLocaleUpperCase(),
        );
    case "camel":
      return words
        .map((word, index) => {
          const lower = word.toLocaleLowerCase();
          return index === 0
            ? lower
            : lower[0].toLocaleUpperCase() + lower.slice(1);
        })
        .join("");
    case "snake":
      return words.map((word) => word.toLocaleLowerCase()).join("_");
  }
}

const caseLabels: Record<CaseStyle, string> = {
  upper: "UPPERCASE",
  lower: "lowercase",
  title: "Title Case",
  camel: "camelCase",
  snake: "snake_case",
};

function splitGraphemes(text: string) {
  if (typeof Intl.Segmenter === "undefined") return Array.from(text);
  return Array.from(
    new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(text),
    ({ segment }) => segment,
  );
}

export function CaseConverter() {
  const [text, setText] = useState("");
  const [style, setStyle] = useState<CaseStyle>("title");
  const result = convertCase(text, style);

  return (
    <ToolCard
      icon={CaseSensitive}
      title="Case Converter"
      badge="Text"
      action={
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setText("")}
          disabled={!text}
          aria-label="Clear text"
        >
          <RotateCcw className="size-3.5" aria-hidden="true" />
          Clear
        </Button>
      }
      footer={
        <p className="text-xs text-on-surface-variant">
          {wordsFromText(text).length} words · {text.length} characters
        </p>
      }
    >
      <label
        htmlFor="case-input"
        className="mb-1.5 text-xs font-semibold text-on-surface-variant"
      >
        Text to convert
      </label>
      <Textarea
        id="case-input"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Type or paste text here"
        rows={4}
        className="resize-y bg-surface-low"
      />
      <Select
        value={style}
        onValueChange={(value) => {
          if (isCaseStyle(value)) setStyle(value);
        }}
      >
        <SelectTrigger aria-label="Output case" className="mt-3">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(caseLabels).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <ToolOutput value={result} label="Converted text" />
    </ToolCard>
  );
}

export function JsonFormatter() {
  const [source, setSource] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const format = () => {
    try {
      const parsed: unknown = JSON.parse(source);
      setResult(JSON.stringify(parsed, null, 2));
      setError("");
    } catch (cause) {
      setResult("");
      setError(cause instanceof Error ? cause.message : "Invalid JSON input.");
    }
  };

  return (
    <ToolCard
      icon={Braces}
      title="JSON Formatter"
      badge="Developer"
      action={
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            setSource("");
            setResult("");
            setError("");
          }}
          disabled={!source && !result && !error}
          aria-label="Clear JSON"
        >
          <RotateCcw className="size-3.5" aria-hidden="true" />
          Clear
        </Button>
      }
      footer={
        <p className="text-xs text-on-surface-variant">
          Formatting happens in this browser. Input is not saved by this tool.
        </p>
      }
    >
      <label
        htmlFor="json-input"
        className="mb-1.5 text-xs font-semibold text-on-surface-variant"
      >
        JSON input
      </label>
      <Textarea
        id="json-input"
        value={source}
        onChange={(event) => {
          setSource(event.target.value);
          setError("");
        }}
        placeholder={'{"name":"ToolNext","ready":true}'}
        rows={5}
        spellCheck={false}
        className="resize-y bg-surface-low font-mono text-xs"
      />
      <Button type="button" className="mt-3 w-full" onClick={format}>
        Format and validate
      </Button>
      {error && (
        <p role="alert" className="mt-3 text-sm text-destructive">
          Invalid JSON: {error}
        </p>
      )}
      <ToolOutput value={result} label="Formatted JSON" rows={7} />
    </ToolCard>
  );
}

export function CharacterCounter() {
  const [text, setText] = useState("");
  const characters = splitGraphemes(text);
  const nonWhitespace = characters.filter(
    (character) => !/\s/u.test(character),
  );
  const words = text.match(/[\p{L}\p{N}]+/gu) ?? [];

  return (
    <ToolCard
      icon={Hash}
      title="Character Counter"
      badge="Text"
      footer={
        <p className="text-xs text-on-surface-variant">
          Counts user-perceived characters, including combined emoji, where
          supported by your browser.
        </p>
      }
    >
      <label
        htmlFor="character-counter-input"
        className="mb-1.5 text-xs font-semibold text-on-surface-variant"
      >
        Text to count
      </label>
      <Textarea
        id="character-counter-input"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Type or paste text here"
        rows={5}
        className="resize-y bg-surface-low"
      />
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["Characters", characters.length],
          ["Without whitespace", nonWhitespace.length],
          ["Words", words.length],
          ["Lines", text ? text.split(/\r\n?|\n/).length : 0],
        ].map(([label, count]) => (
          <div key={label} className="rounded-xl bg-primary/5 p-3 text-center">
            <p className="font-heading text-xl font-bold text-primary">
              {count}
            </p>
            <p className="mt-1 text-[11px] text-on-surface-variant">{label}</p>
          </div>
        ))}
      </div>
    </ToolCard>
  );
}

type ReverseMode = "characters" | "words" | "lines";

export function TextReverser() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<ReverseMode>("characters");
  const result =
    mode === "characters"
      ? splitGraphemes(text).reverse().join("")
      : mode === "words"
        ? text
            .split(/(\s+)/u)
            .filter((part) => !/^\s+$/u.test(part))
            .reverse()
            .join(" ")
        : text
            .split(/\r\n?|\n/u)
            .reverse()
            .join("\n");

  return (
    <ToolCard
      icon={ArrowLeftRight}
      title="Text Reverser"
      badge="Text"
      footer={
        <p className="text-xs text-on-surface-variant">
          Uses grapheme-aware character boundaries where supported by your
          browser.
        </p>
      }
    >
      <label
        htmlFor="text-reverser-input"
        className="mb-1.5 text-xs font-semibold text-on-surface-variant"
      >
        Text to reverse
      </label>
      <Textarea
        id="text-reverser-input"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Type or paste text here"
        rows={4}
        className="resize-y bg-surface-low"
      />
      <label
        htmlFor="text-reverser-mode"
        className="mb-1.5 mt-3 block text-xs font-semibold text-on-surface-variant"
      >
        Reverse
      </label>
      <select
        id="text-reverser-mode"
        value={mode}
        onChange={(event) => {
          if (
            event.target.value === "characters" ||
            event.target.value === "words" ||
            event.target.value === "lines"
          ) {
            setMode(event.target.value);
          }
        }}
        className="h-9 w-full rounded-lg border border-input bg-card px-3 text-sm text-on-surface"
      >
        <option value="characters">Character order</option>
        <option value="words">Word order</option>
        <option value="lines">Line order</option>
      </select>
      <div className="mt-3">
        <ToolOutput value={result} label="Reversed text" />
      </div>
    </ToolCard>
  );
}

export function RemoveDuplicateLines() {
  const [text, setText] = useState("");
  const lines = text.split(/\r\n?|\n/u);
  const uniqueLines = [...new Set(lines)];
  const result = text ? uniqueLines.join("\n") : "";

  return (
    <ToolCard
      icon={ListFilter}
      title="Remove Duplicate Lines"
      badge="Text"
      footer={
        <p className="text-xs text-on-surface-variant">
          Keeps the first occurrence of each exact line; matching is
          case-sensitive.
        </p>
      }
    >
      <label
        htmlFor="duplicate-lines-input"
        className="mb-1.5 text-xs font-semibold text-on-surface-variant"
      >
        Lines to check
      </label>
      <Textarea
        id="duplicate-lines-input"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder={"apple\nbanana\napple"}
        rows={5}
        className="resize-y bg-surface-low"
      />
      <p className="mt-2 text-xs text-on-surface-variant">
        {text ? lines.length - uniqueLines.length : 0} duplicate lines removed
      </p>
      <div className="mt-3">
        <ToolOutput value={result} label="Unique lines" />
      </div>
    </ToolCard>
  );
}

export function SlugGenerator() {
  const [text, setText] = useState("");
  const result = text
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/gu, "");

  return (
    <ToolCard
      icon={Link2}
      title="Slug Generator"
      badge="Text"
      footer={
        <p className="text-xs text-on-surface-variant">
          Creates a lowercase, hyphen-separated slug and preserves letters from
          other writing systems.
        </p>
      }
    >
      <label
        htmlFor="slug-generator-input"
        className="mb-1.5 text-xs font-semibold text-on-surface-variant"
      >
        Title or text
      </label>
      <Textarea
        id="slug-generator-input"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="A Friendly Guide to Web Tools"
        rows={3}
        className="resize-y bg-surface-low"
      />
      <div className="mt-3">
        <ToolOutput value={result} label="URL slug" rows={2} />
      </div>
    </ToolCard>
  );
}

type TextTransform = "base64-encode" | "base64-decode";

export function Base64Converter() {
  const [mode, setMode] = useState<TextTransform>("base64-encode");
  const [source, setSource] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const convert = () => {
    try {
      if (mode === "base64-encode") {
        const bytes = new TextEncoder().encode(source);
        let binary = "";
        for (const byte of bytes) binary += String.fromCharCode(byte);
        setResult(btoa(binary));
      } else {
        const binary = atob(source.replace(/\s+/gu, ""));
        const bytes = Uint8Array.from(binary, (character) =>
          character.charCodeAt(0),
        );
        setResult(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
      }
      setError("");
    } catch {
      setResult("");
      setError(
        mode === "base64-encode"
          ? "This text could not be encoded."
          : "Enter valid Base64 containing UTF-8 text.",
      );
    }
  };

  return (
    <ToolCard
      icon={TextCursorInput}
      title="Base64 Encode/Decode"
      badge="Developer"
      footer={
        <p className="text-xs text-on-surface-variant">
          Handles UTF-8 text in your browser. Base64 is an encoding, not
          encryption.
        </p>
      }
    >
      <label
        htmlFor="base64-mode"
        className="mb-1.5 block text-xs font-semibold text-on-surface-variant"
      >
        Operation
      </label>
      <select
        id="base64-mode"
        value={mode}
        onChange={(event) => {
          if (
            event.target.value === "base64-encode" ||
            event.target.value === "base64-decode"
          ) {
            setMode(event.target.value);
            setResult("");
            setError("");
          }
        }}
        className="h-9 w-full rounded-lg border border-input bg-card px-3 text-sm text-on-surface"
      >
        <option value="base64-encode">Encode text</option>
        <option value="base64-decode">Decode Base64</option>
      </select>
      <label
        htmlFor="base64-input"
        className="mb-1.5 mt-3 block text-xs font-semibold text-on-surface-variant"
      >
        {mode === "base64-encode" ? "Text to encode" : "Base64 to decode"}
      </label>
      <Textarea
        id="base64-input"
        value={source}
        onChange={(event) => {
          setSource(event.target.value);
          setError("");
        }}
        placeholder={
          mode === "base64-encode" ? "Enter UTF-8 text" : "SGVsbG8sIHdvcmxkIQ=="
        }
        rows={4}
        spellCheck={false}
        className="resize-y bg-surface-low font-mono text-xs"
      />
      <Button type="button" className="mt-3 w-full" onClick={convert}>
        {mode === "base64-encode" ? "Encode" : "Decode"}
      </Button>
      {error && (
        <p role="alert" className="mt-3 text-xs text-destructive">
          {error}
        </p>
      )}
      <div className="mt-3">
        <ToolOutput
          value={result}
          label={mode === "base64-encode" ? "Base64 output" : "Decoded text"}
        />
      </div>
    </ToolCard>
  );
}

type UrlTransform = "url-encode" | "url-decode";

export function UrlEncoder() {
  const [mode, setMode] = useState<UrlTransform>("url-encode");
  const [source, setSource] = useState("");
  let result = "";

  if (source) {
    try {
      result =
        mode === "url-encode"
          ? encodeURIComponent(source)
          : decodeURIComponent(source);
    } catch {
      result = "";
    }
  }

  const invalid = Boolean(source) && !result;

  return (
    <ToolCard
      icon={Link2}
      title="URL Encode/Decode"
      badge="Developer"
      footer={
        <p className="text-xs text-on-surface-variant">
          Encodes or decodes a URL component (not an entire URL structure).
        </p>
      }
    >
      <label
        htmlFor="url-encoder-mode"
        className="mb-1.5 block text-xs font-semibold text-on-surface-variant"
      >
        Operation
      </label>
      <select
        id="url-encoder-mode"
        value={mode}
        onChange={(event) => {
          if (
            event.target.value === "url-encode" ||
            event.target.value === "url-decode"
          ) {
            setMode(event.target.value);
          }
        }}
        className="h-9 w-full rounded-lg border border-input bg-card px-3 text-sm text-on-surface"
      >
        <option value="url-encode">Encode component</option>
        <option value="url-decode">Decode component</option>
      </select>
      <label
        htmlFor="url-encoder-input"
        className="mb-1.5 mt-3 block text-xs font-semibold text-on-surface-variant"
      >
        {mode === "url-encode" ? "Text to encode" : "Component to decode"}
      </label>
      <Textarea
        id="url-encoder-input"
        value={source}
        onChange={(event) => setSource(event.target.value)}
        placeholder={
          mode === "url-encode" ? "Hello, world!" : "Hello%2C%20world!"
        }
        rows={3}
        className="resize-y bg-surface-low"
      />
      {invalid && (
        <p role="alert" className="mt-2 text-xs text-destructive">
          Enter a valid encoded URL component.
        </p>
      )}
      <div className="mt-3">
        <ToolOutput
          value={result}
          label={mode === "url-encode" ? "Encoded component" : "Decoded text"}
        />
      </div>
    </ToolCard>
  );
}
