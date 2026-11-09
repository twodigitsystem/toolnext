import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import "./globals.css";
import type { ReactNode } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { siteUrl } from "@/lib/site";
import { availableTools, plannedTools } from "@/lib/tool-registry/tools";
import { cn } from "@/lib/utils";
import { ServiceWorkerRegistry } from "../components/landing-page/service-worker-registry";
import { SiteFooter } from "../components/landing-page/site-footer";
import { SiteHeader } from "../components/landing-page/site-header";

const description = `Use ${availableTools.length} free browser-based utilities for common text, code, calculation, conversion, and everyday tasks. Browse ${plannedTools.length} more planned tools.`;

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["600", "700", "800"],
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "ToolNext - Free Browser-Based Quick Tools",
  description,
  applicationName: "ToolNext",
  appleWebApp: {
    capable: true,
    title: "ToolNext",
    statusBarStyle: "default",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
  keywords: [
    "browser-based tools",
    "word counter",
    "percentage calculator",
    "unit converter",
    "color inspector",
    "planned online utilities",
  ],
  openGraph: {
    title: "ToolNext - Free Browser-Based Quick Tools",
    description,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "ToolNext - Free Browser-Based Quick Tools",
    description,
  },
};

export const viewport: Viewport = {
  themeColor: "#4f46e5",
  colorScheme: "light dark",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "ToolNext - Free Browser-Based Quick Tools",
    url: siteUrl,
    description,
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      `${availableTools.length} browser-based tools available now`,
      `${plannedTools.length} planned tool listings`,
      "No sign-up required",
      ...availableTools.map((tool) => tool.name),
    ],
  };

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        inter.variable,
        jakarta.variable,
        jetbrains.variable,
        "font-sans",
      )}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <TooltipProvider>
            <script type="application/ld+json">
              {JSON.stringify(jsonLd).replace(/</g, "\\u003c")}
            </script>
            <SiteHeader />
            <div className="flex flex-1 flex-col">{children}</div>
            <SiteFooter />
            <Toaster position="bottom-right" richColors />
            <ServiceWorkerRegistry />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
