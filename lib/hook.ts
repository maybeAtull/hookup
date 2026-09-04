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
  readonly id: string;
  readonly name: string;
  readonly category: HookCategory;
  readonly description: string;
  readonly repoUrl: string;
}
