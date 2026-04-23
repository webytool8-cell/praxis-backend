"use client";

import { GraphViewport } from "@/dashboard/GraphViewport";
import { DashboardToolbar } from "@/dashboard/DashboardToolbar";
import { NodeDrawer } from "@/dashboard/NodeDrawer";
import { SecurityDrawer } from "@/dashboard/SecurityDrawer";
import { ChatPanel } from "@/components/ChatPanel";
import { usePraxisStore } from "@/store/usePraxisStore";

export function DashboardView() {
  const selectedNode = usePraxisStore((s) => s.selectedNode);
  const chatOpen = usePraxisStore((s) => s.chatOpen);
  const securityPanelOpen = usePraxisStore((s) => s.securityPanelOpen);

  return (
    <div className="-mx-4 -my-6 md:-mx-6 flex flex-col" style={{ height: "calc(100vh - 3.5rem)" }}>
      <DashboardToolbar />
      <div className="relative min-h-0 flex-1">
        <GraphViewport />
        {securityPanelOpen && <SecurityDrawer />}
        {selectedNode && <NodeDrawer />}
        {chatOpen && <ChatPanel />}
      </div>
    </div>
  );
}
