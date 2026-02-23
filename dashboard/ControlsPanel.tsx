<<<<<<< HEAD
"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Panel";
import { ToggleGroup } from "@/components/ui/ToggleGroup";
import { usePraxisStore } from "@/store/usePraxisStore";
import { ViewTemplate } from "@/types/graph";
import { exportDashboardPdf } from "@/utils/pdfExport";

const templateOptions: readonly ViewTemplate[] = ["architecture", "dataFlow", "dependency", "risk"] as const;

export function ControlsPanel() {
  const template = usePraxisStore((state) => state.template);
  const setTemplate = usePraxisStore((state) => state.setTemplate);
  const setHeatmapMode = usePraxisStore((state) => state.setHeatmapMode);
  const heatmapMode = usePraxisStore((state) => state.heatmapMode);
  const toggleCluster = usePraxisStore((state) => state.toggleCluster);
  const setAnalyzing = usePraxisStore((state) => state.setAnalyzing);
  const selectedNode = usePraxisStore((state) => state.selectedNode);

  const summary = useMemo(
    () =>
      "Architecture posture is stable. Payments path is currently highest risk and should be inspected for complexity hotspots.",
    [],
  );

  return (
    <Panel className="space-y-4 p-4">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-muted">Controls</p>
        <h2 className="mt-1 text-lg font-semibold text-slate-100">Analysis Workspace</h2>
      </div>

      <div className="space-y-2">
        <Link href="/upload" className="block">
          <Button className="w-full">Upload Project</Button>
        </Link>
        <Link href="/repo" className="block">
          <Button variant="secondary" className="w-full">
            Connect GitHub
          </Button>
        </Link>
      </div>

      <ToggleGroup label="Visualization Template" value={template} options={templateOptions} onChange={setTemplate} />

      <div className="space-y-2">
        <p className="text-xs uppercase tracking-wide text-muted">View Modes</p>
        <div className="grid grid-cols-2 gap-2">
          <Button variant={heatmapMode ? "primary" : "secondary"} onClick={() => setHeatmapMode(!heatmapMode)}>
            Heatmap
          </Button>
          <Button variant="secondary" onClick={toggleCluster}>
            Cluster
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setAnalyzing(true);
              setTimeout(() => setAnalyzing(false), 1200);
            }}
            className="col-span-2"
          >
            Re-analyze Repo
          </Button>
        </div>
      </div>

      <Button
        variant="secondary"
        className="w-full"
        onClick={() =>
          exportDashboardPdf({
            template,
            summary,
            selectedNode,
            graphElementId: "graph-canvas-export",
          })
        }
      >
        Export as PDF
      </Button>

      {/* TODO: Replace this local control-state with backend-driven job/template API responses. */}
    </Panel>
=======
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function ControlsPanel() {
  return (
    <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-4">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Controls</h3>
      <div className="space-y-2">
        <Link href="/upload" className="block">
          <Button className="w-full">Upload Project Files</Button>
        </Link>
        <Link href="/repo" className="block">
          <Button variant="secondary" className="w-full">
            Connect GitHub Repository
          </Button>
        </Link>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-700">View Templates</p>
        {/* TODO: Replace static templates with backend-driven template options. */}
        <Button variant="secondary" className="w-full">
          Architecture Overview
        </Button>
        <Button variant="secondary" className="w-full">
          Service Dependencies
        </Button>
      </div>
    </section>
>>>>>>> main
  );
}
