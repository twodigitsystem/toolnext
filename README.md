# Utility Heaven / ToolNext

Utility Heaven is the working name for **ToolNext**, an all-in-one utility platform built with Next.js. It has a responsive landing page, a searchable tool directory, category pages, and canonical pages for each registered tool. Tool availability is tied to actual implementations, so planned tools are labeled clearly rather than presented as working utilities.

## Features

- Responsive landing page with hero search, categories, tool directory, FAQ, trust, and CTA sections
- Search, category/status filters, sorting, and pagination for the tool catalog; `Cmd/Ctrl + K` focuses search
- The tool directory defaults to available tools; planned listings require an explicit availability filter
- Dedicated About, Privacy Policy, and Terms of Use pages describing the current product and data practices
- Interactive quick utilities:
  - Word counter
  - Percentage calculator
  - Unit converter
  - Color picker
- 25 additional browser-only tools across text, developer, conversion, calculation, date/time, image, color, generator, SEO, network, security, media, social, and utility categories
- Tool inputs are processed locally; only the four homepage quick tools currently persist selected inputs in browser storage
- Light/dark theme support via `next-themes`
- Recent directory searches are stored locally in the browser
- Installable PWA support with an install prompt, offline fallback, and cached pages/assets
- shadcn-style UI components, Tailwind CSS 4, Lucide icons, Sonner toasts
- Biome for linting, formatting, and import organization

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/Radix UI components
- Biome
- pnpm

## Getting Started

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command       | Description                          |
| ------------- | ------------------------------------ |
| `pnpm dev`    | Start the Next.js development server |
| `pnpm build`  | Create a production build            |
| `pnpm start`  | Serve the production build           |
| `pnpm lint`   | Run Biome checks                     |
| `pnpm format` | Format files with Biome              |

## Project Structure

```text
src/
  app/
    (marketing)/             # Landing and marketing routes
    (browse)/
      _components/            # Shared browse UI
      categories/[category]/ # Category pages
      tools/page.tsx         # Catalog
      tools/[slug]/page.tsx  # Canonical tool page
      tools/[slug]/[name]/   # Legacy URL redirects
    layout.tsx               # Global layout, metadata, header and footer
  components/
    landing-page/            # Landing sections and available quick tools
    ui/                      # Reusable UI primitives
    shared/                  # Shared components
  features/tools/            # Shared tool renderer and browser-based tools
  lib/
    tool-registry/           # Categories and catalog entries, grouped by category
    site.ts                  # Canonical site URL shared by metadata and robots
    slugify.ts               # Legacy URL slug helper
  hooks/                     # Shared React hooks
code.html                    # Static HTML design prototype/reference
```

## Adding a tool

1. Add the tool's metadata to the appropriate module under `src/lib/tool-registry/tools/`. Use a unique `id` and the canonical `href: /tools/{id}`.
2. Leave `implementation` unset while the tool is planned. The registry derives its status from this field; do not mark a placeholder as available.
3. Implement and test the tool, then add its implementation key to `ToolImplementation` in `src/lib/tool-registry/types.ts` and map it to the component in `src/features/tools/tool-experience.tsx`.
4. Run `pnpm exec tsc --noEmit` and `pnpm build`. The registry validates unique IDs and URLs, known categories, and canonical paths at runtime.

The shared `/tools/[slug]` route handles all tool detail pages; adding a tool does not require adding a route folder. The older `/tools/{category}/{name}` shape is retained only to redirect existing links.

## Deployment configuration

- The project uses the `pnpm` package manager, pinned in `package.json`.
- Deploy over HTTPS for service-worker registration and installation outside localhost. The production service worker caches the app shell and static assets, keeps up to 100 visited pages for offline use, and shows a dedicated offline page for uncached routes.
- PWA icon assets are in `public/icons/`: 192×192 and 512×512 standard icons, a 512×512 maskable icon, and a 180×180 Apple touch icon. They are generated from `public/icon.svg`; replace that artwork and regenerate the variants if you provide final brand artwork.
- Optional install-prompt screenshots can improve the install experience on supported browsers: one mobile screenshot and one desktop screenshot. They are not required for PWA installation.
- `NEXT_PUBLIC_SITE_URL` sets the canonical site origin; it defaults to `https://toolnext.vercel.app`.
- `NEXT_PUBLIC_CONTACT_EMAIL` overrides the support/privacy address shown on the legal pages; it defaults to `developer.twodigitsystem@gmail.com`.
- The About, Privacy, and Terms pages describe current behavior, including local browser storage and service-worker caching. Review them against the final operator identity, jurisdiction, and hosting/analytics setup before publishing.
- Utility inputs are handled in the browser; avoid entering sensitive data until privacy behavior is reviewed for each tool.
- PDF utilities remain planned until a dependable PDF-processing implementation is in place.
