"use client";

import { Clock3 } from "lucide-react";
import { useMemo, useState } from "react";
import { ToolCard } from "@/components/landing-page/quick-tools/tool-card";
import { Input } from "@/components/ui/input";

function parseUnixTimestamp(value: string) {
  const timestamp = Number(value.trim());
  if (!value.trim() || !Number.isFinite(timestamp)) return null;
  const milliseconds =
    Math.abs(timestamp) < 100_000_000_000 ? timestamp * 1000 : timestamp;
  const date = new Date(milliseconds);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function UnixTimestamp() {
  const [timestamp, setTimestamp] = useState("");
  const [dateTime, setDateTime] = useState("");
  const parsedDate = useMemo(
    () => (timestamp ? parseUnixTimestamp(timestamp) : null),
    [timestamp],
  );
  const selectedDate = dateTime ? new Date(dateTime) : null;
  const selectedDateValid =
    selectedDate !== null && Number.isFinite(selectedDate.getTime());

  return (
    <ToolCard
      icon={Clock3}
      title="Unix Timestamp Converter"
      badge="Date & time"
      footer={
        <p className="text-xs text-on-surface-variant">
          Timestamps below 100 billion are treated as seconds; larger values are
          milliseconds. ISO output is UTC.
        </p>
      }
    >
      <label
        htmlFor="unix-timestamp-input"
        className="mb-1.5 text-xs font-semibold text-on-surface-variant"
      >
        Unix timestamp
      </label>
      <Input
        id="unix-timestamp-input"
        inputMode="decimal"
        value={timestamp}
        onChange={(event) => setTimestamp(event.target.value)}
        placeholder="For example, 1700000000"
        className="bg-surface-low"
      />
      {timestamp && !parsedDate && (
        <p role="alert" className="mt-2 text-xs text-destructive">
          Enter a valid seconds or milliseconds timestamp.
        </p>
      )}
      {parsedDate && (
        <div className="mt-3 space-y-2 rounded-xl bg-primary/5 p-4">
          <p className="text-xs font-semibold text-on-surface-variant">
            UTC date
          </p>
          <p className="break-all font-mono text-sm text-primary">
            {parsedDate.toISOString()}
          </p>
          <p className="text-xs text-on-surface-variant">
            {Math.floor(parsedDate.getTime() / 1000)} seconds ·{" "}
            {parsedDate.getTime()} milliseconds
          </p>
        </div>
      )}
      <div className="my-5 border-t border-border" />
      <label
        htmlFor="unix-date-input"
        className="mb-1.5 text-xs font-semibold text-on-surface-variant"
      >
        Date and time
      </label>
      <Input
        id="unix-date-input"
        type="datetime-local"
        value={dateTime}
        onChange={(event) => setDateTime(event.target.value)}
        className="bg-surface-low"
      />
      {selectedDateValid && (
        <div className="mt-3 rounded-xl bg-surface-low p-4">
          <p className="text-xs text-on-surface-variant">
            {Math.floor(selectedDate.getTime() / 1000)} seconds
          </p>
          <p className="mt-1 text-xs text-on-surface-variant">
            {selectedDate.getTime()} milliseconds
          </p>
          <p className="mt-1 break-all font-mono text-xs text-on-surface">
            {selectedDate.toISOString()} UTC
          </p>
        </div>
      )}
    </ToolCard>
  );
}
