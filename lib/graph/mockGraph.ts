import { Edge, Node } from "reactflow";
import { GraphNodeData, Template } from "@/types/graph";

const n = (id: string, label: string, type: GraphNodeData["type"], x: number, y: number): Node<GraphNodeData> => ({
  id,
  position: { x, y },
  type: "nodeCard",
  data: {
    id,
    label,
    type,
    path: `src/${id}`,
    tags: [type],
    metrics: {
      loc: 120 + x,
      imports: 4 + Math.round(y / 100),
      fanIn: 2 + Math.round(x / 200),
      fanOut: 3 + Math.round(y / 120),
      risk: Math.min(100, 20 + Math.round((x + y) / 12)),
    },
  },
});

const baseEdges: Edge[] = [
  { id: "e1", source: "frontend", target: "api", animated: true },
  { id: "e2", source: "api", target: "service", animated: true },
  { id: "e3", source: "service", target: "db", animated: true },
  { id: "e4", source: "service", target: "external", animated: true },
  { id: "e5", source: "infra", target: "service", animated: true },
];

export const templateNodes: Record<Template, Node<GraphNodeData>[]> = {
  architecture: [
    n("frontend", "Frontend App", "frontend", 40, 120),
    n("api", "API Gateway", "api", 280, 120),
    n("service", "Core Service", "service", 520, 120),
    n("db", "Primary DB", "db", 760, 70),
    n("infra", "Infra", "infra", 520, 280),
    n("external", "External API", "external", 760, 220),
  ],
  dependencies: [
    n("frontend", "web/index.tsx", "file", 40, 80),
    n("api", "server/routes.ts", "file", 260, 60),
    n("service", "core/graph.ts", "file", 500, 80),
    n("db", "db/client.ts", "file", 760, 80),
    n("infra", "infra/queue.ts", "file", 500, 240),
    n("external", "integrations/git.ts", "file", 760, 240),
  ],
  dataflow: [
    n("frontend", "Request", "frontend", 40, 140),
    n("api", "Route", "api", 250, 140),
    n("service", "Compute", "service", 460, 140),
    n("db", "Persist", "db", 680, 80),
    n("external", "Enrich", "external", 680, 220),
    n("infra", "Events", "infra", 460, 280),
  ],
  risk: [
    n("service", "Hotspot Service", "service", 420, 120),
    n("api", "Gateway", "api", 180, 120),
    n("db", "Billing DB", "db", 660, 80),
    n("external", "Vendor API", "external", 660, 220),
    n("frontend", "UI", "frontend", 40, 120),
    n("infra", "Infra", "infra", 420, 280),
  ],
};

export const templateEdges: Record<Template, Edge[]> = {
  architecture: baseEdges,
  dependencies: baseEdges,
  dataflow: baseEdges,
  risk: baseEdges,
};
