"use client";

import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/store/useAppStore";
import { exportDashboardPdf } from "@/utils/pdfExport";

export function ExportButton() {
  const selectedNode = useAppStore((s) => s.selectedNode);
  const template = useAppStore((s) => s.template);

  return (
    <Button
      className="w-full"
      onClick={() =>
        exportDashboardPdf({
          template,
          selectedNode,
          summary:
            "PRAXIS generated architecture summary: monitor service centrality and high fan-out modules.",
          graphElementId: "graph-canvas",
        })
      }
    >
      Export PDF
    </Button>
  );
}
