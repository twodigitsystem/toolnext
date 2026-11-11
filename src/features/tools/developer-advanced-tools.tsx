"use client";

import { BookOpen, Braces, Regex, ArrowUpDown, RotateCcw, Eye, KeyRound } from "lucide-react";
import { useState, useMemo } from "react";
import { marked } from "marked";
import { ToolCard } from "@/components/landing-page/quick-tools/tool-card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToolOutput } from "./tool-output";

/* ──────────────────────────────────────────────────────────────────────────────
 * Regex Tester
 * ──────────────────────────────────────────────────────────────────────────── */

export function RegexTester() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("gm");
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const matches = useMemo(() => {
    if (!pattern || !text) return [];
    try {
      const re = new RegExp(pattern, flags);
      setError("");
      const found: string[] = [];
      let m: RegExpExecArray | null;
      let lastIndex = -1;
      // Prevent infinite loops for zero-length matches
      let iterations = 0;
      const maxIterations = 10_000;
      while ((m = re.exec(text)) !== null && iterations < maxIterations) {
        iterations++;
        if (re.lastIndex === lastIndex) {
          re.lastIndex++;
        }
        lastIndex = re.lastIndex;
        found.push(m[0]);
      }
      return found;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Invalid regex pattern.");
      return [];
    }
  }, [pattern, flags, text]);

  const matchCount = matches.length;

  return (
    <ToolCard
      icon={Regex}
      title="Regex Tester"
      badge="Developer"
      action={
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            setPattern("");
            setText("");
            setError("");
          }}
          disabled={!pattern && !text}
          aria-label="Clear all"
        >
          <RotateCcw className="size-3.5" aria-hidden="true" />
          Clear
        </Button>
      }
      footer={
        <p className="text-xs text-on-surface-variant">
          {pattern && text
            ? `${matchCount} match${matchCount === 1 ? "" : "es"} found`
            : "Enter a pattern and test text to see matches."}
        </p>
      }
    >
      <label
        htmlFor="regex-pattern"
        className="mb-1.5 block text-xs font-semibold text-on-surface-variant"
      >
        Regular expression
      </label>
      <input
        id="regex-pattern"
        type="text"
        value={pattern}
        onChange={(e) => {
          setPattern(e.target.value);
          setError("");
        }}
        placeholder={"/\\d+/"}
        spellCheck={false}
        className="h-10 w-full rounded-lg border border-input bg-surface-low px-3 font-mono text-sm text-on-surface"
      />
      <div className="mt-2 flex items-center gap-3">
        <label
          htmlFor="regex-flags"
          className="text-xs font-semibold text-on-surface-variant"
        >
          Flags
        </label>
        <input
          id="regex-flags"
          type="text"
          value={flags}
          onChange={(e) => {
            const clean = e.target.value.replace(/[^gimsuy]/g, "");
            setFlags(clean);
            setError("");
          }}
          placeholder="gim"
          maxLength={5}
          className="h-8 w-24 rounded-lg border border-input bg-surface-low px-2 font-mono text-xs text-on-surface"
        />
      </div>
      <label
        htmlFor="regex-test-text"
        className="mb-1.5 mt-3 block text-xs font-semibold text-on-surface-variant"
      >
        Test text
      </label>
      <Textarea
        id="regex-test-text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste or type text to test against"
        rows={5}
        spellCheck={false}
        className="resize-y bg-surface-low font-mono text-xs"
      />
      {error && (
        <p role="alert" className="mt-2 text-xs text-destructive">
          {error}
        </p>
      )}
      {matchCount > 0 && (
        <div className="mt-3">
          <ToolOutput value={matches.join("\n")} label="Matches" rows={4} />
        </div>
      )}
    </ToolCard>
  );
}

/* ──────────────────────────────────────────────────────────────────────────────
 * JSON Validator
 * ──────────────────────────────────────────────────────────────────────────── */

export function JsonValidator() {
  const [source, setSource] = useState("");
  const [result, setResult] = useState<{
    valid: boolean;
    message: string;
    data?: unknown;
  } | null>(null);

  const validate = () => {
    try {
      const parsed: unknown = JSON.parse(source);
      setResult({
        valid: true,
        message: "Valid JSON ✓",
        data: parsed,
      });
    } catch (cause) {
      setResult({
        valid: false,
        message:
          cause instanceof Error ? cause.message : "Invalid JSON input.",
      });
    }
  };

  const typeOf = (value: unknown): string => {
    if (value === null) return "null";
    if (Array.isArray(value)) return `array[${value.length}]`;
    if (typeof value === "object") return `object`;
    return typeof value;
  };

  return (
    <ToolCard
      icon={Braces}
      title="JSON Validator"
      badge="Developer"
      action={
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            setSource("");
            setResult(null);
          }}
          disabled={!source}
          aria-label="Clear JSON"
        >
          <RotateCcw className="size-3.5" aria-hidden="true" />
          Clear
        </Button>
      }
      footer={
        <p className="text-xs text-on-surface-variant">
          Validation and analysis happen entirely in this browser.
        </p>
      }
    >
      <label
        htmlFor="json-validator-input"
        className="mb-1.5 text-xs font-semibold text-on-surface-variant"
      >
        JSON to validate
      </label>
      <Textarea
        id="json-validator-input"
        value={source}
        onChange={(e) => {
          setSource(e.target.value);
          setResult(null);
        }}
        placeholder={'{"name":"ToolNext","ready":true}'}
        rows={5}
        spellCheck={false}
        className="resize-y bg-surface-low font-mono text-xs"
      />
      <Button
        type="button"
        className="mt-3 w-full"
        onClick={validate}
        disabled={!source.trim()}
      >
        Validate
      </Button>
      {result && (
        <div
          className={`mt-3 rounded-xl border p-3 ${
            result.valid
              ? "border-success/30 bg-success/5"
              : "border-destructive/30 bg-destructive/5"
          }`}
        >
          <p
            className={`text-sm font-semibold ${
              result.valid ? "text-success" : "text-destructive"
            }`}
          >
            {result.message}
          </p>
          {result.valid && result.data !== undefined && (
            <p className="mt-1 text-xs text-on-surface-variant">
              Type: {typeOf(result.data)} &middot;{" "}
              {source.length} characters
            </p>
          )}
        </div>
      )}
    </ToolCard>
  );
}

/* ──────────────────────────────────────────────────────────────────────────────
 * Text Diff
 * ──────────────────────────────────────────────────────────────────────────── */

type DiffOp = "equal" | "insert" | "delete";

function computeDiff(left: string, right: string) {
  const leftLines = left.split("\n");
  const rightLines = right.split("\n");
  const lLen = leftLines.length;
  const rLen = rightLines.length;

  // LCS-based diff (simplified Myers)
  const dp: number[][] = Array.from({ length: lLen + 1 }, () =>
    new Array(rLen + 1).fill(0),
  );
  for (let i = 1; i <= lLen; i++) {
    for (let j = 1; j <= rLen; j++) {
      dp[i][j] =
        leftLines[i - 1] === rightLines[j - 1]
          ? dp[i - 1][j - 1] + 1
          : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }

  // Backtrack
  const ops: { op: DiffOp; text: string; line: number }[] = [];
  let i = lLen;
  let j = rLen;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && leftLines[i - 1] === rightLines[j - 1]) {
      ops.push({ op: "equal", text: leftLines[i - 1], line: i - 1 });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      ops.push({ op: "insert", text: rightLines[j - 1], line: j - 1 });
      j--;
    } else {
      ops.push({ op: "delete", text: leftLines[i - 1], line: i - 1 });
      i--;
    }
  }
  ops.reverse();
  return ops;
}

export function TextDiff() {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");

  const diff = useMemo(() => {
    if (!left && !right) return [];
    return computeDiff(left, right);
  }, [left, right]);

  const additions = diff.filter((d) => d.op === "insert").length;
  const deletions = diff.filter((d) => d.op === "delete").length;

  return (
    <ToolCard
      icon={ArrowUpDown}
      title="Text Diff"
      badge="Text"
      action={
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            setLeft("");
            setRight("");
          }}
          disabled={!left && !right}
          aria-label="Clear"
        >
          <RotateCcw className="size-3.5" aria-hidden="true" />
          Clear
        </Button>
      }
      footer={
        <p className="text-xs text-on-surface-variant">
          {additions + deletions > 0
            ? `${additions} addition${additions === 1 ? "" : "s"} · ${deletions} deletion${deletions === 1 ? "" : "s"}`
            : left || right
              ? "Texts are identical"
              : "Enter two texts to compare line by line."}
        </p>
      }
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label
            htmlFor="text-diff-left"
            className="mb-1.5 block text-xs font-semibold text-on-surface-variant"
          >
            Original
          </label>
          <Textarea
            id="text-diff-left"
            value={left}
            onChange={(e) => setLeft(e.target.value)}
            placeholder="Original text"
            rows={6}
            spellCheck={false}
            className="resize-y bg-surface-low font-mono text-xs"
          />
        </div>
        <div>
          <label
            htmlFor="text-diff-right"
            className="mb-1.5 block text-xs font-semibold text-on-surface-variant"
          >
            Changed
          </label>
          <Textarea
            id="text-diff-right"
            value={right}
            onChange={(e) => setRight(e.target.value)}
            placeholder="Changed text"
            rows={6}
            spellCheck={false}
            className="resize-y bg-surface-low font-mono text-xs"
          />
        </div>
      </div>
      {diff.length > 0 && (
        <div className="mt-3">
          <p className="mb-1.5 text-xs font-semibold text-on-surface-variant">
            Diff result
          </p>
          <div className="max-h-60 overflow-y-auto rounded-xl border border-border bg-surface-low font-mono text-xs leading-relaxed">
            {diff.map((d, idx) => {
              const bg =
                d.op === "insert"
                  ? "bg-success/10"
                  : d.op === "delete"
                    ? "bg-destructive/10"
                    : "";
              const prefix =
                d.op === "insert" ? "+" : d.op === "delete" ? "−" : " ";
              const color =
                d.op === "insert"
                  ? "text-success"
                  : d.op === "delete"
                    ? "text-destructive"
                    : "text-on-surface";
              return (
                <div
                  key={idx}
                  className={`flex px-3 py-0.5 ${bg}`}
                >
                  <span className={`mr-2 w-4 shrink-0 ${color}`}>{prefix}</span>
                  <span className={color}>{d.text || " "}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </ToolCard>
  );
}

/* ──────────────────────────────────────────────────────────────────────────────
 * Markdown Preview
 * ──────────────────────────────────────────────────────────────────────────── */

export function MarkdownPreview() {
  const [source, setSource] = useState(`# Hello, ToolNext!

This is **bold** and *italic* text.

- List item one
- List item two
- List item three

\`\`\`js
console.log("Hello, world!");
\`\`\`

> A blockquote goes here.

[Link](https://toolnext.vercel.app)
`);
  const [html, setHtml] = useState("");
  const [error, setError] = useState("");

  const preview = () => {
    try {
      const result = marked.parse(source);
      if (result instanceof Promise) {
        result
          .then((resolved) => {
            setHtml(resolved);
            setError("");
          })
          .catch((cause) => {
            setHtml("");
            setError(
              cause instanceof Error ? cause.message : "Failed to render Markdown.",
            );
          });
      } else {
        setHtml(result);
        setError("");
      }
    } catch (cause) {
      setHtml("");
      setError(
        cause instanceof Error ? cause.message : "Failed to render Markdown.",
      );
    }
  };

  return (
    <ToolCard
      icon={BookOpen}
      title="Markdown Preview"
      badge="Developer"
      action={
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            setSource("");
            setHtml("");
            setError("");
          }}
          disabled={!source}
          aria-label="Clear"
        >
          <RotateCcw className="size-3.5" aria-hidden="true" />
          Clear
        </Button>
      }
      footer={
        <p className="text-xs text-on-surface-variant">
          Renders GitHub-flavored Markdown to HTML in your browser.
        </p>
      }
    >
      <label
        htmlFor="markdown-input"
        className="mb-1.5 text-xs font-semibold text-on-surface-variant"
      >
        Markdown source
      </label>
      <Textarea
        id="markdown-input"
        value={source}
        onChange={(e) => {
          setSource(e.target.value);
          setError("");
        }}
        placeholder="Type Markdown here..."
        rows={6}
        spellCheck={false}
        className="resize-y bg-surface-low font-mono text-xs"
      />
      <Button
        type="button"
        className="mt-3 w-full"
        onClick={preview}
        disabled={!source.trim()}
      >
        <Eye className="mr-2 size-4" />
        Preview
      </Button>
      {error && (
        <p role="alert" className="mt-2 text-xs text-destructive">
          {error}
        </p>
      )}
      {html && (
        <div className="mt-3">
          <p className="mb-1.5 text-xs font-semibold text-on-surface-variant">
            Rendered HTML
          </p>
          <div
            className="prose prose-sm dark:prose-invert max-w-none rounded-xl border border-border bg-card p-4 text-sm"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      )}
    </ToolCard>
  );
}

/* ──────────────────────────────────────────────────────────────────────────────
 * JWT Decoder
 * ──────────────────────────────────────────────────────────────────────────── */

export function JwtDecoder() {
  const [token, setToken] = useState("");
  const [header, setHeader] = useState("");
  const [payload, setPayload] = useState("");
  const [error, setError] = useState("");

  const decode = () => {
    setHeader("");
    setPayload("");
    if (!token.trim()) {
      setError("Paste a JWT token to decode.");
      return;
    }
    const parts = token.trim().split(".");
    if (parts.length !== 3) {
      setError("Invalid JWT format. Expected a header.payload.signature token.");
      return;
    }

    try {
      const decodedHeader = JSON.parse(atob(parts[0]));
      const decodedPayload = JSON.parse(atob(parts[1]));
      setHeader(JSON.stringify(decodedHeader, null, 2));
      setPayload(JSON.stringify(decodedPayload, null, 2));
      setError("");
    } catch {
      setError("Could not decode the token. Ensure it is a valid Base64-encoded JWT.");
    }
  };

  return (
    <ToolCard
      icon={KeyRound}
      title="JWT Decoder"
      badge="Developer"
      action={
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            setToken("");
            setHeader("");
            setPayload("");
            setError("");
          }}
          disabled={!token}
          aria-label="Clear"
        >
          <RotateCcw className="size-3.5" aria-hidden="true" />
          Clear
        </Button>
      }
      footer={
        <p className="text-xs text-on-surface-variant">
          Decodes the header and payload locally. The signature is not verified.
        </p>
      }
    >
      <label
        htmlFor="jwt-input"
        className="mb-1.5 block text-xs font-semibold text-on-surface-variant"
      >
        JWT token
      </label>
      <Textarea
        id="jwt-input"
        value={token}
        onChange={(e) => {
          setToken(e.target.value);
          setError("");
        }}
        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0."
        rows={4}
        spellCheck={false}
        className="resize-y bg-surface-low font-mono text-xs break-all"
      />
      <Button type="button" className="mt-3 w-full" onClick={decode}>
        Decode JWT
      </Button>
      {error && (
        <p role="alert" className="mt-2 text-xs text-destructive">{error}</p>
      )}
      {header && (
        <div className="mt-3 space-y-3">
          <ToolOutput value={header} label="Header" rows={3} />
          <ToolOutput value={payload} label="Payload" rows={6} />
        </div>
      )}
    </ToolCard>
  );
}
