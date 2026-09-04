# HookHub — MVP Spec

Status: **Draft v1** · Scope: **MVP (display only)** · Last updated: 2026-09-04

---

## 1. Overview

**HookHub** is a browsable directory of cool, open-source **Claude Code hooks**.

Today, discovering hooks means trawling scattered GitHub repos, gists, and "awesome" lists. HookHub collects them into one page you can scan in ten seconds.

**The v1 promise, in one line:** land on the home page, see a grid of curated hooks — each with a name, category, and short description — and click any one to go straight to its source repo on GitHub.

That's it. No accounts, no search, no submissions. v1 is a well-made list.

**Audience:** Claude Code users looking for hooks worth stealing.

---

## 2. Background: what is a Claude Code hook?

A hook is a script or handler that Claude Code fires automatically at a specific point in its lifecycle. Hooks are how you make Claude Code behave deterministically — enforce a rule, run a formatter, play a sound — rather than hoping the model remembers.

Hooks are registered under a `"hooks"` key in a settings file, at one of three scopes:

- `~/.claude/settings.json` — all projects, personal
- `.claude/settings.json` — one project, checked in and shareable
- `.claude/settings.local.json` — one project, personal, gitignored

The scripts themselves conventionally live in `.claude/hooks/`:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/block-rm.sh"
          }
        ]
      }
    ]
  }
}
```

There are roughly 33 lifecycle events. The ones people actually hook:

| Event | Fires |
| --- | --- |
| `SessionStart` | A session begins or resumes |
| `UserPromptSubmit` | You submit a prompt, before Claude sees it |
| `PreToolUse` | Before a tool runs — **the only event that can block the call** |
| `PostToolUse` | After a tool succeeds |
| `Notification` | Claude Code sends a notification |
| `SubagentStop` | A subagent finishes |
| `Stop` | Claude finishes responding |
| `PreCompact` | Before context compaction |
| `SessionEnd` | The session terminates |

Five hook types exist: `command` (shell), `http`, `mcp_tool`, `prompt` (ask a model), and `agent` (spawn a subagent). Matchers filter by tool name — `Bash`, `Edit|Write`, `mcp__memory__.*`.

**What people build with them:** blocking `rm -rf` and `.env` reads, auto-formatting edited files, playing a sound when Claude needs attention or finishes a task, injecting project context at session start, and logging tool activity for later review.

Reference: <https://code.claude.com/docs/en/hooks>

---

## 3. Goals

1. Display a curated set of hooks in a responsive grid.
2. Make each card link out to the hook's source repository.
3. Make adding a new hook a **one-entry append to a single file** — no CMS, no migration, no deploy ceremony.
4. Ship something fully static and fast, with no runtime dependencies.

## 4. Non-goals (deferred, not rejected)

Everything below is explicitly **out of scope for v1**. Named here so scope creep is visible when it happens.

- User accounts / auth
- A submission form (adding a hook is a PR)
- Text search
- Category filtering
- Per-hook detail pages
- GitHub API enrichment — star counts, last-updated, avatars
- Ratings, voting, "trending"
- Pagination or infinite scroll
- A database or CMS
- A manual dark-mode toggle (OS preference is respected; there's just no switch)
- Copy-the-install-snippet buttons

---

## 5. Data model

The hook list is a **typed TypeScript file committed to the repo**. It is the single source of truth.

### `lib/hook.ts`

```ts
export const HOOK_CATEGORIES = [
  "Security & Guardrails",
  "Formatting & Linting",
  "Notifications & Sounds",
  "Git & Commits",
  "Testing & Validation",
  "Context & Memory",
  "Observability & Logging",
] as const;

export type HookCategory = (typeof HOOK_CATEGORIES)[number];

export interface Hook {
  /** kebab-case, unique, stable — becomes the detail-page slug if we ever add one */
  readonly id: string;
  readonly name: string;
  readonly category: HookCategory;
  /** 1–2 sentences, ≤ 160 characters, plain text — no markdown, no links */
  readonly description: string;
  /** Canonical https://github.com/<owner>/<repo>[/tree/<branch>/<path>] */
  readonly repoUrl: string;
}
```

### `data/hooks.ts`

```ts
import type { Hook } from "@/lib/hook";

export const HOOKS: readonly Hook[] = [
  {
    id: "awesome-claude-code-sounds",
    name: "Claude Code Sounds",
    category: "Notifications & Sounds",
    description:
      "Plays a sound when Claude needs your attention, finishes a task, or a subagent completes.",
    repoUrl: "https://github.com/varun86/awesome-claude-code-sounds",
  },
  // ...
];
```

### Why a `.ts` file and not `hooks.json`

`HOOK_CATEGORIES` is a `const` tuple, so `HookCategory` is derived from it automatically. A typo in a category — `"Security and Guardrails"` — becomes a **compile error**, not a card that silently renders wrong. JSON gives you none of that.

### Derived, not stored

The repo owner is **parsed from `repoUrl`**, never duplicated into its own field. One source of truth; a corrected URL can't disagree with a stale author string.

```ts
// lib/parse-repo-slug.ts
export function parseRepoSlug(repoUrl: string): { owner: string; repo: string } | null
```

Returns `null` for anything that isn't a recognizable GitHub URL, and the card footer simply omits the slug in that case. It must not throw — one malformed entry should not take down the page.

### Seed content

**Target: 10–15 entries, spanning at least 4 categories.**

Curate from these community indexes (all three verified live during research):

- <https://github.com/hesreallyhim/awesome-claude-code> — the de-facto community index (~28k stars). Notably, it keeps its own list in a machine-readable table (`THE_RESOURCES_TABLE_NEW.csv`) and generates its README from it. Good precedent for the data-file-as-source-of-truth approach here.
- <https://github.com/pascalporedda/awesome-claude-code>
- <https://github.com/varun86/awesome-claude-code-sounds>

**Editorial rules for an entry:**

1. **Open every URL before committing it.** A dead link in a directory of links is the one unforgivable bug. Do not copy URLs from a list without loading them.
2. **Write your own description.** Don't paste the repo tagline. Say what the hook *does*, in the user's terms.
3. **Prefer actual hook implementations** over meta "awesome" lists. A list of hooks is not a hook. (An index may earn a slot, but no more than one or two.)
4. **One category per hook** — the primary one. If a hook genuinely spans two, pick the reason someone would go looking for it.
5. **`id` must be stable.** It's a future URL. Renaming it later breaks links.

---

## 6. Architecture

### Route map

A single route: `/`.

### Files

| File | Role |
| --- | --- |
| `app/page.tsx` | Server component. Renders `<SiteHeader />` + `<HookGrid hooks={HOOKS} />`. Replaces the `create-next-app` starter wholesale. |
| `app/layout.tsx` | Update `metadata` only. **Keep** the existing `LayoutProps<"/">` signature and the Geist font wiring. |
| `app/globals.css` | Extend theme tokens (§8). |
| `components/site-header.tsx` | Title, one-line tagline, hook count. |
| `components/hook-grid.tsx` | Responsive grid wrapper. |
| `components/hook-card.tsx` | A single card. |
| `lib/hook.ts` | `Hook`, `HookCategory`, `HOOK_CATEGORIES`. |
| `lib/parse-repo-slug.ts` | `repoUrl` → `{ owner, repo }`. |
| `data/hooks.ts` | `export const HOOKS: readonly Hook[]`. |

### The load-bearing architectural property

**With grid-only scope there is zero interactivity, so no file needs `"use client"`.**

Every component is a server component, the data is a static import, and `next build` emits `/` as a fully prerendered static route. No hydration cost, no client bundle beyond the Next runtime.

This is worth defending. The **first** feature that breaks it is filter chips or a search box — either one introduces `useState` and therefore the first client boundary. When that day comes, keep the boundary as small as possible: the filter control and the list it drives become the client component; `HookCard` should stay a server component rendered as `children`. Make it a deliberate decision, not an accident.

---

## 7. Layout & visual spec

**Page shell**

```
max-w-6xl mx-auto px-6 py-12
```

**Grid**

```
grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4
```

**Card anatomy**, top to bottom:

```
┌─────────────────────────────────┐
│ [ Notifications & Sounds ]      │  ← category badge, small caps/muted
│                                 │
│ Claude Code Sounds              │  ← <h3>, the strongest text on the card
│                                 │
│ Plays a sound when Claude needs │  ← description, clamped to 3 lines
│ your attention, finishes a      │
│ task, or a subagent completes.  │
│                                 │
│ varun86/awesome-claude-code-… ↗ │  ← owner/repo, muted, + external-link glyph
└─────────────────────────────────┘
```

**Interaction rules**

- **The entire card is one `<a>`**: `href={repoUrl}`, `target="_blank"`, `rel="noopener noreferrer"`. One focusable element per card — never nest interactive elements inside it.
- Hover: border color shift plus a subtle lift.
- Focus: a **visible focus ring is required.** Keyboard users must be able to see where they are. Do not remove the outline without replacing it.
- The description is clamped with `line-clamp-3`; keeping descriptions under 160 characters means the clamp rarely fires.

**Accessibility**

- Category is conveyed as **text**, never by color alone.
- Card titles are `<h3>` under the header's `<h1>` — don't skip levels.
- The external-link glyph is decorative (`aria-hidden`); the link's accessible name comes from the hook name.

---

## 8. Theming

Tailwind here is **v4, CSS-first**. There is no `tailwind.config.ts` and none should be added — all theme configuration lives in `app/globals.css` via `@theme` / `@theme inline`.

### What's missing today

The current `globals.css` defines only four tokens — `--color-background`, `--color-foreground`, `--font-sans`, `--font-mono`. There are no card, border, or muted colors, which is not enough to build a card.

**Add** `--card`, `--border`, `--muted`, `--accent` to `:root`, mirror them inside the existing `@media (prefers-color-scheme: dark)` block, and expose all of them through `@theme inline`.

### Two scaffold defects to fix while you're in there

1. **Geist is loaded but never used.** `app/globals.css:25` sets `body { font-family: Arial, Helvetica, sans-serif; }`, which overrides the Geist font wired up in `layout.tsx`. (The starter page only looked right because it re-applied `font-sans` on a child div.) Change it to `var(--font-geist-sans)`.
2. **Dark mode is OS-only.** The file uses `@media (prefers-color-scheme: dark)` with no `@custom-variant dark` and no class/`data-theme` selector. That's correct for v1 — but note that adding a manual theme toggle later requires rewriting this block first, or `dark:` variants in JSX will keep following the OS and ignore the switch.

---

## 9. Acceptance criteria

v1 is done when all of these hold:

- [ ] `/` renders every entry in `HOOKS` as a card, and the count shown in the header equals `HOOKS.length`.
- [ ] The grid is 1 column on mobile, 2 at `sm`, 3 at `lg`.
- [ ] Every card links to its `repoUrl`, opens in a new tab, and carries `rel="noopener noreferrer"`.
- [ ] **Every seeded URL resolves to a live page** (checked by hand, not assumed).
- [ ] Category is readable as text on every card.
- [ ] Each card is a single tab stop with a visible focus ring.
- [ ] `npm run build` succeeds and reports `/` as a **static** route.
- [ ] `npm run lint` passes clean.
- [ ] `"use client"` appears **nowhere** in the codebase.
- [ ] Geist renders (not Arial) — confirm in devtools, not by eye.
- [ ] Adding a hook requires appending one object to `data/hooks.ts` and touching no other file.

---

## 10. Conventions

- **kebab-case** for file and directory names — `components/hook-card.tsx`, not `HookCard.tsx`.
- Explicit return types on all exported functions. No `any`.
- `readonly` and `as const` for static data.
- Path alias `@/*` maps to the **project root** (not `src/`) — so `@/components/hook-card`, `@/lib/hook`, `@/data/hooks`.
- `tsconfig.json` has `strict: true`. Keep it that way.

**Next.js version warning.** This project runs Next.js 16, which postdates most models' training data. Per the repo's `CLAUDE.md` and `AGENTS.md`: **check `node_modules/next/dist/docs/` for current API shape** before using an App Router API, config option, or convention you're not certain about. Notably, `app/layout.tsx` already uses the Next 16 generated-type global `LayoutProps<"/">` rather than a hand-written `{ children }` prop type — preserve that pattern.

### Housekeeping note

`memory/frontend/CLAUD.md` exists in this repo (untracked). Two problems with it:

1. Despite living under `memory/frontend/`, its contents are a **NestJS / MikroORM / class-validator backend style guide**. The module/controller/DTO/service half does not apply to a Next.js App Router frontend. The portable subset — kebab-case filenames, explicit types, no `any`, `readonly`/`as const`, verb-prefixed function names — has been folded into this section already.
2. It's spelled `CLAUD.md`, missing the `E`. Claude Code auto-loads a `CLAUDE.md` found in a directory it's working in; `CLAUD.md` is just an ordinary file and gets read only when explicitly pointed at. **This applies to this spec file too** — rename both to `CLAUDE.md` if auto-loading is the intent.

Recommendation: rescope or delete `memory/frontend/CLAUD.md`.

---

## 11. Deferred roadmap (v2+)

Ordered by likely value, with the real cost of each:

1. **Category filter chips** — highest value once the list passes ~20 entries. *Cost: introduces the first client component; see §6.*
2. **Text search** — substring match over name + description. *Cost: none beyond the client boundary that filtering already paid for. Redundant until the list is large.*
3. **Hook detail pages** (`/hooks/[id]`) — full description, install snippet, event badges. *Cost: a real content-authoring burden — each hook now needs long-form copy, not one sentence.*
4. **GitHub API enrichment** — stars, last-updated, owner avatar. *Cost: a token, rate-limit handling, and a build-time fetch step. Also makes the site's freshness depend on rebuild cadence.*
5. **Submission flow** — a form instead of a PR. *Cost: this is the one that requires a database, moderation, and spam defense. It ends the "static site" era of the project.*

---

## Appendix: sources

- [Claude Code hooks reference](https://code.claude.com/docs/en/hooks) — authoritative event list, settings shape, hook types
- [hesreallyhim/awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code)
- [pascalporedda/awesome-claude-code](https://github.com/pascalporedda/awesome-claude-code)
- [varun86/awesome-claude-code-sounds](https://github.com/varun86/awesome-claude-code-sounds)
