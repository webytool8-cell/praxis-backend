"use client";

import { Panel } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/store/useAppStore";
import { MetricsBar } from "@/components/details/MetricsBar";
import { DependencyList } from "@/components/details/DependencyList";

export function DetailsPanel() {
  const node = useAppStore((s) => s.selectedNode);

  return (
    <Panel className="h-full space-y-4 p-4">
      <div>
        <p className="text-xs uppercase tracking-wider text-text2">Details</p>
        <h3 className="text-lg font-semibold">{node?.label ?? "Select a node"}</h3>
        <p className="text-xs text-text2">{node?.type ?? "No selection"}</p>
      </div>

      {node ? (
        <>
          <div className="space-y-2 text-sm text-text1">
            <p>Path: {node.path}</p>
            <p>LOC: {node.metrics.loc}</p>
            <p>Imports: {node.metrics.imports}</p>
            <p>Fan-in / Fan-out: {node.metrics.fanIn} / {node.metrics.fanOut}</p>
          </div>

          <MetricsBar value={node.metrics.risk} />

          <div>
            <p className="mb-2 text-xs uppercase tracking-wider text-text2">Dependencies</p>
            <DependencyList items={["src/shared/http.ts", "src/lib/cache.ts", "src/types/index.ts"]} />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button variant="secondary">Focus in graph</Button>
            <Button variant="ghost">Copy path</Button>
          </div>
        </>
      ) : (
        <p className="text-sm text-text2">Click a node to inspect overview, dependencies, and metrics.</p>
      )}
    </Panel>
  );
}
