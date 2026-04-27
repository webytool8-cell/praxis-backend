"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Edge,
  MarkerType,
  MiniMap,
  Node,
  NodeMouseHandler,
  Panel,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import { NodeCard } from "@/dashboard/NodeCard";
import { templates } from "@/dashboard/graphTemplates";
import { usePraxisStore } from "@/store/usePraxisStore";
import type { AnalysisGraphData } from "@/types/graph";

const nodeTypes = { nodeCard: NodeCard };

// Edge colors match hierarchy level colors on NodeCard
const kindEdgeColor: Record<string, string> = {
  frontend: "#34d399", // emerald — UI Layer
  api: "#22d3ee",      // cyan    — API Layer
  service: "#a78bfa",  // violet  — Service Layer
  db: "#fbbf24",       // amber   — Data Layer
};

function getNodeKind(nodeId: string, details: Record<string, any>): string {
  return details[nodeId]?.type ?? "service";
}

function CustomControls() {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  return (
    <Panel position="bottom-right">
      <div className="flex flex-col gap-1 mb-4 mr-4">
        {[
          { label: "+", action: () => zoomIn({ duration: 200 }), title: "Zoom in" },
          { label: "−", action: () => zoomOut({ duration: 200 }), title: "Zoom out" },
          { label: "⊡", action: () => fitView({ padding: 0.15, duration: 400 }), title: "Fit view" },
        ].map(({ label, action, title }) => (
          <button
            key={title}
            onClick={action}
            title={title}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700/60 bg-slate-900/90 text-slate-300 text-sm font-medium hover:border-accent/40 hover:text-white transition-all backdrop-blur-sm"
          >
            {label}
          </button>
        ))}
      </div>
    </Panel>
  );
}

function nodeColor(complexity: number, heatmapMode: boolean) {
  if (!heatmapMode) return "#4488ff";
  if (complexity > 30) return "#f97316";
  if (complexity > 22) return "#eab308";
  return "#10b981";
}

export function GraphViewport() {
  const searchParams = useSearchParams();
  const analysisId = searchParams.get("analysisId");

  const template = usePraxisStore((state) => state.template);
  const heatmapMode = usePraxisStore((state) => state.heatmapMode);
  const clusterExpanded = usePraxisStore((state) => state.clusterExpanded);
  const isAnalyzing = usePraxisStore((state) => state.isAnalyzing);
  const hoveredNodeId = usePraxisStore((state) => state.hoveredNodeId);
  const setHoveredNodeId = usePraxisStore((state) => state.setHoveredNodeId);
  const setSelectedNode = usePraxisStore((state) => state.setSelectedNode);
  const currentAnalysis = usePraxisStore((state) => state.currentAnalysis);
  const currentAnalysisId = usePraxisStore((state) => state.currentAnalysisId);
  const setCurrentAnalysis = usePraxisStore((state) => state.setCurrentAnalysis);

  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  useEffect(() => {
    if (!analysisId) return;
    if (currentAnalysisId === analysisId && currentAnalysis) return;

    setLoadingAnalysis(true);
    fetch(`/api/analyses/${analysisId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.graphData) {
          setCurrentAnalysis(data.graphData as AnalysisGraphData, analysisId);
        }
      })
      .catch(console.error)
      .finally(() => setLoadingAnalysis(false));
  }, [analysisId, currentAnalysisId, currentAnalysis, setCurrentAnalysis]);

  const activePayload = useMemo(() => {
    if (currentAnalysis) {
      return {
        nodes: currentAnalysis.nodes,
        edges: currentAnalysis.edges,
        details: currentAnalysis.details,
      };
    }
    return templates[template];
  }, [currentAnalysis, template]);

  const connected = useMemo(() => {
    if (!hoveredNodeId) return new Set<string>();
    const set = new Set<string>([hoveredNodeId]);
    activePayload.edges.forEach((edge: any) => {
      if (edge.source === hoveredNodeId) set.add(edge.target);
      if (edge.target === hoveredNodeId) set.add(edge.source);
    });
    return set;
  }, [hoveredNodeId, activePayload.edges]);

  const [renderNodes, setRenderNodes] = useState<Node[]>([]);
  const [renderEdges, setRenderEdges] = useState<Edge[]>([]);

  useEffect(() => {
    const scopedNodes = clusterExpanded
      ? activePayload.nodes
      : activePayload.nodes.filter((node: any) => !node.id.includes("db"));
    const scopedNodeIds = new Set(scopedNodes.map((node: any) => node.id));

    const mappedNodes: Node[] = scopedNodes.map((node: any) => ({
      ...node,
      type: "nodeCard",
      data: {
        ...node.data,
        // normalize legacy format (nodeKind → kind, praxisNode → nodeCard)
        kind: node.data.kind ?? node.data.nodeKind ?? "service",
        glow: connected.has(node.id),
      },
      style: { transition: "all 240ms ease-in-out" },
    }));

    const mappedEdges: Edge[] = activePayload.edges
      .filter((edge: any) => scopedNodeIds.has(edge.source) && scopedNodeIds.has(edge.target))
      .map((edge: any) => {
        const sourceKind = getNodeKind(edge.source, activePayload.details);
        const baseColor = kindEdgeColor[sourceKind] ?? "#4488ff";
        const isHighlighted = connected.has(edge.source) || connected.has(edge.target);
        return {
          ...edge,
          type: "straight",
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: baseColor,
            width: 16,
            height: 16,
          },
          animated: isHighlighted,
          style: {
            stroke: baseColor,
            strokeWidth: isHighlighted ? 2 : 1.2,
            opacity: isHighlighted ? 1 : 0.55,
            transition: "all 240ms ease-in-out",
          },
        };
      });

    setRenderNodes(mappedNodes);
    setRenderEdges(mappedEdges);
  }, [activePayload, clusterExpanded, connected, heatmapMode]);

  const onNodeHover: NodeMouseHandler = (_, node) => setHoveredNodeId(node.id);

  const showLoading = isAnalyzing || loadingAnalysis;

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div id="graph-canvas-export" className="h-full w-full">
        <ReactFlow
          key={currentAnalysis ? `analysis-${template}` : template}
          nodes={renderNodes}
          edges={renderEdges}
          fitView
          fitViewOptions={{ padding: 0.15 }}
          nodeTypes={nodeTypes}
          onNodeClick={(_, node) => {
            const details = activePayload.details[node.id];
            if (details) setSelectedNode(details);
          }}
          onNodeMouseEnter={onNodeHover}
          onNodeMouseLeave={() => setHoveredNodeId(null)}
          className="transition-all duration-300"
          minZoom={0.25}
          maxZoom={2.5}
        >
          <Background variant={BackgroundVariant.Dots} color="#1e293b" gap={24} size={1.5} />
          <MiniMap
            pannable
            zoomable
            style={{ backgroundColor: "#090e1a", border: "1px solid #1e293b" }}
            nodeColor={(node) => {
              const details = activePayload.details[node.id];
              return nodeColor(details?.metrics?.complexity ?? 20, heatmapMode);
            }}
            maskColor="rgba(0,0,0,0.45)"
          />
          <CustomControls />
        </ReactFlow>
      </div>

      {showLoading && (
        <div className="absolute inset-0 z-20 grid place-items-center bg-bg/70 backdrop-blur-sm">
          <div className="flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-slate-200">
            <span className="h-2.5 w-2.5 rounded-full bg-accent animate-pulse" />
            {loadingAnalysis ? "Loading analysis…" : "Analyzing repository topology…"}
          </div>
        </div>
      )}
    </div>
  );
}
