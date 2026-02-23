import { memo } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import { GraphNodeData } from "@/types/graph";

const tint: Record<GraphNodeData["type"], string> = {
  frontend: "from-sky-400/25 to-blue-500/10",
  api: "from-blue-400/25 to-indigo-500/10",
  service: "from-violet-400/25 to-purple-500/10",
  db: "from-emerald-400/25 to-cyan-500/10",
  infra: "from-amber-400/25 to-orange-500/10",
  external: "from-fuchsia-400/25 to-violet-500/10",
  file: "from-slate-400/20 to-slate-500/10",
};

function NodeCardInner({ data, selected }: NodeProps<GraphNodeData>) {
  return (
    <div
      className={`min-w-[190px] rounded-2xl border border-[rgb(var(--line-1))] bg-gradient-to-br ${tint[data.type]} px-3 py-2 shadow-soft transition duration-200 ${
        selected ? "shadow-glow" : ""
      }`}
    >
      <Handle type="target" position={Position.Left} className="!h-2 !w-2 !border-0 !bg-text2" />
      <p className="text-[11px] uppercase tracking-wider text-text2">{data.type}</p>
      <h4 className="mt-1 text-sm font-medium text-text0">{data.label}</h4>
      <div className="mt-2 flex gap-2 text-[11px] text-text1">
        <span className="rounded-md bg-white/5 px-1.5 py-0.5">LOC {data.metrics.loc}</span>
        <span className="rounded-md bg-white/5 px-1.5 py-0.5">IMP {data.metrics.imports}</span>
      </div>
      <Handle type="source" position={Position.Right} className="!h-2 !w-2 !border-0 !bg-text2" />
    </div>
  );
}

export const NodeCard = memo(NodeCardInner);
