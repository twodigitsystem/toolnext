"use client";

import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function DataConverterPanel() {
  const [mb, setMb] = useState("1024");

  const value = parseFloat(mb) || 0;
  const gb = value / 1024;
  const kb = value * 1024;

  return (
    <Card className="h-full rounded-2xl shadow-md gap-0 ring-0 py-0">
      <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="text-primary size-5" />
          <h3 className="font-heading text-base sm:text-lg font-bold text-on-surface">
            Rapid Storage &amp; Data
          </h3>
        </div>
        <Badge
          variant="outline"
          className="font-mono text-[11px] text-outline border-0 bg-transparent px-0"
        >
          IEC Std
        </Badge>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 flex-1 flex flex-col">
        <p className="text-sm text-on-surface-variant mb-3">
          Instant binary byte translations:
        </p>
        <div className="space-y-3">
          <div>
            <Label
              htmlFor="pg-input-mb"
              className="block text-[11px] text-outline mb-1 uppercase"
            >
              Megabytes (MB)
            </Label>
            <Input
              id="pg-input-mb"
              className="bg-surface-low focus-visible:ring-primary/20"
              type="number"
              value={mb}
              onChange={(e) => setMb(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-xl bg-surface-low">
              <span className="block text-[11px] text-outline">
                GIGABYTES (GB)
              </span>
              <span className="font-heading text-lg text-primary font-bold">
                {gb.toFixed(2)} GB
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-surface-low">
              <span className="block text-[11px] text-outline">
                KILOBYTES (KB)
              </span>
              <span className="font-heading text-lg text-on-surface font-bold">
                {Math.round(kb).toLocaleString("en-US")}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-auto pt-3 sm:pt-4 flex items-center justify-between">
          <span className="text-[11px] text-outline">
            Precision: 1024 Base-2
          </span>
          <Badge className="bg-primary-fixed text-on-primary-fixed text-xs font-semibold">
            Live Reactive
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
