"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { categories } from "@/lib/tool-registry/categories";
import type { ToolCategory } from "@/lib/tool-registry/types";
import { getActiveCategory } from "../_lib/get-active-category";

type Props = {
  id: ToolCategory;
  label: string;
  onClick?: () => void;
};

export function SidebarLink({ id, label, onClick }: Props) {
  const pathname = usePathname();
  const active = getActiveCategory(pathname) === id;
  const cat = categories.find((c) => c.id === id);
  const Icon = cat?.icon;

  return (
    <Link
      href={`/categories/${id}`}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
        active
          ? "bg-primary/10 text-primary font-semibold"
          : "text-on-surface-variant hover:bg-muted hover:text-on-surface",
      )}
    >
      {Icon && <Icon className="size-4 shrink-0" />}
      {label}
    </Link>
  );
}
