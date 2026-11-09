import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { RegisteredTool } from "@/lib/tool-registry/types";
import { cn } from "@/lib/utils";

export function ToolCard({ tool }: { tool: RegisteredTool }) {
  const Icon = tool.icon;

  return (
    <Link
      href={tool.href}
      className={cn(
        "group flex items-start gap-3 p-4 rounded-xl border border-border/60 bg-card",
        "hover:border-primary/40 hover:shadow-sm transition-all duration-200",
      )}
    >
      <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors duration-200">
        <Icon className="size-4 text-on-surface-variant group-hover:text-primary transition-colors duration-200" />
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-on-surface truncate">
            {tool.name}
          </span>
          {tool.isNew && (
            <Badge variant="secondary" className="text-xs px-1.5 py-0">
              New
            </Badge>
          )}
          <Badge
            variant={tool.status === "available" ? "default" : "outline"}
            className="text-xs px-1.5 py-0"
          >
            {tool.status === "available" ? "Available" : "Coming soon"}
          </Badge>
          {tool.requiresBackend && (
            <Badge variant="outline" className="text-xs px-1.5 py-0">
              API
            </Badge>
          )}
        </div>
        <p className="text-xs text-on-surface-variant mt-0.5 line-clamp-2">
          {tool.description}
        </p>
      </div>
    </Link>
  );
}
