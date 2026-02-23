import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Panel";

export default function LandingPage() {
  return (
    <Panel className="mx-auto max-w-4xl p-10 md:p-14">
      <p className="text-xs uppercase tracking-[0.25em] text-muted">Developer System Intelligence</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white md:text-5xl">PRAXIS</h1>
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">
        Upload a project or connect GitHub to generate an interactive, risk-aware system map with
        architecture, data-flow, and dependency layers.
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/dashboard">
          <Button>Open Dashboard</Button>
        </Link>
        <Link href="/repo">
          <Button variant="secondary">Connect GitHub</Button>
        </Link>
      </div>
    </Panel>
  );
}
