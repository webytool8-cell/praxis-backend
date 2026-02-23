export type NodeType = "frontend" | "api" | "service" | "db" | "infra" | "external" | "file";
export type Template = "architecture" | "dependencies" | "dataflow" | "risk";

export interface NodeMetrics {
  loc: number;
  imports: number;
  fanIn: number;
  fanOut: number;
  risk: number;
}

export interface GraphNodeData {
  id: string;
  label: string;
  type: NodeType;
  path: string;
  metrics: NodeMetrics;
  tags: string[];
}
