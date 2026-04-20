"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { ControlsPanel } from "@/dashboard/ControlsPanel";
import { DetailsPanel } from "@/dashboard/DetailsPanel";
import { GraphViewport } from "@/dashboard/GraphViewport";
import { ChatPanel } from "@/components/ChatPanel";
import { usePraxisStore } from "@/store/usePraxisStore";

export function DashboardView() {
  const chatOpen = usePraxisStore((state) => state.chatOpen);

  return (
    <>
      <div className="grid gap-3 lg:grid-cols-[220px_1fr]">
        {/* Sidebar hidden on mobile — nav available via hamburger menu */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        <div className="grid gap-3 xl:grid-cols-[280px_1fr_320px]">
          <ControlsPanel />
          <GraphViewport />
          <DetailsPanel />
        </div>
      </div>

      {chatOpen && <ChatPanel />}
    </>
  );
}
