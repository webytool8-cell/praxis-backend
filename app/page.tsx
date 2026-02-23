import Link from "next/link";
import { Button } from "@/components/ui/Button";
<<<<<<< HEAD
=======
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> codex/generate-next.js-project-structure-for-praxis-tnp5m1
=======
>>>>>>> main
>>>>>>> main
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
<<<<<<< HEAD
=======
=======

export default function LandingPage() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-8 md:p-12">
      <h1 className="text-4xl font-bold tracking-tight text-slate-900">PRAXIS</h1>
      <p className="mt-4 max-w-2xl text-lg text-slate-600">
        Upload a codebase or connect a GitHub repository to generate an interactive visual system
        map of modules, dependencies, and architecture insights.
      </p>
      <Link href="/dashboard" className="mt-8 inline-block">
        <Button>Get Started</Button>
      </Link>
    </section>
<<<<<<< HEAD
>>>>>>> codex/generate-next.js-project-structure-for-praxis
>>>>>>> codex/generate-next.js-project-structure-for-praxis-tnp5m1
=======
>>>>>>> main
>>>>>>> main
>>>>>>> main
  );
}
