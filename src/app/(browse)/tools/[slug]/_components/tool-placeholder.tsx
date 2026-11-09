"use client";

import { Construction } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Props = {
  category: string;
};

export function ToolPlaceholder({ category }: Props) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-10 text-center sm:px-10">
      <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Construction className="size-7" aria-hidden="true" />
      </div>
      <Badge variant="outline" className="mt-4">
        In development
      </Badge>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-on-surface-variant">
        This {category.toLowerCase()} tool is planned but is not available yet.
        We&apos;ll publish it here once it is ready.
      </p>
      <Button asChild variant="secondary" className="mt-5">
        <Link href="/tools">Explore available tools</Link>
      </Button>
    </div>
  );
}
