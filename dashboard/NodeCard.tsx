import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { NodeKind } from "@/types/graph";

const tokenStyle: Record<NodeKind, string> = {
  api: "from-cyan-500/25 to-blue-500/10",
  db: "from-violet-500/25 to-fuchsia-500/10",
  frontend: "from-emerald-500/25 to-cyan-500/10",
  service: "from-blue-500/25 to-indigo-500/10",
};

const tokenDot: Record<NodeKind, string> = {
  api: "bg-cyan-400",
  db: "bg-violet-400",
  frontend: "bg-emerald-400",
  service: "bg-blue-400",
};

function NodeCardComponent({ data, selected }: NodeProps<{ label: string; kind: NodeKind; glow?: boolean }>) {
  return (
    <div
      className={`min-w-[170px] rounded-xl border border-slate-700/80 bg-gradient-to-b ${tokenStyle[data.kind]} p-3 shadow-soft transition-all duration-300 ${
        selected || data.glow ? "shadow-glow border-accent/70" : ""
      }`}
    >
      <Handle type="target" position={Position.Left} className="!h-2 !w-2 !border-none !bg-slate-400" />
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${tokenDot[data.kind]} animate-pulseSlow`} />
        <p className="text-xs uppercase tracking-wide text-slate-300">{data.kind}</p>
      </div>
      <p className="mt-1 text-sm font-medium text-slate-100">{data.label}</p>
      <svg className="mt-2 h-4 w-full opacity-40" viewBox="0 0 200 20" fill="none" aria-hidden>
        <path d="M0 10 H200" stroke="url(#line-grad)" strokeWidth="1" />
        <defs>
          <linearGradient id="line-grad" x1="0" y1="0" x2="200" y2="0">
            <stop stopColor="#5B8CFF" stopOpacity="0" />
            <stop offset="0.5" stopColor="#5B8CFF" stopOpacity="0.7" />
            <stop offset="1" stopColor="#8B5CF6" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      <Handle type="source" position={Position.Right} className="!h-2 !w-2 !border-none !bg-slate-400" />
    </div>
  );
}

export const NodeCard = memo(NodeCardComponent);
