import Link from "next/link";
import { Button } from "@/components/ui/Button";

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
  );
}
