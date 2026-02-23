"use client";

import { usePraxisStore } from "@/store/usePraxisStore";

export function DetailsPanel() {
  const selectedNode = usePraxisStore((state) => state.selectedNode);

  return (
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
  );
}
