"use client";

import { CaseSensitive } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToolCard } from "./tool-card";

const STORAGE_KEY = "toolnext-word-counter";

export function WordCounter() {
  const [text, setText] = useState(
    "ToolNext empowers high velocity daily workflows.",
  );

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) setText(stored);
    } catch {
      toast.error("Could not restore the saved text.");
    }
  }, []);

  const handleChange = (value: string) => {
    setText(value);
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      toast.error("Could not save your text in this browser.");
    }
  };

  const reset = () => {
    setText("");
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      toast.error("Could not clear the saved text.");
    }
  };

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const seconds = Math.ceil(words / 3.3);
  const isEmpty = !text.trim();

  return (
    <ToolCard
      icon={CaseSensitive}
      title="Word Counter"
      badge="Live"
      action={
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={reset}
          aria-label="Clear word counter text"
          className="px-2 text-xs"
        >
          Clear
        </Button>
      }
      footer={
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <span className="block font-heading text-lg text-primary font-bold">
              {words}
            </span>
            <span className="block text-[10px] text-outline uppercase tracking-wider">
              Words
            </span>
          </div>
          <div>
            <span className="block font-heading text-lg text-on-surface font-bold">
              {chars}
            </span>
            <span className="block text-[10px] text-outline uppercase tracking-wider">
              Chars
            </span>
          </div>
          <div>
            <span className="block font-heading text-lg text-secondary font-bold">
              {seconds < 2 ? "<1s" : `${seconds}s`}
            </span>
            <span className="block text-[10px] text-outline uppercase tracking-wider">
              Read
            </span>
          </div>
        </div>
      }
    >
      <Textarea
        className="bg-surface-low text-on-surface text-sm focus-visible:bg-card focus-visible:ring-primary/20 resize-none transition-all"
        placeholder="Paste or write your sentence here..."
        rows={3}
        value={text}
        onChange={(e) => handleChange(e.target.value)}
      />
      {isEmpty && (
        <p className="text-xs text-outline mt-2 text-center">
          Start typing to see word count
        </p>
      )}
    </ToolCard>
  );
}
