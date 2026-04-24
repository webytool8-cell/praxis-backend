"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { usePraxisStore } from "@/store/usePraxisStore";
import { ExportMenu } from "@/components/ExportMenu";
import type { ViewTemplate } from "@/types/graph";

const TEMPLATES: { value: ViewTemplate; label: string }[] = [
  { value: "architecture", label: "Architecture" },
  { value: "dataFlow", label: "Data Flow" },
  { value: "dependency", label: "Dependency" },
  { value: "risk", label: "Risk" },
];

interface AnalysisSummary { id: string; name: string; sourceType: string }

export function DashboardToolbar() {
  const template = usePraxisStore((s) => s.template);
  const setTemplate = usePraxisStore((s) => s.setTemplate);
  const heatmapMode = usePraxisStore((s) => s.heatmapMode);
  const setHeatmapMode = usePraxisStore((s) => s.setHeatmapMode);
  const clusterExpanded = usePraxisStore((s) => s.clusterExpanded);
  const toggleCluster = usePraxisStore((s) => s.toggleCluster);
  const currentAnalysis = usePraxisStore((s) => s.currentAnalysis);
  const currentAnalysisId = usePraxisStore((s) => s.currentAnalysisId);
  const chatOpen = usePraxisStore((s) => s.chatOpen);
  const setChatOpen = usePraxisStore((s) => s.setChatOpen);
  const securityPanelOpen = usePraxisStore((s) => s.securityPanelOpen);
  const setSecurityPanelOpen = usePraxisStore((s) => s.setSecurityPanelOpen);

  const setCurrentAnalysis = usePraxisStore((s) => s.setCurrentAnalysis);
  const router = useRouter();

  const [analyses, setAnalyses] = useState<AnalysisSummary[]>([]);
  const [dropOpen, setDropOpen] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/analyses?limit=10")
      .then((r) => r.json())
      .then((d) => { if (d.analyses) setAnalyses(d.analyses); })
      .catch(() => {});
  }, [currentAnalysisId]);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const loadAnalysis = async (id: string) => {
    setDropOpen(false);
    if (id === currentAnalysisId && currentAnalysis) return;
    setLoadingId(id);
    setCurrentAnalysis(null);
    router.push(`/dashboard?analysisId=${id}`, { scroll: false });
    try {
      const res = await fetch(`/api/analyses/${id}`);
      const data = await res.json();
      if (data.graphData) setCurrentAnalysis(data.graphData, id);
    } catch {
      // silent — GraphViewport will retry via searchParams
    } finally {
      setLoadingId(null);
    }
  };

  const currentName = analyses.find((a) => a.id === currentAnalysisId)?.name
    ?? (currentAnalysis ? "Analysis" : "No analysis loaded");

  const securityCount = currentAnalysis?.securityFindings?.length ?? 0;

  return (
    <div className="relative z-10 flex h-11 items-center justify-between gap-2 border-b border-slate-800/80 bg-bg/95 backdrop-blur-sm px-3 shrink-0">

      {/* Left: analysis picker */}
      <div className="flex items-center gap-2 min-w-0">
        <div className="relative" ref={dropRef}>
          <button
            onClick={() => setDropOpen(!dropOpen)}
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-sm text-slate-300 hover:bg-slate-800/60 hover:text-white transition-colors max-w-[200px]"
          >
            <svg className="w-3.5 h-3.5 text-muted shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <span className="truncate">{currentName}</span>
            <svg className="w-3 h-3 text-muted shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {dropOpen && (
            <div className="absolute left-0 top-full mt-1 w-64 rounded-xl border border-slate-700/80 bg-panel shadow-xl z-50 overflow-hidden animate-fadeIn">
              {analyses.length > 0 && (
                <div className="py-1">
                  {analyses.map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => loadAnalysis(a.id)}
                      disabled={loadingId === a.id}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors hover:bg-slate-800/60 disabled:opacity-50 ${
                        a.id === currentAnalysisId ? "text-accent" : "text-slate-300"
                      }`}
                    >
                      <svg className="w-3.5 h-3.5 text-muted shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7" />
                      </svg>
                      <span className="truncate text-left">{a.name}</span>
                    </button>
                  ))}
                </div>
              )}
              <div className={`${analyses.length > 0 ? "border-t border-slate-800" : ""} p-1.5`}>
                <Link
                  href="/repo"
                  onClick={() => setDropOpen(false)}
                  className="flex items-center gap-2 w-full rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-slate-800/60 hover:text-white transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  New analysis
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Center: template tabs */}
      <div className="hidden sm:flex items-center rounded-lg border border-slate-800 bg-slate-900/50 p-0.5">
        {TEMPLATES.map((t) => (
          <button
            key={t.value}
            onClick={() => setTemplate(t.value)}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all duration-150 ${
              template === t.value
                ? "bg-accent text-white shadow-glow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-0.5">
        <ToolbarBtn active={heatmapMode} onClick={() => setHeatmapMode(!heatmapMode)} title="Heatmap">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </ToolbarBtn>

        <ToolbarBtn active={clusterExpanded} onClick={toggleCluster} title="Cluster view">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        </ToolbarBtn>

        {securityCount > 0 && (
          <div className="relative">
            <ToolbarBtn
              active={securityPanelOpen}
              onClick={() => setSecurityPanelOpen(!securityPanelOpen)}
              title="Security findings"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </ToolbarBtn>
            <span className="pointer-events-none absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
              {securityCount > 9 ? "9+" : securityCount}
            </span>
          </div>
        )}

        <div className="mx-1 h-4 w-px bg-slate-800" />

        <ExportMenu />

        {currentAnalysisId && (
          <ToolbarBtn
            active={chatOpen}
            onClick={() => setChatOpen(!chatOpen)}
            title="AI Chat"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </ToolbarBtn>
        )}
      </div>
    </div>
  );
}

function ToolbarBtn({
  children, active, onClick, title,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick: () => void;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`flex h-7 w-7 items-center justify-center rounded-md transition-all duration-150 ${
        active
          ? "bg-accent/15 text-accent"
          : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
      }`}
    >
      {children}
    </button>
  );
}
