import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Panel";

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Get started with no credit card required.",
    cta: "Get Started Free",
    ctaHref: "/sign-in",
    highlight: false,
    features: [
      "1 analysis per month",
      "Interactive architecture map",
      "4 visualization templates",
      "Risk scoring",
      "Shareable public link",
    ],
    missing: ["AI Codebase Chat", "Security scan", "PDF & slide export", "GitHub PR bot"],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$19",
    period: "per month",
    description: "Everything you need to deeply understand any codebase.",
    cta: "Start Pro",
    ctaHref: "/api/stripe/checkout?plan=pro",
    highlight: true,
    features: [
      "Unlimited analyses",
      "AI Codebase Chat — ask anything",
      "Security vulnerability scan",
      "Enhanced PDF report export",
      "Presentation slides (.pptx) export",
      "Architecture docs (Markdown)",
      "Shareable public link",
      "GitHub repo analysis",
      "Priority support",
    ],
    missing: [],
  },
  {
    id: "team",
    name: "Team",
    price: "$49",
    period: "per month",
    description: "Built for engineering teams that ship together.",
    cta: "Start Team",
    ctaHref: "/api/stripe/checkout?plan=team",
    highlight: false,
    features: [
      "Everything in Pro",
      "GitHub PR Review Bot",
      "AI Walkthrough Video generation",
      "Node comments on shared links",
      "Notion & Confluence export",
      "Team workspace (coming soon)",
      "Slack alerts (coming soon)",
      "Priority support",
    ],
    missing: [],
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="text-center mb-12">
        <p className="text-xs uppercase tracking-[0.25em] text-muted">Simple Pricing</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">
          Understand any codebase
        </h1>
        <p className="mt-4 text-slate-300 max-w-xl mx-auto">
          Start free. No credit card required. Upgrade when you need more power.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {PLANS.map((plan) => (
          <Panel
            key={plan.id}
            className={`p-8 flex flex-col ${
              plan.highlight
                ? "ring-2 ring-accent shadow-[0_0_40px_rgba(91,140,255,0.15)]"
                : ""
            }`}
          >
            {plan.highlight && (
              <div className="mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-accent bg-accent/10 px-3 py-1 rounded-full">
                  Most Popular
                </span>
              </div>
            )}

            <h2 className="text-xl font-semibold text-white">{plan.name}</h2>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-4xl font-bold text-white">{plan.price}</span>
              <span className="text-muted text-sm">/{plan.period}</span>
            </div>
            <p className="mt-3 text-sm text-slate-400">{plan.description}</p>

            <div className="mt-6">
              <Link href={plan.ctaHref}>
                <Button
                  variant={plan.highlight ? "primary" : "secondary"}
                  className="w-full"
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>

            <ul className="mt-8 space-y-3 flex-1">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="text-accent mt-0.5 shrink-0">✓</span>
                  {feature}
                </li>
              ))}
              {plan.missing.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-muted line-through">
                  <span className="mt-0.5 shrink-0">✗</span>
                  {feature}
                </li>
              ))}
            </ul>
          </Panel>
        ))}
      </div>

      <div className="mt-16 max-w-2xl mx-auto">
        <h3 className="text-lg font-semibold text-white mb-6 text-center">Frequently Asked Questions</h3>
        <div className="space-y-6">
          {[
            {
              q: "What counts as an analysis?",
              a: "Each time you upload a project or connect a GitHub repository and generate a new architecture map, that counts as one analysis.",
            },
            {
              q: "Can I cancel anytime?",
              a: "Yes. You can cancel your subscription anytime from the Account page. You retain access until the end of your billing period.",
            },
            {
              q: "What languages are supported?",
              a: "TypeScript, JavaScript, Python, Go, Java, Rust, Ruby, PHP, C#, Swift, Kotlin, Scala, C, and C++.",
            },
            {
              q: "How does the GitHub PR bot work?",
              a: "On the Team plan, PRAXIS installs as a GitHub App and automatically comments on pull requests with an architecture impact analysis — showing which components are affected and by how much.",
            },
          ].map(({ q, a }) => (
            <div key={q}>
              <p className="font-medium text-white">{q}</p>
              <p className="mt-1 text-sm text-slate-400">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
