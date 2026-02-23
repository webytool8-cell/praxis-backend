"use client";

import { create } from "zustand";
import { GraphNodeDetails } from "@/types/graph";

interface PraxisState {
  selectedNode: GraphNodeDetails | null;
  setSelectedNode: (node: GraphNodeDetails | null) => void;
}

export const usePraxisStore = create<PraxisState>((set) => ({
  selectedNode: null,
  setSelectedNode: (node) => set({ selectedNode: node }),
}));
