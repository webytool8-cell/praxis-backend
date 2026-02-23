"use client";

<<<<<<< HEAD
import { useEffect, useMemo, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  Edge,
  MarkerType,
  MiniMap,
  Node,
  NodeMouseHandler,
} from "reactflow";
import "reactflow/dist/style.css";
import { Panel } from "@/components/ui/Panel";
import { NodeCard } from "@/dashboard/NodeCard";
import { templates } from "@/dashboard/graphTemplates";
import { usePraxisStore } from "@/store/usePraxisStore";

const nodeTypes = { nodeCard: NodeCard };

function nodeColor(complexity: number, heatmapMode: boolean) {
  if (!heatmapMode) return "#5B8CFF";
  if (complexity > 30) return "#f97316";
  if (complexity > 22) return "#eab308";
  return "#10b981";
}

export function GraphViewport() {
  const template = usePraxisStore((state) => state.template);
  const heatmapMode = usePraxisStore((state) => state.heatmapMode);
  const clusterExpanded = usePraxisStore((state) => state.clusterExpanded);
  const isAnalyzing = usePraxisStore((state) => state.isAnalyzing);
  const hoveredNodeId = usePraxisStore((state) => state.hoveredNodeId);
  const setHoveredNodeId = usePraxisStore((state) => state.setHoveredNodeId);
  const setSelectedNode = usePraxisStore((state) => state.setSelectedNode);

  const [renderNodes, setRenderNodes] = useState<Node[]>([]);
  const [renderEdges, setRenderEdges] = useState<Edge[]>([]);

  const templatePayload = templates[template];

  const connected = useMemo(() => {
    if (!hoveredNodeId) return new Set<string>();
    const set = new Set<string>([hoveredNodeId]);
    templatePayload.edges.forEach((edge) => {
      if (edge.source === hoveredNodeId) set.add(edge.target);
      if (edge.target === hoveredNodeId) set.add(edge.source);
    });
    return set;
  }, [hoveredNodeId, templatePayload.edges]);

  useEffect(() => {
    const scopedNodes = clusterExpanded
      ? templatePayload.nodes
      : templatePayload.nodes.filter((node) => !node.id.includes("db"));
    const scopedNodeIds = new Set(scopedNodes.map((node) => node.id));

    const mappedNodes = scopedNodes.map((node) => {
      const details = templatePayload.details[node.id];
      return {
        ...node,
        data: {
          ...node.data,
          glow: connected.has(node.id),
        },
        style: {
          transition: "all 240ms ease-in-out",
        },
      };
    });

    const mappedEdges = templatePayload.edges
      .filter((edge) => scopedNodeIds.has(edge.source) && scopedNodeIds.has(edge.target))
      .map((edge) => ({
        ...edge,
        type: "smoothstep",
        markerEnd: { type: MarkerType.ArrowClosed, color: "#5B8CFF" },
        animated: true,
        style: {
          stroke: connected.has(edge.source) || connected.has(edge.target) ? "#93c5fd" : "#4469b3",
          strokeWidth: connected.has(edge.source) || connected.has(edge.target) ? 2.2 : 1.2,
          transition: "all 240ms ease-in-out",
        },
        data: {
          complexity: Math.max(
            templatePayload.details[edge.source].metrics.complexity,
            templatePayload.details[edge.target].metrics.complexity,
          ),
        },
      }));

    setRenderNodes(mappedNodes.map((node) => ({
      ...node,
      style: {
        ...node.style,
        boxShadow: `0 0 0 1px ${nodeColor(
          templatePayload.details[node.id].metrics.complexity,
          heatmapMode,
        )}44`,
      },
    })));
    setRenderEdges(mappedEdges);
  }, [templatePayload, clusterExpanded, connected, heatmapMode]);

  const onNodeHover: NodeMouseHandler = (_, node) => setHoveredNodeId(node.id);

  return (
    <Panel className="relative h-[700px] overflow-hidden" >
      <div id="graph-canvas-export" className="h-full w-full">
        <ReactFlow
          key={template}
          nodes={renderNodes}
          edges={renderEdges}
          fitView
          nodeTypes={nodeTypes}
          onNodeClick={(_, node) => setSelectedNode(templatePayload.details[node.id])}
          onNodeMouseEnter={onNodeHover}
          onNodeMouseLeave={() => setHoveredNodeId(null)}
          className="transition-all duration-300"
        >
          <Background color="#172030" gap={26} size={1} />
          <MiniMap
            pannable
            zoomable
            style={{ backgroundColor: "#0f1622", border: "1px solid #223047" }}
            nodeColor={(node) => nodeColor(templatePayload.details[node.id].metrics.complexity, heatmapMode)}
          />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>

      {isAnalyzing && (
        <div className="absolute inset-0 z-20 grid place-items-center bg-bg/70 backdrop-blur-sm">
          <div className="flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-slate-200">
            <span className="h-2.5 w-2.5 rounded-full bg-accent animate-pulse" />
            Analyzing repository topology…
          </div>
        </div>
      )}

      {/* TODO: Replace static template graph definitions with PRAXIS backend graph-layout service output. */}
    </Panel>
=======
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
>>>>>>> main
  );
}
