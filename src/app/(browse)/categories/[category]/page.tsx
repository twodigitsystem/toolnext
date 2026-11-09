import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories } from "@/lib/tool-registry/categories";
import { getCategoryById, getToolsByCategory } from "@/lib/tool-registry/tools";
import { CategoryPageContent } from "./_components/category-page-content";

type Props = { params: Promise<{ category: string }> };

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategoryById(category);
  if (!cat) return {};
  const categoryTools = getToolsByCategory(cat.id);
  const availableCount = categoryTools.filter(
    (tool) => tool.status === "available",
  ).length;
  return {
    title: `${cat.label} Tools — ToolNext`,
    description: `${cat.description} Browse ${categoryTools.length} ${cat.label.toLowerCase()} tools, including ${availableCount} available now.`,
    robots:
      availableCount > 0
        ? { index: true, follow: true }
        : { index: false, follow: true },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const cat = getCategoryById(category);
  if (!cat) notFound();
  return <CategoryPageContent category={category} />;
}
