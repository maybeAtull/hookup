# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

- `npm run dev` — start the dev server (http://localhost:3000)
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run lint` — run ESLint (flat config via `eslint.config.mjs`)

There is no test runner configured yet.

## Architecture

This is a fresh `create-next-app` scaffold (Next.js 16, App Router, React 19, TypeScript, Tailwind CSS v4) with no custom application code beyond the default template — `app/page.tsx` and `app/layout.tsx` are still the generated starter files.

- **Routing**: App Router only (`app/`) — no Pages Router.
- **Styling**: Tailwind v4 via `@tailwindcss/postcss` (see `postcss.config.mjs`); no separate `tailwind.config` file (v4 uses CSS-based config in `app/globals.css`).
- **Fonts**: Geist Sans/Mono loaded via `next/font/google` in `app/layout.tsx` and exposed as CSS variables.
- **Path alias**: `@/*` maps to the project root (`tsconfig.json`).
- **Typed routes**: `next-env.d.ts` and `.next/types` generate route param types (e.g. `LayoutProps<"/">` in `app/layout.tsx`); regenerated automatically by `next dev`/`next build`.

Because Next.js 16 postdates this model's training data, always check `node_modules/next/dist/docs/` for current API shape before using App Router APIs, config options, or conventions you're not certain about.
