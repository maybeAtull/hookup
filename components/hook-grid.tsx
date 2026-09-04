import type { ReactElement } from "react";
import type { Hook } from "@/lib/hook";
import { HookCard } from "@/components/hook-card";

export function HookGrid({ hooks }: { hooks: readonly Hook[] }): ReactElement {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {hooks.map((hook) => (
        <HookCard key={hook.id} hook={hook} />
      ))}
    </div>
  );
}
