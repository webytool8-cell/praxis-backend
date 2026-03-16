"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Panel";
import { ToggleGroup } from "@/components/ui/ToggleGroup";
import { ExportMenu } from "@/components/ExportMenu";
import { usePraxisStore } from "@/store/usePraxisStore";
import { ViewTemplate } from "@/types/graph";

const templateOptions: readonly ViewTemplate[] = ["architecture", "dataFlow", "dependency", "risk"] as const;

export function ControlsPanel() {
  const { data: session } = useSession();
  const planId = (session?.user as any)?.planId ?? "free";

  const template = usePraxisStore((state) => state.template);
  const setTemplate = usePraxisStore((state) => state.setTemplate);
  const setHeatmapMode = usePraxisStore((state) => state.setHeatmapMode);
  const heatmapMode = usePraxisStore((state) => state.heatmapMode);
  const toggleCluster = usePraxisStore((state) => state.toggleCluster);
  const securityPanelOpen = usePraxisStore((state) => state.securityPanelOpen);
  const setSecurityPanelOpen = usePraxisStore((state) => state.setSecurityPanelOpen);
  const setAnalyzing = usePraxisStore((state) => state.setAnalyzing);
  const currentAnalysis = usePraxisStore((state) => state.currentAnalysis);
  const currentAnalysisId = usePraxisStore((state) => state.currentAnalysisId);

  const handleReanalyze = async () => {
    if (!currentAnalysisId) {
      // Fallback: show fake analyzing state
      setAnalyzing(true);
      setTimeout(() => setAnalyzing(false), 1200);
      return;
    }
    // Re-trigger analysis (for future: could re-fetch from source)
    setAnalyzing(true);
    try {
      const res = await fetch(`/api/analyses/${currentAnalysisId}`);
      // Just re-load the current analysis
      const data = await res.json();
      if (data.graphData) {
        usePraxisStore.getState().setCurrentAnalysis(data.graphData, currentAnalysisId);
      }
    } finally {
      setAnalyzing(false);
    }
  };

  const securityCount = currentAnalysis?.securityFindings?.length ?? 0;

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
          {securityCount > 0 && (
            <Button
              variant={securityPanelOpen ? "primary" : "secondary"}
              onClick={() => setSecurityPanelOpen(!securityPanelOpen)}
              className="col-span-2 relative"
            >
              Security
              <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
                {securityCount > 9 ? "9+" : securityCount}
              </span>
            </Button>
          )}
          <Button
            variant="secondary"
            onClick={handleReanalyze}
            className={securityCount > 0 ? "" : "col-span-2"}
          >
            Re-analyze
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wide text-muted">Export</p>
        <ExportMenu planId={planId} />
      </div>
    </Panel>
  );
}
