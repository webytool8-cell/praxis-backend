<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> codex/generate-next.js-project-structure-for-praxis-tnp5m1
=======
>>>>>>> main
>>>>>>> main
>>>>>>> main
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
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
=======
export interface GraphNodeDetails {
  id: string;
  name: string;
  type: string;
  summary: string;
<<<<<<< HEAD
>>>>>>> codex/generate-next.js-project-structure-for-praxis
>>>>>>> codex/generate-next.js-project-structure-for-praxis-tnp5m1
=======
>>>>>>> main
>>>>>>> main
>>>>>>> main
>>>>>>> main
}
