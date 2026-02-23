import { ControlPanel } from "@/components/controls/ControlPanel";
import { GraphCanvas } from "@/components/graph/GraphCanvas";
import { DetailsPanel } from "@/components/details/DetailsPanel";

export function DashboardView() {
  return (
    <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)_360px]">
      <ControlPanel />
      <GraphCanvas />
      <DetailsPanel />
    </div>
  );
}
