export type ViewTemplate = "architecture" | "dataFlow" | "dependency" | "risk";
export type NodeKind = "api" | "db" | "frontend" | "service";

export interface GraphNodeDetails {
  id: string;
  name: string;
  type: NodeKind;
  description: string;
  dependencies: string[];
  metrics: {
    loc: number;
    imports: number;
    complexity: number;
  };
  riskScore: number;
  aiExplanation?: string;
  remediations?: string[];
}

export interface SecurityFinding {
  file: string;
  line?: number;
  severity: "critical" | "high" | "medium" | "low";
  type: string;
  description: string;
  recommendation: string;
}

export interface FlowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: { label: string; nodeKind: NodeKind };
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  animated: boolean;
}

export interface AnalysisGraphData {
  nodes: FlowNode[];
  edges: FlowEdge[];
  details: Record<string, GraphNodeDetails>;
  aiSummary: string;
  securityFindings?: SecurityFinding[];
}

export interface Analysis {
  id: string;
  name: string;
  sourceType: "upload" | "repo";
  repoUrl?: string;
  graphData: AnalysisGraphData;
  securityScan?: SecurityFinding[];
  aiSummary?: string;
  shareToken?: string;
  createdAt: string;
}
