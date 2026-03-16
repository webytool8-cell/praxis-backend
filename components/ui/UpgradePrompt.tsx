"use client";

import Link from "next/link";
import { Button } from "./Button";

interface UpgradePromptProps {
  message?: string;
  onDismiss?: () => void;
}

const PRO_FEATURES = [
  "Unlimited analyses",
  "AI Codebase Chat — ask anything",
  "Security vulnerability scan",
  "PDF, slides & Markdown export",
];

export function UpgradePrompt({ message, onDismiss }: UpgradePromptProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm mx-4 rounded-xl border border-white/10 bg-[#101722] p-8 shadow-2xl">
        <div className="text-center mb-6">
          <div className="text-3xl mb-3">🔒</div>
          <h2 className="text-lg font-semibold text-white">
            {message ?? "Analysis limit reached"}
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Upgrade to Pro for unlimited analyses and powerful AI features.
          </p>
        </div>

        <ul className="mb-6 space-y-2">
          {PRO_FEATURES.map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
              <span className="text-accent">✓</span>
              {f}
            </li>
          ))}
        </ul>

        <div className="space-y-3">
          <Link href="/pricing" className="block">
            <Button className="w-full">Upgrade to Pro — $19/mo</Button>
          </Link>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="w-full text-sm text-muted hover:text-white transition-colors"
            >
              Maybe later
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
