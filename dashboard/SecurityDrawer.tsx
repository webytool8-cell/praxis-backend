"use client";

import { usePraxisStore } from "@/store/usePraxisStore";
import { SecurityPanel } from "@/components/SecurityPanel";

export function SecurityDrawer() {
  const currentAnalysis = usePraxisStore((s) => s.currentAnalysis);
  const setSecurityPanelOpen = usePraxisStore((s) => s.setSecurityPanelOpen);
  const findings = currentAnalysis?.securityFindings ?? [];

  return (
    <div className="absolute right-0 top-0 z-30 flex h-full w-[360px] flex-col border-l border-slate-800 bg-panel/95 shadow-2xl backdrop-blur-md animate-fadeIn">
      <div className="flex shrink-0 items-center justify-between border-b border-slate-800 px-4 py-3">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-muted">Security Scan</p>
          <p className="mt-0.5 text-sm font-medium text-white">
            {findings.length} finding{findings.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => setSecurityPanelOpen(false)}
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted transition-colors hover:bg-slate-800 hover:text-white"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <SecurityPanel findings={findings} />
      </div>
    </div>
  );
}
