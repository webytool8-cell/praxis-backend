import Link from "next/link";
import { Panel } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";

export default function LandingPage() {
  return (
    <section className="mx-auto grid max-w-6xl gap-6 md:grid-cols-[1.2fr_1fr]">
      <Panel className="p-10">
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
          Understand your system in one glance.
        </h1>
        <p className="mt-4 text-base text-text1">
          Repo → Map → Insights → PDF report. PRAXIS generates an interactive system map for
          architecture, dependencies, data flow, and risk.
        </p>
        <div className="mt-7 flex gap-3">
          <Link href="/repo"><Button variant="primary">Connect GitHub</Button></Link>
          <Link href="/upload"><Button variant="secondary">Upload Project</Button></Link>
        </div>
      </Panel>
      <Panel className="grid place-items-center p-6">
        <div className="h-72 w-full rounded-2xl border border-[rgb(var(--line-1))] bg-[rgb(var(--bg-2))]/50" />
      </Panel>
    </section>
  );
}
