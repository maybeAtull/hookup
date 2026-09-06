import type { ReactElement } from "react";
import { HOOKS } from "@/data/hooks";
import { SiteHeader } from "@/components/site-header";
import { HookGrid } from "@/components/hook-grid";

export default function Home(): ReactElement {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-12">
      <SiteHeader hookCount={HOOKS.length} />
      <section id="hooks" className="scroll-mt-8">
        <h2 className="mb-6 text-sm font-medium tracking-wide text-foreground/50 uppercase">
          The directory
        </h2>
        <HookGrid hooks={HOOKS} />
      </section>
    </div>
  );
}
