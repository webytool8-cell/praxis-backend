import { Edge, Node } from "reactflow";
import { Template } from "@/types/graph";
import { templateNodes, templateEdges } from "@/lib/graph/mockGraph";

export function buildLayout(template: Template): { nodes: Node[]; edges: Edge[] } {
  return {
    nodes: templateNodes[template],
    edges: templateEdges[template],
  };
}
