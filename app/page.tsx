import Link from "next/link";
import { Button } from "@/components/ui/Button";

const features = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
    title: "Interactive System Map",
    desc: "Explore your entire codebase as a live, zoomable graph. Click any node to inspect metrics, dependencies, and risk signals.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: "AI Architecture Analysis",
    desc: "Claude analyzes your modules, detects coupling issues, and surfaces architectural risks with concrete recommendations.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Security Scan",
    desc: "Identify exposed secrets, injection vectors, and insecure patterns across your codebase before they reach production.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
      </svg>
    ),
    title: "Dependency Tracking",
    desc: "See exactly what breaks when something changes. Trace data flow and understand blast radius before touching shared modules.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
    title: "AI Codebase Chat",
    desc: "Ask questions about your architecture and get instant, context-aware answers grounded in your actual system map.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
      </svg>
    ),
    title: "Share & Export",
    desc: "Share a live read-only link or export your system map as PDF. Keep your team aligned without scheduling another meeting.",
  },
];

const steps = [
  {
    n: "01",
    title: "Connect or upload",
    desc: "Link your GitHub account and pick a repo, or drag-and-drop project files directly. Private repos supported.",
  },
  {
    n: "02",
    title: "AI analysis runs",
    desc: "PRAKSYS parses your source files, builds a dependency graph, runs a security scan, and generates AI insights — in seconds.",
  },
  {
    n: "03",
    title: "Explore your system",
    desc: "Navigate an interactive map, inspect module metrics, chat with your codebase, and share results with your team.",
  },
];

export default function LandingPage() {
  return (
    <div className="space-y-24 pb-20">

      {/* Hero */}
      <section className="mx-auto max-w-4xl pt-10 md:pt-16 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-muted">Developer System Intelligence</p>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight text-white md:text-6xl lg:text-7xl">
          Understand your<br />
          <span className="text-accent">codebase</span>, instantly.
        </h1>
        <p className="mt-6 mx-auto max-w-2xl text-base leading-relaxed text-slate-400 md:text-lg">
          Connect GitHub or upload files to generate an interactive system map with AI-powered architecture analysis, security scanning, and dependency tracking.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link href="/repo">
            <Button className="px-6 py-3 text-base">
              Connect GitHub
            </Button>
          </Link>
          <Link href="/upload">
            <Button variant="secondary" className="px-6 py-3 text-base">
              Upload Files
            </Button>
          </Link>
        </div>
        <p className="mt-4 text-xs text-muted">Free to start · No credit card required</p>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.25em] text-muted">What you get</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">Everything your team needs to ship with confidence</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="glass-panel rounded-xl border border-slate-800/80 p-6 hover:border-accent/30 hover:shadow-glow-sm transition-all duration-300"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent mb-4">
                {f.icon}
              </div>
              <h3 className="font-medium text-white mb-2">{f.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.25em] text-muted">How it works</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">From repo to insight in under a minute</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="relative">
              <div className="text-5xl font-bold text-accent/15 mb-3 select-none">{s.n}</div>
              <h3 className="font-medium text-white mb-2">{s.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-2xl text-center">
        <div className="glass-panel rounded-2xl border border-accent/20 shadow-glow-sm p-10 md:p-14">
          <h2 className="text-3xl font-semibold text-white">Ready to map your system?</h2>
          <p className="mt-3 text-slate-400">
            Connect your GitHub account and analyze your first repo in seconds. Free plan includes 3 analyses per month.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/sign-in">
              <Button className="px-6 py-3 text-base flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
                Sign in with GitHub
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="secondary" className="px-6 py-3 text-base">
                View Demo Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
