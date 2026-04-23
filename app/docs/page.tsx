import Link from "next/link";
import { auth } from "@/auth";

export const metadata = {
  title: "Docs — PRAKSYS",
  description: "Learn how PRAKSYS analyzes your codebase and generates interactive system maps.",
};

const sections = [
  {
    id: "what-is-praksys",
    title: "What is PRAKSYS?",
    content: `PRAKSYS is a developer intelligence tool that connects to your GitHub repository or accepts a codebase upload and produces an interactive, navigable system map of your project.

It uses AI to parse your source code — mapping services, modules, APIs, and data flows — then renders the result as a live graph you can explore, filter, and share. Designed for engineers who need to onboard quickly, audit architecture, or communicate system structure to stakeholders.`,
  },
  {
    id: "how-it-works",
    title: "How it works",
    steps: [
      {
        n: "1",
        title: "Connect your project",
        body: "Sign in with GitHub to automatically import any of your repositories, or upload a ZIP archive of your codebase. PRAKSYS supports JavaScript, TypeScript, Python, Go, Rust, Java, and more.",
      },
      {
        n: "2",
        title: "AI analysis",
        body: "The Claude AI engine reads your source files, detects modules and services, maps function calls and imports, and identifies API surface areas, data models, and external dependencies.",
      },
      {
        n: "3",
        title: "Explore the graph",
        body: "Your system map loads in the Dashboard as an interactive node graph. Click any node to see a details drawer with metrics, dependencies, risk indicators, and AI-generated summaries.",
      },
    ],
  },
  {
    id: "views",
    title: "Graph views",
    items: [
      {
        name: "Architecture",
        desc: "High-level service topology — how major modules and services relate to each other.",
      },
      {
        name: "Data Flow",
        desc: "Traces how data moves through the system: from ingestion points to storage and output.",
      },
      {
        name: "Dependency",
        desc: "Shows external package dependencies and which internal modules consume them.",
      },
      {
        name: "Risk",
        desc: "Highlights nodes with high complexity, low test coverage, or known security patterns.",
      },
    ],
  },
  {
    id: "features",
    title: "Features",
    items: [
      {
        name: "Heatmap mode",
        desc: "Color-codes nodes by complexity score so hot spots stand out immediately.",
      },
      {
        name: "Cluster view",
        desc: "Toggle between a full expanded graph and a collapsed cluster layout for large codebases.",
      },
      {
        name: "Security findings",
        desc: "The AI flags potential security issues — injection risks, exposed secrets, unvalidated inputs — with a dedicated findings panel.",
      },
      {
        name: "AI Chat (Pro)",
        desc: "Ask questions about your codebase in natural language. The AI has full context of the analysis and can answer architectural questions, explain patterns, or suggest refactors.",
      },
      {
        name: "Export",
        desc: "Download the graph as PNG or SVG, or export the full analysis as JSON for use in other tools.",
      },
    ],
  },
  {
    id: "plans",
    title: "Plans",
    items: [
      { name: "Free", desc: "5 analyses per month, all graph views, PNG export, public repositories." },
      { name: "Pro", desc: "Unlimited analyses, AI Chat, SVG + JSON export, private repositories." },
      { name: "Team", desc: "Everything in Pro plus shared workspace, team access controls, and priority support." },
    ],
  },
  {
    id: "faq",
    title: "FAQ",
    qa: [
      {
        q: "What languages are supported?",
        a: "JavaScript, TypeScript, Python, Go, Rust, Java, Kotlin, Ruby, PHP, C#, and C/C++. Support for additional languages is added regularly.",
      },
      {
        q: "Is my source code stored?",
        a: "PRAKSYS stores only the analysis result (the graph data and node metadata), not your raw source files. Uploaded ZIP archives are deleted after analysis completes.",
      },
      {
        q: "Can I re-analyze after a push?",
        a: "Yes. Go to Connect, select the same repository, and run a new analysis. Each run creates a new entry in your analysis history.",
      },
      {
        q: "How large a codebase can PRAKSYS handle?",
        a: "Repositories up to 200 MB and ~500k lines of code are supported. Very large monorepos may take a few minutes to analyze.",
      },
      {
        q: "Can I share the graph with my team?",
        a: "Every analysis gets a shareable link. Anyone with the link can view the read-only graph without signing in.",
      },
    ],
  },
];

export default async function DocsPage() {
  const session = await auth();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:py-24">
      {/* Header */}
      <div className="mb-14">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent">Documentation</p>
        <h1 className="text-3xl font-bold text-white sm:text-4xl">PRAKSYS — Developer System Intelligence</h1>
        <p className="mt-4 text-base text-slate-400 leading-relaxed">
          Everything you need to connect your codebase and get an interactive system map in minutes.
        </p>
        <div className="mt-6 flex gap-3">
          {session?.user ? (
            <Link
              href="/dashboard"
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90 transition-colors"
            >
              Go to Dashboard
            </Link>
          ) : (
            <Link
              href="/sign-in"
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90 transition-colors"
            >
              Get started free
            </Link>
          )}
          <Link
            href="/pricing"
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 hover:border-slate-600 hover:text-white transition-colors"
          >
            View pricing
          </Link>
        </div>
      </div>

      {/* Table of contents */}
      <nav className="mb-14 rounded-xl border border-slate-800 bg-panel p-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">On this page</p>
        <ol className="space-y-1.5 text-sm text-slate-400">
          {sections.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="hover:text-accent transition-colors">
                {s.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {/* Content */}
      <div className="space-y-16">

        {/* What is PRAKSYS */}
        <section id="what-is-praksys">
          <h2 className="mb-4 text-xl font-semibold text-white">{sections[0].title}</h2>
          <p className="text-slate-400 leading-relaxed whitespace-pre-line">{sections[0].content}</p>
        </section>

        <hr className="border-slate-800" />

        {/* How it works */}
        <section id="how-it-works">
          <h2 className="mb-6 text-xl font-semibold text-white">{sections[1].title}</h2>
          <div className="space-y-6">
            {sections[1].steps!.map((step) => (
              <div key={step.n} className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-sm font-bold text-accent">
                  {step.n}
                </div>
                <div>
                  <p className="font-medium text-white">{step.title}</p>
                  <p className="mt-1 text-sm text-slate-400 leading-relaxed">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-slate-800" />

        {/* Views */}
        <section id="views">
          <h2 className="mb-6 text-xl font-semibold text-white">{sections[2].title}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {sections[2].items!.map((item) => (
              <div key={item.name} className="rounded-xl border border-slate-800 bg-panel p-4">
                <p className="text-sm font-semibold text-white">{item.name}</p>
                <p className="mt-1.5 text-sm text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-slate-800" />

        {/* Features */}
        <section id="features">
          <h2 className="mb-6 text-xl font-semibold text-white">{sections[3].title}</h2>
          <div className="space-y-4">
            {sections[3].items!.map((item) => (
              <div key={item.name} className="flex gap-3">
                <div className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent mt-2" />
                <div>
                  <span className="text-sm font-medium text-white">{item.name}</span>
                  <span className="text-slate-400 text-sm"> — {item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-slate-800" />

        {/* Plans */}
        <section id="plans">
          <h2 className="mb-6 text-xl font-semibold text-white">{sections[4].title}</h2>
          <div className="space-y-3">
            {sections[4].items!.map((item) => (
              <div key={item.name} className="flex gap-4 rounded-xl border border-slate-800 bg-panel p-4">
                <span className="shrink-0 text-sm font-bold text-accent w-12">{item.name}</span>
                <span className="text-sm text-slate-400">{item.desc}</span>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Link href="/pricing" className="text-sm text-accent hover:underline">
              Compare plans in detail →
            </Link>
          </div>
        </section>

        <hr className="border-slate-800" />

        {/* FAQ */}
        <section id="faq">
          <h2 className="mb-6 text-xl font-semibold text-white">{sections[5].title}</h2>
          <div className="space-y-6">
            {sections[5].qa!.map((item) => (
              <div key={item.q}>
                <p className="font-medium text-white">{item.q}</p>
                <p className="mt-1.5 text-sm text-slate-400 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* Bottom CTA */}
      <div className="mt-20 rounded-2xl border border-accent/20 bg-accent/5 p-8 text-center">
        <p className="text-lg font-semibold text-white">Ready to map your codebase?</p>
        <p className="mt-2 text-sm text-slate-400">Connect a GitHub repository and get your first system map in under 2 minutes.</p>
        <div className="mt-6 flex justify-center gap-3">
          {session?.user ? (
            <Link href="/repo" className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent/90 transition-colors">
              Connect a project
            </Link>
          ) : (
            <Link href="/sign-in" className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent/90 transition-colors">
              Start for free
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
