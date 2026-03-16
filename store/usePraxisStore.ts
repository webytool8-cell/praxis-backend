"use client";

import { create } from "zustand";
import { GraphNodeDetails, ViewTemplate, AnalysisGraphData } from "@/types/graph";

interface PraxisState {
  selectedNode: GraphNodeDetails | null;
  hoveredNodeId: string | null;
  template: ViewTemplate;
  heatmapMode: boolean;
  clusterExpanded: boolean;
  isAnalyzing: boolean;
  currentAnalysis: AnalysisGraphData | null;
  currentAnalysisId: string | null;
  chatOpen: boolean;
  securityPanelOpen: boolean;
  setSelectedNode: (node: GraphNodeDetails | null) => void;
  setHoveredNodeId: (nodeId: string | null) => void;
  setTemplate: (template: ViewTemplate) => void;
  setHeatmapMode: (enabled: boolean) => void;
  toggleCluster: () => void;
  setAnalyzing: (value: boolean) => void;
  setCurrentAnalysis: (analysis: AnalysisGraphData | null, id?: string) => void;
  setChatOpen: (open: boolean) => void;
  setSecurityPanelOpen: (open: boolean) => void;
}

export const usePraxisStore = create<PraxisState>((set) => ({
  selectedNode: null,
  hoveredNodeId: null,
  template: "architecture",
  heatmapMode: false,
  clusterExpanded: true,
  isAnalyzing: false,
  currentAnalysis: null,
  currentAnalysisId: null,
  chatOpen: false,
  securityPanelOpen: false,
  setSelectedNode: (node) => set({ selectedNode: node }),
  setHoveredNodeId: (nodeId) => set({ hoveredNodeId: nodeId }),
  setTemplate: (template) => set({ template }),
  setHeatmapMode: (enabled) => set({ heatmapMode: enabled }),
  toggleCluster: () => set((state) => ({ clusterExpanded: !state.clusterExpanded })),
  setAnalyzing: (value) => set({ isAnalyzing: value }),
  setCurrentAnalysis: (analysis, id) =>
    set({ currentAnalysis: analysis, currentAnalysisId: id ?? null, selectedNode: null }),
  setChatOpen: (open) => set({ chatOpen: open }),
  setSecurityPanelOpen: (open) => set({ securityPanelOpen: open }),
}));
