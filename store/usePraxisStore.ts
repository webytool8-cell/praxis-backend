"use client";

import { create } from "zustand";
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> codex/generate-next.js-project-structure-for-praxis-tnp5m1
=======
>>>>>>> main
=======
>>>>>>> codex/generate-next.js-project-structure-for-praxis-xj8r91
>>>>>>> main
>>>>>>> main
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
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
=======
import { GraphNodeDetails } from "@/types/graph";

interface PraxisState {
  selectedNode: GraphNodeDetails | null;
  setSelectedNode: (node: GraphNodeDetails | null) => void;
<<<<<<< HEAD
>>>>>>> codex/generate-next.js-project-structure-for-praxis
>>>>>>> codex/generate-next.js-project-structure-for-praxis-tnp5m1
=======
>>>>>>> main
>>>>>>> main
>>>>>>> main
>>>>>>> main
>>>>>>> main
}

export const usePraxisStore = create<PraxisState>((set) => ({
  selectedNode: null,
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> codex/generate-next.js-project-structure-for-praxis-tnp5m1
=======
>>>>>>> main
=======
>>>>>>> codex/generate-next.js-project-structure-for-praxis-xj8r91
>>>>>>> main
>>>>>>> main
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
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
=======
  setSelectedNode: (node) => set({ selectedNode: node }),
<<<<<<< HEAD
>>>>>>> codex/generate-next.js-project-structure-for-praxis
>>>>>>> codex/generate-next.js-project-structure-for-praxis-tnp5m1
=======
>>>>>>> main
>>>>>>> main
>>>>>>> main
>>>>>>> main
>>>>>>> main
}));
