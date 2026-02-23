"use client";

import { useMemo } from "react";
import ReactFlow, { Background, Controls, Edge, Node } from "reactflow";
import "reactflow/dist/style.css";
import { usePraxisStore } from "@/store/usePraxisStore";

const nodes: Node[] = [
  { id: "api", position: { x: 0, y: 80 }, data: { label: "API Module" } },
  { id: "services", position: { x: 220, y: 20 }, data: { label: "Services" } },
  { id: "data", position: { x: 220, y: 160 }, data: { label: "Data Layer" } },
];

const edges: Edge[] = [
  { id: "e1-2", source: "api", target: "services" },
  { id: "e1-3", source: "api", target: "data" },
];

export function GraphViewport() {
  const setSelectedNode = usePraxisStore((state) => state.setSelectedNode);

  const nodeDetails = useMemo(
    () => ({
      api: {
        id: "api",
        name: "API Module",
        type: "module",
        summary: "Entry points and request handlers.",
      },
      services: {
        id: "services",
        name: "Services",
        type: "layer",
        summary: "Business logic services and orchestrations.",
      },
      data: {
        id: "data",
        name: "Data Layer",
        type: "layer",
        summary: "Database and persistence adapters.",
      },
    }),
    [],
  );

  return (
    <section className="h-[560px] rounded-lg border border-slate-200 bg-white">
      {/* TODO: Replace hardcoded nodes/edges with graph payload from PRAXIS AI analysis API. */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        onNodeClick={(_, node) => {
          const detail = nodeDetails[node.id as keyof typeof nodeDetails] ?? null;
          setSelectedNode(detail);
        }}
      >
        <Background gap={20} size={1} />
        <Controls />
      </ReactFlow>
    </section>
  );
}
