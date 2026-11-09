"use client";

import { useState } from "react";
import { LayoutGrid, List } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { categories } from "@/lib/tool-registry/categories";
import { SidebarLink } from "./sidebar-link";

export function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          className="md:hidden flex items-center gap-2 rounded-lg"
        >
          <LayoutGrid className="size-4" />
          Categories
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 pt-16">
        <SheetHeader className="sr-only">
          <SheetTitle>Categories</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-1 px-1 pt-2">
          <Link
            href="/tools"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-on-surface-variant transition-colors hover:bg-muted hover:text-on-surface"
          >
            <List className="size-4" />
            All tools
          </Link>
          {categories.map((cat) => (
            <SidebarLink
              key={cat.id}
              id={cat.id}
              label={cat.label}
              onClick={() => setOpen(false)}
            />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
