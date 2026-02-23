"use client";

import { create } from "zustand";
<<<<<<< HEAD
import { GraphNodeDetails, ViewTemplate } from "@/types/graph";

interface PraxisState {
  selectedNode: GraphNodeDetails | null;
  hoveredNodeId: string | null;
  template: ViewTemplate;
  heatmapMode: boolean;
  clusterExpanded: boolean;
  isAnalyzing: boolean;
  setSelectedNode: (node: GraphNodeDetails | null) => void;
  setHoveredNodeId: (nodeId: string | null) => void;
  setTemplate: (template: ViewTemplate) => void;
  setHeatmapMode: (enabled: boolean) => void;
  toggleCluster: () => void;
  setAnalyzing: (value: boolean) => void;
=======
import { GraphNodeDetails } from "@/types/graph";

interface PraxisState {
  selectedNode: GraphNodeDetails | null;
  setSelectedNode: (node: GraphNodeDetails | null) => void;
>>>>>>> codex/generate-next.js-project-structure-for-praxis
}

export const usePraxisStore = create<PraxisState>((set) => ({
  selectedNode: null,
<<<<<<< HEAD
  hoveredNodeId: null,
  template: "architecture",
  heatmapMode: false,
  clusterExpanded: true,
  isAnalyzing: false,
  setSelectedNode: (node) => set({ selectedNode: node }),
  setHoveredNodeId: (nodeId) => set({ hoveredNodeId: nodeId }),
  setTemplate: (template) => set({ template }),
  setHeatmapMode: (enabled) => set({ heatmapMode: enabled }),
  toggleCluster: () => set((state) => ({ clusterExpanded: !state.clusterExpanded })),
  setAnalyzing: (value) => set({ isAnalyzing: value }),
=======
  setSelectedNode: (node) => set({ selectedNode: node }),
>>>>>>> codex/generate-next.js-project-structure-for-praxis
}));
