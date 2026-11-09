import { getCategoryById, getToolById } from "@/lib/tool-registry/tools";
import type { ToolCategory } from "@/lib/tool-registry/types";

export function getActiveCategory(pathname: string): ToolCategory | null {
  const categoryMatch = pathname.match(/^\/categories\/([^/]+)/);
  if (categoryMatch) {
    return getCategoryById(categoryMatch[1])?.id ?? null;
  }

  const toolMatch = pathname.match(/^\/tools\/([^/]+)/);
  if (toolMatch) {
    const tool = getToolById(toolMatch[1]);
    return tool?.category ?? null;
  }

  return null;
}
