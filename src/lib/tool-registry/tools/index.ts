import { categories } from "../categories";
import type { RegisteredTool, Tool, ToolCategory } from "../types";
import { calculatorTools } from "./calculator";
import { colorTools } from "./color";
import { converterTools } from "./converter";
import { datetimeTools } from "./datetime";
import { developerTools } from "./developer";
import { generatorTools } from "./generator";
import { imageTools } from "./image";
import { mediaTools } from "./media";
import { networkTools } from "./network";
import { pdfTools } from "./pdf";
import { securityTools } from "./security";
import { seoTools } from "./seo";
import { socialTools } from "./social";
import { textTools } from "./text";
import { utilityTools } from "./utility";

const catalog: Tool[] = [
  ...textTools,
  ...developerTools,
  ...converterTools,
  ...calculatorTools,
  ...datetimeTools,
  ...imageTools,
  ...pdfTools,
  ...colorTools,
  ...generatorTools,
  ...seoTools,
  ...networkTools,
  ...securityTools,
  ...mediaTools,
  ...socialTools,
  ...utilityTools,
];

export const tools: RegisteredTool[] = catalog.map((tool) => {
  const { implementation, ...metadata } = tool;
  return implementation
    ? { ...metadata, implementation, status: "available" }
    : { ...metadata, status: "planned" };
});

const toolIds = new Set<string>();
const toolHrefs = new Set<string>();

for (const tool of tools) {
  if (toolIds.has(tool.id)) {
    throw new Error(`Duplicate tool id in registry: "${tool.id}".`);
  }
  if (toolHrefs.has(tool.href)) {
    throw new Error(`Duplicate tool URL in registry: "${tool.href}".`);
  }
  if (!categories.some((category) => category.id === tool.category)) {
    throw new Error(
      `Tool "${tool.id}" references unknown category "${tool.category}".`,
    );
  }
  if (tool.href !== `/tools/${tool.id}`) {
    throw new Error(
      `Tool "${tool.id}" must use its stable canonical URL "/tools/${tool.id}".`,
    );
  }

  toolIds.add(tool.id);
  toolHrefs.add(tool.href);
}

// ============ HELPERS ============
export const getToolsByCategory = (c: ToolCategory) =>
  tools.filter((t) => t.category === c);

export const getToolById = (id: string) => tools.find((t) => t.id === id);

export const getCategoryById = (id: string) =>
  categories.find((c) => c.id === id);

export const isToolCategory = (id: string): id is ToolCategory =>
  categories.some((category) => category.id === id);

export const availableTools = tools.filter(
  (tool) => tool.status === "available",
);
export const plannedTools = tools.filter((tool) => tool.status === "planned");
export const featuredTools = tools.filter((t) => t.featured);
export const popularTools = tools.filter((t) => t.popular);
export const newTools = tools.filter((t) => t.isNew);
export const getRelatedTools = (tool: Tool, limit = 4) =>
  getToolsByCategory(tool.category)
    .filter((t) => t.id !== tool.id)
    .slice(0, limit);

// Re-export
export * from "../categories";
export * from "../types";
