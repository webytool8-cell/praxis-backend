"use client";

import { signIn } from "next-auth/react";
import { Panel } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";

export default function SignInPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <Panel className="w-full max-w-sm p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <svg viewBox="0 0 40 40" className="w-10 h-10" xmlns="http://www.w3.org/2000/svg">
              <polygon points="17.9,17.9 22.1,22.1 8.8,35.4 4.6,31.2" fill="#1d1aff" />
              <polygon points="19.1,16.7 23.3,20.9 36.6,7.6 32.4,3.4" fill="#1d1aff" />
              <polygon points="4.6,8.8 8.8,4.6 35.4,31.2 31.2,35.4" fill="#1d1aff" />
            </svg>
          </div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted">Developer System Intelligence</p>
          <h1 className="mt-2 text-2xl font-semibold text-white">Sign in to PRAXIS</h1>
          <p className="mt-2 text-sm text-slate-400">Free to start. No credit card required.</p>
        </div>

        <Button
          onClick={() => signIn("github", { callbackUrl: "/repo" })}
          className="w-full flex items-center justify-center gap-2 py-3"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
          </svg>
          Continue with GitHub
        </Button>

        <div className="mt-6 space-y-2 text-center text-xs text-muted">
          <p>By signing in you agree to our terms of service.</p>
          <p>Your repos are accessed read-only. We never push code.</p>
        </div>
      </Panel>
    </div>
  );
}
