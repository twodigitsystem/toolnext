import { getToolsByCategory, getCategoryById } from "@/lib/tool-registry/tools";
import { ToolCard } from "./tool-card";
import { notFound } from "next/navigation";

export function CategoryPageContent({ category }: { category: string }) {
  const cat = getCategoryById(category);
  if (!cat) notFound();

  const catTools = getToolsByCategory(cat.id);
  const availableCount = catTools.filter(
    (tool) => tool.status === "available",
  ).length;
  const Icon = cat.icon;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon className="size-5 text-primary" />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold text-on-surface">
            {cat.label}
          </h1>
          <p className="text-sm text-on-surface-variant">
            {cat.description} · {availableCount} available ·{" "}
            {catTools.length - availableCount} coming soon
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {catTools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
}
