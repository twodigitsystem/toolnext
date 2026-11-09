"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { categories } from "@/lib/tool-registry/categories";
import { cn } from "@/lib/utils";
import { SidebarLink } from "./sidebar-link";

export function BrowseSidebar() {
  const pathname = usePathname();
  const allToolsActive = pathname === "/tools";

  return (
    <aside className="hidden md:flex flex-col w-56 shrink-0 border-r border-border/60 pt-6 pb-8 px-3 gap-1 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
      <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-widest text-on-surface-variant/60">
        Browse
      </p>
      <Link
        href="/tools"
        aria-current={allToolsActive ? "page" : undefined}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
          allToolsActive
            ? "bg-primary/10 text-primary font-semibold"
            : "text-on-surface-variant hover:bg-muted hover:text-on-surface",
        )}
      >
        All tools
      </Link>
      <p className="px-3 pb-2 pt-4 text-xs font-semibold uppercase tracking-widest text-on-surface-variant/60">
        Categories
      </p>
      {categories.map((cat) => (
        <SidebarLink key={cat.id} id={cat.id} label={cat.label} />
      ))}
    </aside>
  );
}
