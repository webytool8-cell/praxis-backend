"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Panel";
import { useAppStore } from "@/store/useAppStore";
import { TemplateSelect } from "@/components/controls/TemplateSelect";
import { LayerToggles } from "@/components/controls/LayerToggles";
import { Filters } from "@/components/controls/Filters";
import { ExportButton } from "@/components/controls/ExportButton";

export function ControlPanel() {
  const template = useAppStore((s) => s.template);
  const setTemplate = useAppStore((s) => s.setTemplate);

  return (
    <Panel className="h-full space-y-5 p-4">
      <div>
        <p className="text-xs uppercase tracking-wider text-text2">Source</p>
        <div className="mt-2 grid gap-2">
          <Link href="/repo"><Button className="w-full">Connect GitHub</Button></Link>
          <Link href="/upload"><Button variant="secondary" className="w-full">Upload ZIP</Button></Link>
        </div>
      </div>
      <TemplateSelect value={template} onChange={setTemplate} />
      <LayerToggles />
      <Filters />
      <ExportButton />
    </Panel>
  );
}
