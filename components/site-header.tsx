import type { ReactElement } from "react";

export function SiteHeader({ hookCount }: { hookCount: number }): ReactElement {
  return (
    <header className="mb-10 flex flex-col gap-2">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">HookHub</h1>
      <p className="text-foreground/70">
        A curated directory of open-source Claude Code hooks — {hookCount} and counting.
      </p>
    </header>
  );
}
