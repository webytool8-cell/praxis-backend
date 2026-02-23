<<<<<<< HEAD
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
=======
export interface GraphNodeDetails {
  id: string;
  name: string;
  type: string;
  summary: string;
>>>>>>> codex/generate-next.js-project-structure-for-praxis
}
