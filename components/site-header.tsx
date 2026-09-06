import type { ReactElement } from "react";

const SUBMIT_HOOK_URL =
  "https://github.com/maybeAtull/hookup/edit/main/data/hooks.ts";

export function SiteHeader({ hookCount }: { hookCount: number }): ReactElement {
  return (
    <header className="mb-14 flex flex-col items-start gap-6 border-b border-border pb-14">
      <span className="rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium tracking-wide text-accent uppercase">
        Claude Code hooks, curated
      </span>

      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          HookHub
        </h1>
        <p className="max-w-xl text-base text-foreground/70 sm:text-lg">
          A curated directory of open-source Claude Code hooks — {hookCount} and
          counting. Browse what&apos;s live, or publish your own for the next
          person to find.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <a
          href="#hooks"
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Browse the directory
        </a>
        <a
          href={SUBMIT_HOOK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Publish a hook ↗
        </a>
      </div>
    </header>
  );
}
