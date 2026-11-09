"use client";

import { CaseSensitive, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

const STORAGE_KEY = "toolnext-text-case";

const caseButtons = [
  { id: "upper", label: "UPPERCASE" },
  { id: "lower", label: "lowercase" },
  { id: "title", label: "Title Case" },
] as const;

export function TextCasePanel() {
  const [text, setText] = useState(
    "Clean interface design guarantees effortless user execution and absolute transparency.",
  );

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setText(stored);
    } catch {
      // ignore storage errors
    }
  }, []);

  const handleChange = (value: string) => {
    setText(value);
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // ignore storage errors
    }
  };

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const sentences = text.trim()
    ? text.split(/[.!?]+/).filter(Boolean).length
    : 0;
  const isEmpty = !text.trim();

  const applyCase = (mode: (typeof caseButtons)[number]["id"]) => {
    const newText =
      mode === "upper"
        ? text.toUpperCase()
        : mode === "lower"
          ? text.toLowerCase()
          : text.toLowerCase().replace(/\b\w/g, (s) => s.toUpperCase());
    handleChange(newText);
  };

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Text copied to clipboard");
    } catch {
      toast.error("Failed to copy text");
    }
  };

  return (
    <Card className="h-full rounded-2xl shadow-md gap-0 ring-0 py-0">
      <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6">
        <div className="flex items-center gap-2">
          <CaseSensitive className="text-primary size-5" />
          <h3 className="font-heading text-base sm:text-lg font-bold text-on-surface">
            Live Text Case &amp; Analysis
          </h3>
        </div>
        <Badge
          variant="outline"
          className="font-mono text-[11px] text-outline border-0 bg-transparent px-0"
        >
          v1.2
        </Badge>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 flex-1 flex flex-col">
        <Textarea
          className="bg-surface-low text-on-surface text-sm focus-visible:bg-card focus-visible:ring-primary/20 resize-none"
          placeholder="Type or paste text..."
          rows={4}
          value={text}
          onChange={(e) => handleChange(e.target.value)}
        />
        {isEmpty && (
          <p className="text-xs text-outline mt-2 text-center">
            Start typing to analyze text
          </p>
        )}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {caseButtons.map((btn) => (
            <Button
              key={btn.id}
              type="button"
              variant="secondary"
              size="xs"
              onClick={() => applyCase(btn.id)}
              className="bg-surface-low text-on-surface text-[11px] font-semibold hover:bg-surface-high h-auto px-2.5 py-1"
            >
              {btn.label}
            </Button>
          ))}
          <Button
            type="button"
            size="xs"
            onClick={copyText}
            className="bg-primary-fixed text-on-primary-fixed text-[11px] font-semibold h-auto px-2.5 py-1 ml-auto"
          >
            <Copy className="size-3" />
            Copy
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-3 sm:mt-4 pt-2.5 sm:pt-3 bg-surface-low/70 p-2.5 rounded-xl text-center">
          <div>
            <span className="block font-heading text-lg text-primary font-bold">
              {words}
            </span>
            <span className="block text-[10px] text-outline">WORDS</span>
          </div>
          <div>
            <span className="block font-heading text-lg text-on-surface font-bold">
              {chars}
            </span>
            <span className="block text-[10px] text-outline">CHARS</span>
          </div>
          <div>
            <span className="block font-heading text-lg text-secondary font-bold">
              {sentences}
            </span>
            <span className="block text-[10px] text-outline">SENTENCE</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
