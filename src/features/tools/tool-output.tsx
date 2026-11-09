"use client";

import { Copy } from "lucide-react";
import { useId } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export async function copyToolOutput(value: string) {
  if (!value) return;
  try {
    await navigator.clipboard.writeText(value);
    toast.success("Copied to clipboard.");
  } catch {
    toast.error("Could not copy to clipboard. Check your browser permissions.");
  }
}

export function ToolOutput({
  value,
  label = "Result",
  rows = 4,
}: {
  value: string;
  label?: string;
  rows?: number;
}) {
  const id = useId();

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <label
          htmlFor={id}
          className="text-xs font-semibold text-on-surface-variant"
        >
          {label}
        </label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={!value}
          onClick={() => void copyToolOutput(value)}
        >
          <Copy className="size-3.5" aria-hidden="true" />
          Copy
        </Button>
      </div>
      <Textarea
        aria-label={label}
        value={value}
        readOnly
        id={id}
        rows={rows}
        placeholder="Your result will appear here."
        className="resize-y bg-surface-low font-mono text-xs"
      />
    </div>
  );
}
