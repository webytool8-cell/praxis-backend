import { Sidebar } from "@/components/layout/Sidebar";
import { ControlsPanel } from "@/dashboard/ControlsPanel";
import { DetailsPanel } from "@/dashboard/DetailsPanel";
import { GraphViewport } from "@/dashboard/GraphViewport";

export function DashboardView() {
  return (
    <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
      <Sidebar />
<<<<<<< HEAD
      <section className="grid gap-4 xl:grid-cols-[280px_1fr_320px]">
=======
<<<<<<< HEAD
      <section className="grid gap-4 xl:grid-cols-[280px_1fr_320px]">
=======
<<<<<<< HEAD
      <section className="grid gap-4 xl:grid-cols-[280px_1fr_320px]">
=======
      <section className="grid gap-4 xl:grid-cols-[280px_1fr_300px]">
>>>>>>> main
>>>>>>> main
>>>>>>> main
        <ControlsPanel />
        <GraphViewport />
        <DetailsPanel />
      </section>
    </div>
  );
}
