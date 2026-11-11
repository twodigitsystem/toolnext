"use client";

import {
  AlignLeft,
  ArrowDownWideNarrow,
  ArrowLeftRight,
  BarChart3,
  Braces,
  CaseSensitive,
  Eraser,
  Hash,
  Link2,
  ListFilter,
  ListOrdered,
  Mail,
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

/* ──────────────────────────────────────────────────────────────────────────────
 * Lorem Ipsum Generator
 * ──────────────────────────────────────────────────────────────────────────── */

const LOREM_WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
  "consequat", "duis", "aute", "irure", "dolor", "reprehenderit", "voluptate",
  "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur",
  "sint", "occaecat", "cupidatat", "non", "proident", "sunt", "culpa",
  "officia", "deserunt", "mollit", "anim", "id", "est", "laborum",
];

const LOREM_SENTENCE = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

function generateLoremWords(count: number): string {
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    result.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
  }
  return result.join(" ") + ".";
}

function generateLoremSentences(count: number): string {
  const sentences: string[] = [LOREM_SENTENCE];
  for (let i = 1; i < count; i++) {
    sentences.push(generateLoremWords(8 + Math.floor(Math.random() * 12)));
  }
  return sentences.join(" ");
}

function generateLoremParagraphs(count: number): string {
  const paragraphs: string[] = [];
  for (let i = 0; i < count; i++) {
    const sentenceCount = 4 + Math.floor(Math.random() * 4);
    paragraphs.push(generateLoremSentences(sentenceCount));
  }
  return paragraphs.join("\n\n");
}

export function LoremIpsum() {
  const [mode, setMode] = useState<"paragraphs" | "sentences" | "words">("paragraphs");
  const [count, setCount] = useState("3");
  const [result, setResult] = useState("");

  const generate = () => {
    const n = Number(count);
    if (!Number.isInteger(n) || n < 1 || n > 100) {
      return;
    }
    const text =
      mode === "paragraphs"
        ? generateLoremParagraphs(n)
        : mode === "sentences"
          ? generateLoremSentences(n)
          : generateLoremWords(n);
    setResult(text);
  };

  return (
    <ToolCard
      icon={TextCursorInput}
      title="Lorem Ipsum"
      badge="Text"
      footer={
        <p className="text-xs text-on-surface-variant">
          Classic placeholder text generated locally. Random variation each time.
        </p>
      }
    >
      <div className="flex gap-3">
        <div className="flex-1 space-y-1.5">
          <label htmlFor="lorem-mode" className="text-xs font-semibold text-on-surface-variant">
            Type
          </label>
          <select
            id="lorem-mode"
            value={mode}
            onChange={(e) => {
              if (e.target.value === "paragraphs" || e.target.value === "sentences" || e.target.value === "words")
                setMode(e.target.value);
            }}
            className="h-9 w-full rounded-lg border border-input bg-card px-3 text-sm text-on-surface"
          >
            <option value="paragraphs">Paragraphs</option>
            <option value="sentences">Sentences</option>
            <option value="words">Words</option>
          </select>
        </div>
        <div className="w-24 space-y-1.5">
          <label htmlFor="lorem-count" className="text-xs font-semibold text-on-surface-variant">
            Count
          </label>
          <input
            id="lorem-count"
            type="number"
            min="1"
            max="100"
            step="1"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            className="h-9 w-full rounded-lg border border-input bg-surface-low px-3 text-sm text-on-surface"
          />
        </div>
      </div>
      <Button type="button" className="mt-3 w-full" onClick={generate}>
        Generate Lorem Ipsum
      </Button>
      <div className="mt-3">
        <ToolOutput value={result} label="Generated text" rows={6} />
      </div>
    </ToolCard>
  );
}

/* ──────────────────────────────────────────────────────────────────────────────
 * Sort Lines
 * ──────────────────────────────────────────────────────────────────────────── */

export function SortLines() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<"alpha" | "alpha-reverse" | "numeric" | "random">("alpha");

  const result = (() => {
    if (!text) return "";
    const lines = text.split(/\r\n?|\n/);
    const sorted = [...lines];
    switch (mode) {
      case "alpha":
        sorted.sort((a, b) => a.localeCompare(b));
        break;
      case "alpha-reverse":
        sorted.sort((a, b) => b.localeCompare(a));
        break;
      case "numeric":
        sorted.sort((a, b) => Number(a) - Number(b));
        break;
      case "random":
        for (let i = sorted.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [sorted[i], sorted[j]] = [sorted[j], sorted[i]];
        }
        break;
    }
    return sorted.join("\n");
  })();

  return (
    <ToolCard
      icon={ArrowDownWideNarrow}
      title="Sort Lines"
      badge="Text"
      footer={<p className="text-xs text-on-surface-variant">Sorts lines locally without sending data anywhere.</p>}
    >
      <label htmlFor="sort-input" className="mb-1.5 text-xs font-semibold text-on-surface-variant">Lines to sort</label>
      <Textarea id="sort-input" value={text} onChange={(e) => setText(e.target.value)} placeholder="banana\napple\ncherry" rows={5} className="resize-y bg-surface-low font-mono text-xs" />
      <select value={mode} onChange={(e) => { if (["alpha", "alpha-reverse", "numeric", "random"].includes(e.target.value)) setMode(e.target.value as typeof mode); }} className="mt-3 h-9 w-full rounded-lg border border-input bg-card px-3 text-sm text-on-surface">
        <option value="alpha">Alphabetical A–Z</option>
        <option value="alpha-reverse">Alphabetical Z–A</option>
        <option value="numeric">Numeric</option>
        <option value="random">Randomize</option>
      </select>
      <div className="mt-3"><ToolOutput value={result} label="Sorted output" rows={5} /></div>
    </ToolCard>
  );
}

/* ──────────────────────────────────────────────────────────────────────────────
 * Find & Replace
 * ──────────────────────────────────────────────────────────────────────────── */

export function FindReplace() {
  const [text, setText] = useState("");
  const [find, setFind] = useState("");
  const [replacement, setReplacement] = useState("");
  const [useRegex, setUseRegex] = useState(false);

  const result = (() => {
    if (!text || !find) return "";
    try {
      if (useRegex) {
        const re = new RegExp(find, "g");
        return text.replace(re, replacement);
      }
      return text.replaceAll(find, replacement);
    } catch {
      return "";
    }
  })();

  const count = (() => {
    if (!text || !find) return 0;
    try {
      if (useRegex) {
        const re = new RegExp(find, "g");
        return (text.match(re) || []).length;
      }
      return text.split(find).length - 1;
    } catch {
      return 0;
    }
  })();

  return (
    <ToolCard
      icon={RotateCcw}
      title="Find & Replace"
      badge="Text"
      footer={<p className="text-xs text-on-surface-variant">{count} occurrence{count === 1 ? "" : "s"} found.</p>}
    >
      <label htmlFor="fr-input" className="mb-1.5 text-xs font-semibold text-on-surface-variant">Text</label>
      <Textarea id="fr-input" value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter text to search in…" rows={4} className="resize-y bg-surface-low font-mono text-xs" />
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label htmlFor="fr-find" className="text-xs font-semibold text-on-surface-variant">Find</label>
          <input id="fr-find" value={find} onChange={(e) => setFind(e.target.value)} className="h-9 w-full rounded-lg border border-input bg-surface-low px-3 text-sm text-on-surface" />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="fr-replace" className="text-xs font-semibold text-on-surface-variant">Replace with</label>
          <input id="fr-replace" value={replacement} onChange={(e) => setReplacement(e.target.value)} className="h-9 w-full rounded-lg border border-input bg-surface-low px-3 text-sm text-on-surface" />
        </div>
      </div>
      <label className="mt-2 flex items-center gap-2 text-xs text-on-surface-variant cursor-pointer">
        <input type="checkbox" checked={useRegex} onChange={(e) => setUseRegex(e.target.checked)} className="size-3.5 accent-primary" />
        Use regular expression
      </label>
      {useRegex && find && !result && <p className="mt-1 text-xs text-destructive">Invalid regex pattern.</p>}
      <div className="mt-3"><ToolOutput value={result} label="Result" rows={4} /></div>
    </ToolCard>
  );
}

/* ─────────────────────────────────────────���────────────────────────────────────
 * Remove Line Breaks
 * ──────────────────────────────────────────────────────────────────────────── */

export function RemoveLineBreaks() {
  const [text, setText] = useState("");
  const [joinWith, setJoinWith] = useState(" ");

  const result = text.split(/\r\n?|\n/).join(joinWith);

  return (
    <ToolCard
      icon={Eraser}
      title="Remove Line Breaks"
      badge="Text"
      footer={<p className="text-xs text-on-surface-variant">{text ? `${result.length} characters in 1 line` : "Paste text with line breaks."}</p>}
    >
      <label htmlFor="rlb-input" className="mb-1.5 text-xs font-semibold text-on-surface-variant">Text with line breaks</label>
      <Textarea id="rlb-input" value={text} onChange={(e) => setText(e.target.value)} placeholder="Hello&#10;World" rows={5} className="resize-y bg-surface-low font-mono text-xs" />
      <label htmlFor="rlb-join" className="mb-1.5 mt-3 block text-xs font-semibold text-on-surface-variant">Join lines with</label>
      <input id="rlb-join" value={joinWith} onChange={(e) => setJoinWith(e.target.value)} className="h-9 w-full rounded-lg border border-input bg-surface-low px-3 text-sm text-on-surface" />
      <div className="mt-3"><ToolOutput value={result} label="Joined text" rows={4} /></div>
    </ToolCard>
  );
}

/* ──────────────────────────────────────────────────────────────────────────────
 * Add Line Numbers
 * ──────────────────────────────────────────────────────────────────────────── */

export function AddLineNumbers() {
  const [text, setText] = useState("");
  const [start, setStart] = useState("1");
  const [separator, setSeparator] = useState(". ");

  const result = text
    .split(/\r\n?|\n/)
    .map((line, i) => `${Number(start) + i}${separator}${line}`)
    .join("\n");

  const lineCount = text ? text.split(/\r\n?|\n/).length : 0;

  return (
    <ToolCard
      icon={ListOrdered}
      title="Add Line Numbers"
      badge="Text"
      footer={<p className="text-xs text-on-surface-variant">{lineCount} lines numbered.</p>}
    >
      <label htmlFor="aln-input" className="mb-1.5 text-xs font-semibold text-on-surface-variant">Text</label>
      <Textarea id="aln-input" value={text} onChange={(e) => setText(e.target.value)} placeholder="Line one&#10;Line two" rows={5} className="resize-y bg-surface-low font-mono text-xs" />
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label htmlFor="aln-start" className="text-xs font-semibold text-on-surface-variant">Start at</label>
          <input id="aln-start" type="number" min="0" value={start} onChange={(e) => setStart(e.target.value)} className="h-9 w-full rounded-lg border border-input bg-surface-low px-3 text-sm text-on-surface" />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="aln-sep" className="text-xs font-semibold text-on-surface-variant">Separator</label>
          <input id="aln-sep" value={separator} onChange={(e) => setSeparator(e.target.value)} className="h-9 w-full rounded-lg border border-input bg-surface-low px-3 text-sm text-on-surface" />
        </div>
      </div>
      <div className="mt-3"><ToolOutput value={result} label="Numbered output" rows={5} /></div>
    </ToolCard>
  );
}

/* ──────────────────────────────────────────────────────────────────────────────
 * Strip HTML
 * ──────────────────────────────────────────────────────────────────────────── */

export function StripHtml() {
  const [html, setHtml] = useState("");

  const result = html.replace(/<[^>]*>/g, "");

  return (
    <ToolCard
      icon={AlignLeft}
      title="Strip HTML"
      badge="Text"
      footer={<p className="text-xs text-on-surface-variant">{html ? `${html.length - result.length} characters of HTML tags removed.` : "Paste HTML to strip tags."}</p>}
    >
      <label htmlFor="strip-input" className="mb-1.5 text-xs font-semibold text-on-surface-variant">HTML source</label>
      <Textarea id="strip-input" value={html} onChange={(e) => setHtml(e.target.value)} placeholder="<p>Hello <b>world</b></p>" rows={6} className="resize-y bg-surface-low font-mono text-xs" />
      <div className="mt-3"><ToolOutput value={result} label="Plain text" rows={5} /></div>
    </ToolCard>
  );
}

/* ──────────────────────────────────────────────────────────────────────────────
 * Extract Emails
 * ──────────────────────────────────────────────────────────────────────────── */

export function ExtractEmails() {
  const [text, setText] = useState("");

  const emails = (() => {
    if (!text) return [];
    const matches = text.match(/[\w.+-]+@[\w-]+\.[\w.-]+/gi);
    return [...new Set(matches || [])];
  })();

  const result = emails.join("\n");

  return (
    <ToolCard
      icon={Mail}
      title="Extract Emails"
      badge="Text"
      footer={<p className="text-xs text-on-surface-variant">{emails.length} unique email address{emails.length === 1 ? "" : "es"} found.</p>}
    >
      <label htmlFor="emails-input" className="mb-1.5 text-xs font-semibold text-on-surface-variant">Source text</label>
      <Textarea id="emails-input" value={text} onChange={(e) => setText(e.target.value)} placeholder="Contact us at hello@example.com or support@test.org" rows={5} className="resize-y bg-surface-low font-mono text-xs" />
      <div className="mt-3"><ToolOutput value={result} label="Extracted emails" rows={5} /></div>
    </ToolCard>
  );
}

/* ──────────────────────────────────────────────────────────────────────────────
 * Extract URLs
 * ──────────────────────────────────────────────────────────────────────────── */

export function ExtractUrls() {
  const [text, setText] = useState("");

  const urls = (() => {
    if (!text) return [];
    const matches = text.match(/https?:\/\/[^\s<>"']+/gi);
    return [...new Set(matches || [])];
  })();

  const result = urls.join("\n");

  return (
    <ToolCard
      icon={Link2}
      title="Extract URLs"
      badge="Text"
      footer={<p className="text-xs text-on-surface-variant">{urls.length} unique URL{urls.length === 1 ? "" : "s"} found.</p>}
    >
      <label htmlFor="urls-input" className="mb-1.5 text-xs font-semibold text-on-surface-variant">Source text</label>
      <Textarea id="urls-input" value={text} onChange={(e) => setText(e.target.value)} placeholder="Visit https://example.com and https://test.org for info" rows={5} className="resize-y bg-surface-low font-mono text-xs" />
      <div className="mt-3"><ToolOutput value={result} label="Extracted URLs" rows={5} /></div>
    </ToolCard>
  );
}

/* ──────────────────────────────────────────────────────────────────────────────
 * Text Statistics
 * ──────────────────────────────────────────────────────────────────────────── */

function splitGraphemesStat(text: string) {
  if (typeof Intl.Segmenter === "undefined") return Array.from(text);
  return Array.from(new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(text), ({ segment }) => segment);
}

export function TextStats() {
  const [text, setText] = useState("");

  const chars = splitGraphemesStat(text);
  const nonWhitespace = chars.filter((c) => !/\s/u.test(c));
  const words = text.match(/[\p{L}\p{N}]+/gu) ?? [];
  const lines = text ? text.split(/\r\n?|\n/) : [];
  const sentences = text.match(/[^.!?]*[.!?]+/g) ?? [];
  const paragraphs = text ? text.split(/\n\s*\n/).filter(Boolean) : [];

  // Avg word length
  const avgWordLength = words.length > 0
    ? (words.reduce((sum, w) => sum + w.length, 0) / words.length).toFixed(1)
    : "0";

  // Unique words
  const uniqueWords = new Set(words.map((w) => w.toLowerCase())).size;

  // Reading time
  const readingTime = Math.ceil(words.length / 200);
  const speakingTime = Math.ceil(words.length / 150);

  return (
    <ToolCard
      icon={BarChart3}
      title="Text Statistics"
      badge="Text"
      footer={<p className="text-xs text-on-surface-variant">{readingTime} min read · {speakingTime} min speak</p>}
    >
      <label htmlFor="stats-input" className="mb-1.5 text-xs font-semibold text-on-surface-variant">Text to analyze</label>
      <Textarea id="stats-input" value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste text to analyze…" rows={5} className="resize-y bg-surface-low font-mono text-xs" />
      {text && (
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[
            ["Characters", chars.length],
            ["No spaces", nonWhitespace.length],
            ["Words", words.length],
            ["Lines", lines.length],
            ["Sentences", sentences.length],
            ["Paragraphs", paragraphs.length],
            ["Avg word len", avgWordLength],
            ["Unique words", uniqueWords],
          ].map(([label, count]) => (
            <div key={label} className="rounded-xl bg-primary/5 p-2.5 text-center">
              <p className="font-heading text-lg font-bold text-primary">{count?.toLocaleString()}</p>
              <p className="text-[10px] text-on-surface-variant">{label}</p>
            </div>
          ))}
        </div>
      )}
    </ToolCard>
  );
}
