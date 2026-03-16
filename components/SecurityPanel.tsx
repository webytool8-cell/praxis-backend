"use client";

import { useState } from "react";
import type { SecurityFinding } from "@/types/graph";

interface SecurityPanelProps {
  findings: SecurityFinding[];
  nodeId?: string; // If set, filter to findings related to this node's files
}

const SEVERITY_COLORS: Record<string, string> = {
  critical: "text-red-400 bg-red-500/10 border-red-500/30",
  high: "text-orange-400 bg-orange-500/10 border-orange-500/30",
  medium: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
  low: "text-blue-400 bg-blue-500/10 border-blue-500/30",
};

const SEVERITY_ORDER = ["critical", "high", "medium", "low"];

export function SecurityPanel({ findings, nodeId }: SecurityPanelProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const sorted = [...findings].sort(
    (a, b) => SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity)
  );

  if (sorted.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-sm text-muted">No security findings detected.</p>
        <p className="text-xs text-muted mt-1">This does not guarantee the absence of vulnerabilities.</p>
      </div>
    );
  }

  const counts = SEVERITY_ORDER.reduce(
    (acc, s) => ({ ...acc, [s]: findings.filter((f) => f.severity === s).length }),
    {} as Record<string, number>
  );

  return (
    <div className="space-y-3">
      {/* Summary badges */}
      <div className="flex flex-wrap gap-2 px-1">
        {SEVERITY_ORDER.map((s) =>
          counts[s] > 0 ? (
            <span key={s} className={`text-xs px-2 py-0.5 rounded-full border ${SEVERITY_COLORS[s]}`}>
              {counts[s]} {s}
            </span>
          ) : null
        )}
      </div>

      {/* Findings list */}
      {sorted.map((finding, idx) => {
        const key = `${finding.file}:${finding.line}:${finding.type}:${idx}`;
        const isExpanded = expanded === key;

        return (
          <div
            key={key}
            className={`rounded-lg border p-3 cursor-pointer transition-all ${SEVERITY_COLORS[finding.severity]}`}
            onClick={() => setExpanded(isExpanded ? null : key)}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold uppercase">{finding.severity}</span>
                  <span className="text-xs font-mono opacity-70">
                    {finding.file.split("/").pop()}
                    {finding.line ? `:${finding.line}` : ""}
                  </span>
                </div>
                <p className="text-xs mt-1 opacity-90">{finding.description}</p>
              </div>
              <span className="text-xs shrink-0">{isExpanded ? "▲" : "▼"}</span>
            </div>
            {isExpanded && (
              <div className="mt-3 pt-3 border-t border-current/20">
                <p className="text-xs font-semibold mb-1">Recommendation</p>
                <p className="text-xs opacity-90">{finding.recommendation}</p>
                <p className="text-xs opacity-60 mt-2 font-mono">{finding.file}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
