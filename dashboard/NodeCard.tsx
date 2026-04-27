import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { NodeKind } from "@/types/graph";

// Color-coded by architectural hierarchy level:
// UI Layer (0) → emerald | API Layer (1) → cyan | Service Layer (2) → violet | Data Layer (3) → amber
const kindConfig: Record<NodeKind, { label: string; borderLeft: string; dot: string; badge: string }> = {
  frontend: {
    label: "UI Layer",
    borderLeft: "border-l-[3px] border-l-emerald-500",
    dot: "bg-emerald-400",
    badge: "bg-emerald-500/15 text-emerald-300",
  },
  api: {
    label: "API Layer",
    borderLeft: "border-l-[3px] border-l-cyan-500",
    dot: "bg-cyan-400",
    badge: "bg-cyan-500/15 text-cyan-300",
  },
  service: {
    label: "Service Layer",
    borderLeft: "border-l-[3px] border-l-violet-500",
    dot: "bg-violet-400",
    badge: "bg-violet-500/15 text-violet-300",
  },
  db: {
    label: "Data Layer",
    borderLeft: "border-l-[3px] border-l-amber-500",
    dot: "bg-amber-400",
    badge: "bg-amber-500/15 text-amber-300",
  },
};

function NodeCardComponent({
  data,
  selected,
}: NodeProps<{ label: string; kind: NodeKind; subtitle?: string; glow?: boolean }>) {
  const cfg = kindConfig[data.kind] ?? kindConfig.service;
  return (
    <div
      className={`min-w-[210px] rounded-xl border border-slate-700/40 ${cfg.borderLeft} bg-[#0d1117] px-4 py-3.5 shadow-lg transition-all duration-200 ${
        selected || data.glow
          ? "ring-1 ring-accent/50 shadow-accent/10 border-slate-600/60"
          : "hover:border-slate-600/60"
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!h-3 !w-3 !rounded-full !border-2 !border-slate-700 !bg-slate-600"
      />

      <div className="flex items-center gap-2 mb-2">
        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${cfg.dot} animate-pulseSlow`} />
        <span className={`text-[10px] font-medium uppercase tracking-widest px-1.5 py-0.5 rounded ${cfg.badge}`}>
          {cfg.label}
        </span>
      </div>

      <p className="text-sm font-semibold text-white leading-snug">{data.label}</p>

      {data.subtitle && (
        <p className="text-[11px] text-slate-400 mt-0.5 leading-snug line-clamp-2">{data.subtitle}</p>
      )}

      <Handle
        type="source"
        position={Position.Right}
        className="!h-3 !w-3 !rounded-full !border-2 !border-slate-700 !bg-slate-600"
      />
    </div>
  );
}

export const NodeCard = memo(NodeCardComponent);
