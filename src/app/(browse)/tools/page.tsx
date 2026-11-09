import type { Metadata } from "next";
import { ToolsPageContent } from "./_components/tools-page-content";

export const metadata: Metadata = {
  title: "Browse Tools",
  description:
    "Search ToolNext's free browser-based utilities and discover tools in development.",
};

export default function ToolsPage() {
  return <ToolsPageContent />;
}
