"use client";

<<<<<<< HEAD
import { useState } from "react";
import { Panel } from "@/components/ui/Panel";
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
      {open && <div className="animate-fadeIn border-t border-slate-800/80 px-3 py-3 text-sm text-slate-300">{children}</div>}
    </div>
  );
}

=======
import { usePraxisStore } from "@/store/usePraxisStore";

>>>>>>> codex/generate-next.js-project-structure-for-praxis
export function DetailsPanel() {
  const selectedNode = usePraxisStore((state) => state.selectedNode);

  return (
<<<<<<< HEAD
    <Panel className="h-full space-y-3 p-4">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-muted">Details</p>
        <h3 className="mt-1 text-lg font-semibold text-slate-100">Node Inspector</h3>
      </div>

      {selectedNode ? (
        <div className="space-y-2">
          <p className="text-sm font-medium text-blue-100">{selectedNode.name}</p>

          <Section title="Description">
            <p>{selectedNode.description}</p>
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
        </div>
      ) : (
        <p className="rounded-lg border border-slate-800 bg-slate-900/50 p-3 text-sm text-muted">
          Select a node to review module description, dependencies, metrics, and risk.
        </p>
      )}

      {/* TODO: Expand this panel with backend AI-generated remediation actions and architecture notes. */}
    </Panel>
=======
    <section className="h-full rounded-lg border border-slate-200 bg-white p-4">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
        Node Details
      </h3>
      {selectedNode ? (
        <dl className="space-y-2 text-sm text-slate-700">
          <div>
            <dt className="font-semibold">Name</dt>
            <dd>{selectedNode.name}</dd>
          </div>
          <div>
            <dt className="font-semibold">Type</dt>
            <dd>{selectedNode.type}</dd>
          </div>
          <div>
            <dt className="font-semibold">Summary</dt>
            <dd>{selectedNode.summary}</dd>
          </div>
        </dl>
      ) : (
        <p className="text-sm text-slate-500">
          Select a node in the graph to inspect module metadata.
        </p>
      )}
      {/* TODO: Inject deeper module insights from the PRAXIS analysis endpoint. */}
    </section>
>>>>>>> codex/generate-next.js-project-structure-for-praxis
  );
}
