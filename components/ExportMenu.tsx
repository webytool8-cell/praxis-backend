"use client";

import { useState, useRef, useEffect } from "react";
import { usePraxisStore } from "@/store/usePraxisStore";

interface ExportOption {
  label: string;
  description: string;
  action: () => void;
  loading?: boolean;
}

export function ExportMenu() {
  const [open, setOpen] = useState(false);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const { currentAnalysisId, currentAnalysis } = usePraxisStore();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const download = async (path: string, label: string) => {
    if (!currentAnalysisId) return;
    setLoadingAction(label);
    try {
      const res = await fetch(`/api/analyses/${currentAnalysisId}${path}`);
      if (!res.ok) return;
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = res.headers.get("content-disposition")?.match(/filename="(.+)"/)?.[1] ?? "export";
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setLoadingAction(null);
    }
    setOpen(false);
  };

  const shareLink = async () => {
    if (!currentAnalysisId) return;
    setLoadingAction("share");
    try {
      const res = await fetch(`/api/analyses/${currentAnalysisId}/share`, { method: "POST" });
      const { shareUrl } = await res.json();
      await navigator.clipboard.writeText(shareUrl);
      alert(`Share link copied to clipboard:\n${shareUrl}`);
    } finally {
      setLoadingAction(null);
    }
    setOpen(false);
  };

  const options: ExportOption[] = [
    {
      label: "Shareable Link",
      description: "Copy public link to clipboard",
      action: shareLink,
    },
    {
      label: "PDF Report",
      description: "Styled multi-page PDF with AI summary",
      action: () => download("/docs", "PDF Report"),
    },
    {
      label: "Architecture Docs (.md)",
      description: "Markdown documentation for your wiki",
      action: () => download("/docs", "Docs"),
    },
    {
      label: "Presentation Slides (.pptx)",
      description: "One slide per component with AI talking points",
      action: () => download("/slides", "Slides"),
    },
    {
      label: "AI Walkthrough Video",
      description: "60–90 sec .mp4 with narration (~60s to generate)",
      action: () => download("/video", "Video"),
    },
  ];

  if (!currentAnalysisId) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-all"
      >
        Export
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-white/10 bg-[#101722] shadow-2xl z-50 overflow-hidden">
          {options.map((opt) => {
            const isLoading = loadingAction === opt.label;

            return (
              <button
                key={opt.label}
                onClick={() => opt.action()}
                disabled={isLoading}
                className="w-full text-left px-4 py-3 flex items-start gap-3 transition-colors hover:bg-white/5 cursor-pointer"
              >
                <div className="flex-1">
                  <span className="text-sm font-medium text-white">
                    {isLoading ? "Generating..." : opt.label}
                  </span>
                  <p className="text-xs text-muted mt-0.5">{opt.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
