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
  );
}
