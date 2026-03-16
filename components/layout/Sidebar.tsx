"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Panel } from "@/components/ui/Panel";
import { usePraxisStore } from "@/store/usePraxisStore";

const dashboardLinks = [
  { href: "/dashboard", label: "System Map" },
  { href: "/upload", label: "Upload Files" },
  { href: "/repo", label: "Connect Repo" },
];

interface AnalysisSummary {
  id: string;
  name: string;
  sourceType: string;
  createdAt: string;
}

export function Sidebar() {
  const [analyses, setAnalyses] = useState<AnalysisSummary[]>([]);
  const currentAnalysisId = usePraxisStore((state) => state.currentAnalysisId);
  const searchParams = useSearchParams();
  const activeAnalysisId = searchParams.get("analysisId") ?? currentAnalysisId;

  useEffect(() => {
    fetch("/api/analyses?limit=8")
      .then((r) => r.json())
      .then((data) => {
        if (data.analyses) setAnalyses(data.analyses);
      })
      .catch(() => {});
  }, [currentAnalysisId]); // Refresh when a new analysis is loaded

  return (
    <Panel className="h-full p-3 flex flex-col gap-4">
      <div>
        <p className="px-2 pb-3 pt-1 text-xs uppercase tracking-[0.2em] text-muted">Workspace</p>
        <ul className="space-y-1">
          {dashboardLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block rounded-lg px-3 py-2 text-sm text-slate-300 transition duration-300 hover:bg-slate-800/70 hover:text-white"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {analyses.length > 0 && (
        <div>
          <p className="px-2 pb-2 text-xs uppercase tracking-[0.2em] text-muted">Recent</p>
          <ul className="space-y-1">
            {analyses.map((analysis) => (
              <li key={analysis.id}>
                <Link
                  href={`/dashboard?analysisId=${analysis.id}`}
                  className={`block rounded-lg px-3 py-2 text-xs transition duration-300 hover:bg-slate-800/70 hover:text-white truncate ${
                    activeAnalysisId === analysis.id
                      ? "bg-accent/10 text-accent"
                      : "text-slate-400"
                  }`}
                  title={analysis.name}
                >
                  <span className="block truncate">{analysis.name}</span>
                  <span className="text-muted capitalize">{analysis.sourceType}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Panel>
  );
}
