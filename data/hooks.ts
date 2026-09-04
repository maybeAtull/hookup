import type { Hook } from "@/lib/hook";

export const HOOKS: readonly Hook[] = [
  {
    id: "claude-rm-rf",
    name: "claude-rm-rf",
    category: "Security & Guardrails",
    description:
      "PreToolUse hook that intercepts destructive delete commands before Claude can run them.",
    repoUrl: "https://github.com/zcaceres/claude-rm-rf",
  },
  {
    id: "claude-code-hooks-library",
    name: "Claude Code Hooks Library",
    category: "Security & Guardrails",
    description:
      "60+ ready-made hooks covering security, code quality, git, logging, and notifications.",
    repoUrl: "https://github.com/CodyLunders/claude-code-hooks-library",
  },
  {
    id: "claude-format-hook",
    name: "claude-format-hook",
    category: "Formatting & Linting",
    description:
      "Auto-formats files Claude edits using Biome, Ruff, or Prettier depending on language.",
    repoUrl: "https://github.com/ryanlewis/claude-format-hook",
  },
  {
    id: "claude-hooks-clean-code",
    name: "Claude Hooks",
    category: "Testing & Validation",
    description:
      "Enforces clean-code practices and automates workflow checks as Claude makes changes.",
    repoUrl: "https://github.com/decider/claude-hooks",
  },
  {
    id: "claude-auto-commit",
    name: "claude-auto-commit",
    category: "Git & Commits",
    description:
      "Generates contextual git commit messages from staged changes using the Claude Code SDK.",
    repoUrl: "https://github.com/0xkaz/claude-auto-commit",
  },
  {
    id: "claude-commit-ai",
    name: "claude-commit",
    category: "Git & Commits",
    description:
      "AI-powered commit message generator built on the Claude Agent SDK and Claude Code CLI.",
    repoUrl: "https://github.com/JohannLai/claude-commit",
  },
  {
    id: "claude-sounds",
    name: "claude-sounds",
    category: "Notifications & Sounds",
    description:
      "Plays a sound on session start, task completion, or notification. Works cross-platform.",
    repoUrl: "https://github.com/dgilperez/claude-sounds",
  },
  {
    id: "claude-code-notification",
    name: "Claude Code Notification",
    category: "Notifications & Sounds",
    description:
      "Native macOS desktop notifications with customizable system sounds for session events.",
    repoUrl: "https://github.com/wyattjoh/claude-code-notification",
  },
  {
    id: "claude-remember",
    name: "claude-remember",
    category: "Context & Memory",
    description:
      "Injects persistent identity and context into Claude at session start for continuity.",
    repoUrl: "https://github.com/Digital-Process-Tools/claude-remember",
  },
  {
    id: "claude-code-session-start-hook",
    name: "Session Start Context Hook",
    category: "Context & Memory",
    description:
      "Dynamically loads feature-flagged instructions into a session using LaunchDarkly configs.",
    repoUrl: "https://github.com/launchdarkly-labs/claude-code-session-start-hook",
  },
  {
    id: "claude-code-multi-agent-observability",
    name: "Multi-Agent Observability",
    category: "Observability & Logging",
    description:
      "Streams hook events to a live dashboard for real-time monitoring of Claude Code agents.",
    repoUrl: "https://github.com/disler/claude-code-hooks-multi-agent-observability",
  },
  {
    id: "claude-telemetry",
    name: "claude_telemetry",
    category: "Observability & Logging",
    description:
      "OpenTelemetry wrapper that logs tool calls, token usage, and cost to Datadog or Honeycomb.",
    repoUrl: "https://github.com/TechNickAI/claude_telemetry",
  },
];
