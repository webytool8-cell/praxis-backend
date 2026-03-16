"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
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
import type { AnalysisGraphData } from "@/types/graph";

const nodeTypes = { nodeCard: NodeCard };

function nodeColor(complexity: number, heatmapMode: boolean) {
  if (!heatmapMode) return "#5B8CFF";
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
  const setCurrentAnalysis = usePraxisStore((state) => state.setCurrentAnalysis);

  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  // Load analysis from API when analysisId param is present
  useEffect(() => {
    if (!analysisId) return;

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
  }, [analysisId, setCurrentAnalysis]);

  // Use real analysis data if available, fall back to static templates
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

    const mappedNodes: Node[] = scopedNodes.map((node: any) => {
      const details = activePayload.details[node.id];
      const complexity = details?.metrics?.complexity ?? 20;
      return {
        ...node,
        data: {
          ...node.data,
          glow: connected.has(node.id),
        },
        style: {
          transition: "all 240ms ease-in-out",
          boxShadow: `0 0 0 1px ${nodeColor(complexity, heatmapMode)}44`,
        },
      };
    });

    const mappedEdges: Edge[] = activePayload.edges
      .filter((edge: any) => scopedNodeIds.has(edge.source) && scopedNodeIds.has(edge.target))
      .map((edge: any) => ({
        ...edge,
        type: "smoothstep",
        markerEnd: { type: MarkerType.ArrowClosed, color: "#5B8CFF" },
        animated: true,
        style: {
          stroke: connected.has(edge.source) || connected.has(edge.target) ? "#93c5fd" : "#4469b3",
          strokeWidth: connected.has(edge.source) || connected.has(edge.target) ? 2.2 : 1.2,
          transition: "all 240ms ease-in-out",
        },
      }));

    setRenderNodes(mappedNodes);
    setRenderEdges(mappedEdges);
  }, [activePayload, clusterExpanded, connected, heatmapMode]);

  const onNodeHover: NodeMouseHandler = (_, node) => setHoveredNodeId(node.id);

  const showLoading = isAnalyzing || loadingAnalysis;

  return (
    <Panel className="relative h-[700px] overflow-hidden">
      <div id="graph-canvas-export" className="h-full w-full">
        <ReactFlow
          key={currentAnalysis ? `analysis-${template}` : template}
          nodes={renderNodes}
          edges={renderEdges}
          fitView
          nodeTypes={nodeTypes}
          onNodeClick={(_, node) => {
            const details = activePayload.details[node.id];
            if (details) setSelectedNode(details);
          }}
          onNodeMouseEnter={onNodeHover}
          onNodeMouseLeave={() => setHoveredNodeId(null)}
          className="transition-all duration-300"
        >
          <Background color="#172030" gap={26} size={1} />
          <MiniMap
            pannable
            zoomable
            style={{ backgroundColor: "#0f1622", border: "1px solid #223047" }}
            nodeColor={(node) => {
              const details = activePayload.details[node.id];
              return nodeColor(details?.metrics?.complexity ?? 20, heatmapMode);
            }}
          />
          <Controls showInteractive={false} />
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
    </Panel>
  );
}
