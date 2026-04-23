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
            <svg viewBox="0 0 100 100" className="w-10 h-10" xmlns="http://www.w3.org/2000/svg">
              <path fill="#4488ff" fillRule="evenodd" d="
                M 80.5,37.4
                L 91.1,41.3 L 91.1,58.7 L 80.5,62.6
                L 85.2,72.9 L 72.9,85.2 L 62.6,80.5
                L 58.7,91.1 L 41.3,91.1 L 37.4,80.5
                L 27.1,85.2 L 14.8,72.9 L 19.5,62.6
                L 8.9,58.7 L 8.9,41.3 L 19.5,37.4
                L 14.8,27.1 L 27.1,14.8 L 37.4,19.5
                L 41.3,8.9 L 58.7,8.9 L 62.6,19.5
                L 72.9,14.8 L 85.2,27.1 L 80.5,37.4 Z
                M 50,32 A 18,18 0 0,1 50,68 A 18,18 0 0,1 50,32 Z
                M 50,43 A 7,7 0 0,1 50,57 A 7,7 0 0,1 50,43 Z
              "/>
            </svg>
          </div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted">Developer System Intelligence</p>
          <h1 className="mt-2 text-2xl font-semibold text-white">Sign in to PRAKSYS</h1>
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
