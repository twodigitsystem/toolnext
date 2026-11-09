import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ToolExperience } from "@/features/tools/tool-experience";
import { getCategoryById, getToolById, tools } from "@/lib/tool-registry/tools";
import { ToolPlaceholder } from "./_components/tool-placeholder";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return tools.map((t) => ({ slug: t.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolById(slug);
  if (!tool) return {};
  return {
    title: `${tool.name} — ToolNext`,
    description: tool.description,
    alternates: { canonical: tool.href },
    robots:
      tool.status === "available"
        ? { index: true, follow: true }
        : { index: false, follow: true },
  };
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;
  const tool = getToolById(slug);
  if (!tool) notFound();

  const category = getCategoryById(tool.category);
  if (!category) notFound();
  const Icon = tool.icon;

  return (
    <article className="mx-auto max-w-5xl">
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-on-surface-variant">
          <li>
            <Link href="/tools" className="hover:text-primary">
              Tools
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              href={`/categories/${category.id}`}
              className="hover:text-primary"
            >
              {category.label}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="font-medium text-on-surface">
            {tool.name}
          </li>
        </ol>
      </nav>

      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Icon className="size-6" aria-hidden="true" />
          </div>
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge
                className={
                  tool.status === "available"
                    ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                    : "bg-surface-high text-on-surface-variant"
                }
              >
                {tool.status === "available" ? "Available now" : "Coming soon"}
              </Badge>
              {tool.requiresBackend && (
                <Badge variant="outline">Requires an online service</Badge>
              )}
            </div>
            <h1 className="font-heading text-3xl font-bold tracking-tight text-on-surface sm:text-4xl">
              {tool.name}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-on-surface-variant sm:text-base">
              {tool.description}
            </p>
          </div>
        </div>
        <Button asChild variant="secondary" className="shrink-0">
          <Link href={`/categories/${category.id}`}>More {category.label}</Link>
        </Button>
      </header>

      {tool.status === "available" ? (
        <div className="mx-auto max-w-2xl">
          <ToolExperience implementation={tool.implementation} />
        </div>
      ) : (
        <ToolPlaceholder category={category.label} />
      )}
    </article>
  );
}
