import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { NodeKind } from "@/types/graph";

const kindConfig: Record<NodeKind, { border: string; dot: string; badge: string; label: string }> = {
  api: {
    border: "border-cyan-500/30",
    dot: "bg-cyan-400",
    badge: "bg-cyan-500/15 text-cyan-300",
    label: "API",
  },
  db: {
    border: "border-violet-500/30",
    dot: "bg-violet-400",
    badge: "bg-violet-500/15 text-violet-300",
    label: "Database",
  },
  frontend: {
    border: "border-emerald-500/30",
    dot: "bg-emerald-400",
    badge: "bg-emerald-500/15 text-emerald-300",
    label: "Frontend",
  },
  service: {
    border: "border-indigo-500/30",
    dot: "bg-indigo-400",
    badge: "bg-indigo-500/15 text-indigo-300",
    label: "Service",
  },
};

function NodeCardComponent({
  data,
  selected,
}: NodeProps<{ label: string; kind: NodeKind; subtitle?: string; glow?: boolean }>) {
  const cfg = kindConfig[data.kind] ?? kindConfig.service;
  return (
    <div
      className={`min-w-[210px] rounded-xl border bg-[#0d1117] ${cfg.border} px-4 py-3.5 shadow-lg transition-all duration-200 ${
        selected || data.glow
          ? "ring-1 ring-accent/50 border-accent/40 shadow-accent/10"
          : "hover:border-white/20"
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
