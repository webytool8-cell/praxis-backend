"use client";

import { useState } from "react";
import { Panel } from "@/components/ui/Panel";
import { SecurityPanel } from "@/components/SecurityPanel";
import { usePraxisStore } from "@/store/usePraxisStore";

function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-lg border border-slate-800/90 bg-slate-900/35">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-slate-200"
      >
        {title}
        <span className="text-xs text-muted">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className="animate-fadeIn border-t border-slate-800/80 px-3 py-3 text-sm text-slate-300">
          {children}
        </div>
      )}
    </div>
  );
}

export function DetailsPanel() {
  const selectedNode = usePraxisStore((state) => state.selectedNode);
  const currentAnalysis = usePraxisStore((state) => state.currentAnalysis);

  // Get security findings for the selected node
  const nodeFindings = currentAnalysis?.securityFindings?.filter((f) =>
    f.file.toLowerCase().includes(selectedNode?.name?.toLowerCase() ?? "___never___")
  ) ?? [];

  return (
    <Panel className="h-full space-y-3 p-4 overflow-y-auto">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-muted">Details</p>
        <h3 className="mt-1 text-lg font-semibold text-slate-100">Node Inspector</h3>
      </div>

      {selectedNode ? (
        <div className="space-y-2">
          <p className="text-sm font-medium text-blue-100">{selectedNode.name}</p>

          <Section title="Description">
            <p>{selectedNode.aiExplanation ?? selectedNode.description}</p>
          </Section>

          <Section title="Dependencies">
            <ul className="list-disc space-y-1 pl-5">
              {selectedNode.dependencies.length ? (
                selectedNode.dependencies.map((dep) => <li key={dep}>{dep}</li>)
              ) : (
                <li>No dependencies</li>
              )}
            </ul>
          </Section>

          <Section title="Metrics">
            <p>LOC: {selectedNode.metrics.loc}</p>
            <p>Imports: {selectedNode.metrics.imports}</p>
            <p>Complexity: {selectedNode.metrics.complexity}</p>
          </Section>

          <Section title="Risk Score">
            <div className="space-y-2">
              <div className="h-2 w-full overflow-hidden rounded bg-slate-800">
                <div
                  className="h-full rounded bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 transition-all duration-300"
                  style={{ width: `${selectedNode.riskScore}%` }}
                />
              </div>
              <p>{selectedNode.riskScore}/100</p>
            </div>
          </Section>

          {selectedNode.remediations && selectedNode.remediations.length > 0 && (
            <Section title="AI Suggestions" defaultOpen={true}>
              <ul className="space-y-2">
                {selectedNode.remediations.map((r, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-accentViolet mt-0.5 shrink-0">→</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {nodeFindings.length > 0 && (
            <Section title={`Security Findings (${nodeFindings.length})`} defaultOpen={false}>
              <SecurityPanel findings={nodeFindings} nodeId={selectedNode.id} />
            </Section>
          )}
        </div>
      ) : (
        <>
          <p className="rounded-lg border border-slate-800 bg-slate-900/50 p-3 text-sm text-muted">
            Select a node to review module description, dependencies, metrics, and risk.
          </p>

          {/* Show overall security summary when no node is selected */}
          {currentAnalysis?.securityFindings && currentAnalysis.securityFindings.length > 0 && (
            <Section title={`Security Scan (${currentAnalysis.securityFindings.length} findings)`} defaultOpen={false}>
              <SecurityPanel findings={currentAnalysis.securityFindings} />
            </Section>
          )}
        </>
      )}
    </Panel>
  );
}
