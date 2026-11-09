"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import { ErrorBoundary } from "@/components/shared/error-boundary";
import type { ToolImplementation } from "@/lib/tool-registry/types";

const loading = () => (
  <div
    role="status"
    className="h-72 animate-pulse rounded-2xl border border-border bg-card"
    aria-label="Loading tool"
  />
);

const toolComponents: Record<ToolImplementation, ComponentType> = {
  "word-counter": dynamic(
    () =>
      import("@/components/landing-page/quick-tools/word-counter").then(
        (module) => module.WordCounter,
      ),
    { loading },
  ),
  "percentage-calculator": dynamic(
    () =>
      import("@/components/landing-page/quick-tools/percentage").then(
        (module) => module.PercentageCalc,
      ),
    { loading },
  ),
  "unit-converter": dynamic(
    () =>
      import("@/components/landing-page/quick-tools/unit-converter").then(
        (module) => module.UnitConverter,
      ),
    { loading },
  ),
  "color-picker": dynamic(
    () =>
      import("@/components/landing-page/quick-tools/color-inspector").then(
        (module) => module.ColorInspector,
      ),
    { loading },
  ),
  "case-converter": dynamic(
    () =>
      import("@/features/tools/text-developer-tools").then(
        (module) => module.CaseConverter,
      ),
    { loading },
  ),
  "json-formatter": dynamic(
    () =>
      import("@/features/tools/text-developer-tools").then(
        (module) => module.JsonFormatter,
      ),
    { loading },
  ),
  "temperature-converter": dynamic(
    () =>
      import("@/features/tools/measurement-tools").then(
        (module) => module.TemperatureConverter,
      ),
    { loading },
  ),
  "discount-calculator": dynamic(
    () =>
      import("@/features/tools/measurement-tools").then(
        (module) => module.DiscountCalculator,
      ),
    { loading },
  ),
  "week-number": dynamic(
    () =>
      import("@/features/tools/measurement-tools").then(
        (module) => module.WeekNumber,
      ),
    { loading },
  ),
  "placeholder-image": dynamic(
    () =>
      import("@/features/tools/web-tools").then(
        (module) => module.PlaceholderImage,
      ),
    { loading },
  ),
  "hex-to-rgb": dynamic(
    () =>
      import("@/features/tools/measurement-tools").then(
        (module) => module.HexToRgb,
      ),
    { loading },
  ),
  "random-number": dynamic(
    () =>
      import("@/features/tools/web-tools").then(
        (module) => module.RandomNumber,
      ),
    { loading },
  ),
  "utm-link-builder": dynamic(
    () =>
      import("@/features/tools/web-tools").then(
        (module) => module.UtmLinkBuilder,
      ),
    { loading },
  ),
  "url-parser": dynamic(
    () =>
      import("@/features/tools/web-tools").then((module) => module.UrlParser),
    { loading },
  ),
  "hash-generator": dynamic(
    () =>
      import("@/features/tools/web-tools").then(
        (module) => module.HashGenerator,
      ),
    { loading },
  ),
  "subtitle-converter": dynamic(
    () =>
      import("@/features/tools/social-utility-tools").then(
        (module) => module.SubtitleConverter,
      ),
    { loading },
  ),
  "whatsapp-link": dynamic(
    () =>
      import("@/features/tools/social-utility-tools").then(
        (module) => module.WhatsAppLink,
      ),
    { loading },
  ),
  "coin-flip": dynamic(
    () =>
      import("@/features/tools/social-utility-tools").then(
        (module) => module.CoinFlip,
      ),
    { loading },
  ),
  "password-strength": dynamic(
    () =>
      import("@/features/tools/security-tools").then(
        (module) => module.PasswordStrength,
      ),
    { loading },
  ),
  "character-counter": dynamic(
    () =>
      import("@/features/tools/text-developer-tools").then(
        (module) => module.CharacterCounter,
      ),
    { loading },
  ),
  "text-reverser": dynamic(
    () =>
      import("@/features/tools/text-developer-tools").then(
        (module) => module.TextReverser,
      ),
    { loading },
  ),
  "remove-duplicates": dynamic(
    () =>
      import("@/features/tools/text-developer-tools").then(
        (module) => module.RemoveDuplicateLines,
      ),
    { loading },
  ),
  "slug-generator": dynamic(
    () =>
      import("@/features/tools/text-developer-tools").then(
        (module) => module.SlugGenerator,
      ),
    { loading },
  ),
  base64: dynamic(
    () =>
      import("@/features/tools/text-developer-tools").then(
        (module) => module.Base64Converter,
      ),
    { loading },
  ),
  "url-encoder": dynamic(
    () =>
      import("@/features/tools/text-developer-tools").then(
        (module) => module.UrlEncoder,
      ),
    { loading },
  ),
  "tip-calculator": dynamic(
    () =>
      import("@/features/tools/measurement-tools").then(
        (module) => module.TipCalculator,
      ),
    { loading },
  ),
  "unix-timestamp": dynamic(
    () =>
      import("@/features/tools/datetime-tools").then(
        (module) => module.UnixTimestamp,
      ),
    { loading },
  ),
  "uuid-generator": dynamic(
    () =>
      import("@/features/tools/generator-tools").then(
        (module) => module.UuidGenerator,
      ),
    { loading },
  ),
  "random-picker": dynamic(
    () =>
      import("@/features/tools/generator-tools").then(
        (module) => module.RandomPicker,
      ),
    { loading },
  ),
};

export function ToolExperience({
  implementation,
}: {
  implementation: ToolImplementation;
}) {
  const ToolComponent = toolComponents[implementation];
  return (
    <ErrorBoundary>
      <ToolComponent />
    </ErrorBoundary>
  );
}
