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
  | "random-picker"
  | "regex-tester"
  | "password-generator"
  | "json-validator"
  | "text-diff"
  | "qr-code"
  | "markdown-preview"
  | "jwt-decoder"
  | "timestamp-converter"
  | "timezone-converter"
  | "age-calculator"
  | "bmi-calculator"
  | "meta-tag-generator"
  | "pomodoro"
  | "lorem-ipsum"
  | "image-resizer"
  | "sort-lines"
  | "find-replace"
  | "remove-line-breaks"
  | "add-line-numbers"
  | "strip-html"
  | "extract-emails"
  | "extract-urls"
  | "text-stats"
  | "dice-roller"
  | "rps-game"
  | "timer"
  | "number-to-words"
  | "rgb-to-hex"
  | "hsl-converter"
  | "contrast-checker"
  | "number-base-converter"
  | "roman-numeral"
  | "binary-converter"
  | "basic-calculator"
  | "image-compressor";

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
