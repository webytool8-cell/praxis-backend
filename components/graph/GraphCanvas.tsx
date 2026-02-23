"use client";

import { useMemo } from "react";
import ReactFlow, { Background, Controls, MarkerType, MiniMap } from "reactflow";
import "reactflow/dist/style.css";
import { buildLayout } from "@/lib/graph/buildLayout";
import { useAppStore } from "@/store/useAppStore";
import { NodeCard } from "@/components/graph/NodeCard";

const nodeTypes = { nodeCard: NodeCard };

export function GraphCanvas() {
  const template = useAppStore((s) => s.template);
  const selectedNode = useAppStore((s) => s.selectedNode);
  const hoveredNode = useAppStore((s) => s.hoveredNode);
  const setSelectedNode = useAppStore((s) => s.setSelectedNode);
  const setHoveredNode = useAppStore((s) => s.setHoveredNode);

  const { nodes, edges } = useMemo(() => buildLayout(template), [template]);

  const connectedIds = useMemo(() => {
    if (!hoveredNode) return new Set<string>();
    const ids = new Set<string>([hoveredNode]);
    edges.forEach((e) => {
      if (e.source === hoveredNode) ids.add(e.target);
      if (e.target === hoveredNode) ids.add(e.source);
    });
    return ids;
  }, [hoveredNode, edges]);

  const styledNodes = nodes.map((node) => {
    const isConnected = connectedIds.size === 0 || connectedIds.has(node.id);
    return { ...node, style: { opacity: isConnected ? 1 : 0.3, transition: "all .24s ease" } };
  });

  const styledEdges = edges.map((edge) => {
    const active = connectedIds.size === 0 || connectedIds.has(edge.source) || connectedIds.has(edge.target);
    return {
      ...edge,
      type: "smoothstep",
      markerEnd: { type: MarkerType.ArrowClosed, color: "rgba(110,168,255,.9)" },
      style: { opacity: active ? 1 : 0.24, stroke: "rgba(110,168,255,.7)" },
      animated: true,
    };
  });

  return (
    <section id="graph-canvas" className="glass-panel h-[720px] overflow-hidden rounded-2xl border border-[rgb(var(--line-1))] animate-fadeUp">
      <ReactFlow
        key={template}
        nodes={styledNodes}
        edges={styledEdges}
        nodeTypes={nodeTypes}
        fitView
        onNodeClick={(_, node) => setSelectedNode(node.data)}
        onNodeMouseEnter={(_, node) => setHoveredNode(node.id)}
        onNodeMouseLeave={() => setHoveredNode(null)}
      >
        <Background color="rgba(255,255,255,.08)" gap={28} size={1} />
        <MiniMap pannable zoomable />
        <Controls />
      </ReactFlow>
      {/* TODO: replace mock graph with backend analysis payload + layout engine. */}
    </section>
  );
}
