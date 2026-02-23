"use client";

import { create } from "zustand";
import { Template, GraphNodeData } from "@/types/graph";

interface AppState {
  template: Template;
  selectedNode: GraphNodeData | null;
  hoveredNode: string | null;
  setTemplate: (template: Template) => void;
  setSelectedNode: (node: GraphNodeData | null) => void;
  setHoveredNode: (id: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  template: "architecture",
  selectedNode: null,
  hoveredNode: null,
  setTemplate: (template) => set({ template }),
  setSelectedNode: (selectedNode) => set({ selectedNode }),
  setHoveredNode: (hoveredNode) => set({ hoveredNode }),
}));
