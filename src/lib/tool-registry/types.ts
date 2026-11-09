import type { ComponentType } from "react";

export type ToolCategory =
  | "text"
  | "developer"
  | "converter"
  | "calculator"
  | "datetime"
  | "image"
  | "pdf"
  | "color"
  | "generator"
  | "seo"
  | "network"
  | "security"
  | "media"
  | "social"
  | "utility";

export type Tool = {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  href: string;
  icon: ComponentType<{ className?: string }>;
  featured?: boolean;
  popular?: boolean;
  isNew?: boolean;
  requiresBackend?: boolean;
  implementation?: ToolImplementation;
};

export type ToolStatus = "available" | "planned";

export type ToolImplementation =
  | "word-counter"
  | "percentage-calculator"
  | "unit-converter"
  | "color-picker"
  | "case-converter"
  | "json-formatter"
  | "temperature-converter"
  | "discount-calculator"
  | "week-number"
  | "placeholder-image"
  | "hex-to-rgb"
  | "random-number"
  | "utm-link-builder"
  | "url-parser"
  | "hash-generator"
  | "subtitle-converter"
  | "whatsapp-link"
  | "coin-flip"
  | "password-strength"
  | "character-counter"
  | "text-reverser"
  | "remove-duplicates"
  | "slug-generator"
  | "base64"
  | "url-encoder"
  | "tip-calculator"
  | "unix-timestamp"
  | "uuid-generator"
  | "random-picker";

export type RegisteredTool =
  | (Tool & {
      status: "available";
      implementation: ToolImplementation;
    })
  | (Tool & {
      status: "planned";
      implementation?: undefined;
    });

export type Category = {
  id: ToolCategory;
  label: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
};
