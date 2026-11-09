import { notFound, permanentRedirect } from "next/navigation";
import { slugify } from "@/lib/slugify";
import { tools } from "@/lib/tool-registry/tools";
import type { ToolCategory } from "@/lib/tool-registry/types";

type Props = {
  params: Promise<{ slug: string; name: string }>;
};

const legacyCategoryIds: Record<ToolCategory, string> = {
  text: "text",
  developer: "dev",
  converter: "convert",
  calculator: "calc",
  datetime: "date",
  image: "image",
  pdf: "pdf",
  color: "color",
  generator: "generator",
  seo: "seo",
  network: "network",
  security: "security",
  media: "media",
  social: "social",
  utility: "utility",
};

export function generateStaticParams() {
  return tools.map((tool) => ({
    slug: legacyCategoryIds[tool.category],
    name: slugify(tool.name),
  }));
}

export default async function LegacyToolPage({ params }: Props) {
  const { slug: legacyCategory, name } = await params;
  const tool = tools.find(
    (item) =>
      legacyCategoryIds[item.category] === legacyCategory &&
      (item.id === name || slugify(item.name) === name),
  );
  if (!tool) notFound();

  permanentRedirect(tool.href);
}
