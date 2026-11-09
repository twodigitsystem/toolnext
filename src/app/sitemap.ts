import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { categories } from "@/lib/tool-registry/categories";
import { availableTools } from "@/lib/tool-registry/tools";

export default function sitemap(): MetadataRoute.Sitemap {
  const toolEntries: MetadataRoute.Sitemap = availableTools.map((tool) => ({
    url: `${siteUrl}${tool.href}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const categoryEntries: MetadataRoute.Sitemap = categories
    .filter((category) =>
      availableTools.some((tool) => tool.category === category.id),
    )
    .map((category) => ({
      url: `${siteUrl}/categories/${category.id}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  return [
    { url: siteUrl, changeFrequency: "weekly", priority: 1.0 },
    { url: `${siteUrl}/tools`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/terms`, changeFrequency: "yearly", priority: 0.3 },
    ...toolEntries,
    ...categoryEntries,
  ];
}
