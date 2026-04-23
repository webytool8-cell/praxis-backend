"use client";

import { usePraxisStore } from "@/store/usePraxisStore";
import { SecurityPanel } from "@/components/SecurityPanel";

export function NodeDrawer() {
  const selectedNode = usePraxisStore((s) => s.selectedNode);
  const setSelectedNode = usePraxisStore((s) => s.setSelectedNode);
  const currentAnalysis = usePraxisStore((s) => s.currentAnalysis);

  if (!selectedNode) return null;

  const nodeFindings =
    currentAnalysis?.securityFindings?.filter((f) =>
      f.file.toLowerCase().includes(selectedNode.name?.toLowerCase() ?? "___never___")
    ) ?? [];

  return (
    <div className="absolute right-0 top-0 z-40 flex h-full w-[340px] flex-col border-l border-slate-800 bg-panel/95 shadow-2xl backdrop-blur-md animate-fadeIn">
      <div className="flex shrink-0 items-center justify-between border-b border-slate-800 px-4 py-3">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-widest text-muted">Node Inspector</p>
          <p className="mt-0.5 truncate text-sm font-medium text-white">{selectedNode.name}</p>
        </div>
        <button
          onClick={() => setSelectedNode(null)}
          className="ml-3 flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted transition-colors hover:bg-slate-800 hover:text-white"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto p-4">

        {(selectedNode.aiExplanation || selectedNode.description) && (
          <Section label="Description">
            <p className="text-sm leading-relaxed text-slate-300">
              {selectedNode.aiExplanation ?? selectedNode.description}
            </p>
          </Section>
        )}

        <Section label="Metrics">
          <div className="grid grid-cols-3 gap-2">
            <Metric label="LOC" value={selectedNode.metrics.loc} />
            <Metric label="Imports" value={selectedNode.metrics.imports} />
            <Metric label="Complexity" value={selectedNode.metrics.complexity} />
          </div>
        </Section>

        <Section label="Risk Score">
          <div className="flex items-center gap-3">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 transition-all duration-500"
                style={{ width: `${selectedNode.riskScore}%` }}
              />
            </div>
            <span className={`text-xs font-semibold tabular-nums ${
              selectedNode.riskScore > 70 ? "text-red-400" :
              selectedNode.riskScore > 40 ? "text-amber-400" : "text-emerald-400"
            }`}>
              {selectedNode.riskScore}/100
            </span>
          </div>
        </Section>

        {selectedNode.dependencies.length > 0 && (
          <Section label={`Dependencies (${selectedNode.dependencies.length})`}>
            <div className="space-y-1">
              {selectedNode.dependencies.map((dep) => (
                <div key={dep} className="flex items-center gap-2 rounded-md bg-slate-900/60 px-3 py-1.5 text-xs text-slate-300">
                  <span className="h-1 w-1 shrink-0 rounded-full bg-accent/60" />
                  {dep}
                </div>
              ))}
            </div>
          </Section>
        )}

        {selectedNode.remediations && selectedNode.remediations.length > 0 && (
          <Section label="AI Suggestions">
            <div className="space-y-2">
              {selectedNode.remediations.map((r, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="mt-0.5 shrink-0 text-xs text-accentViolet">→</span>
                  <span className="leading-relaxed">{r}</span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {nodeFindings.length > 0 && (
          <Section label={`Security (${nodeFindings.length})`}>
            <SecurityPanel findings={nodeFindings} nodeId={selectedNode.id} />
          </Section>
        )}
      </div>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-[10px] uppercase tracking-widest text-muted">{label}</p>
      {children}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-slate-800/80 bg-slate-900/60 p-2.5 text-center">
      <p className="text-base font-semibold text-white">{value}</p>
      <p className="mt-0.5 text-[10px] text-muted">{label}</p>
    </div>
  );
}
