import type { ReactElement } from "react";
import type { Hook } from "@/lib/hook";
import { parseRepoSlug } from "@/lib/parse-repo-slug";

export function HookCard({ hook }: { hook: Hook }): ReactElement {
  const slug = parseRepoSlug(hook.repoUrl);

  return (
    <a
      href={hook.repoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-3 rounded-lg border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <span className="w-fit rounded-full bg-muted px-2.5 py-1 text-xs font-medium tracking-wide text-foreground/80 uppercase">
        {hook.category}
      </span>

      <h3 className="text-base font-semibold text-foreground">{hook.name}</h3>

      <p className="line-clamp-3 text-sm text-foreground/70">{hook.description}</p>

      {slug && (
        <span className="mt-auto flex items-center gap-1 pt-1 text-xs text-foreground/50">
          {slug.owner}/{slug.repo}
          <span aria-hidden="true">↗</span>
        </span>
      )}
    </a>
  );
}
