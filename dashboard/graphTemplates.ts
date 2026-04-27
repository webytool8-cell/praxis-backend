import { Edge, Node } from "reactflow";
import { GraphNodeDetails, ViewTemplate } from "@/types/graph";

type GraphTemplate = {
  nodes: Node[];
  edges: Edge[];
  details: Record<string, GraphNodeDetails>;
};

const baseDetails: Record<string, GraphNodeDetails> = {
  gateway: {
    id: "gateway",
    name: "Gateway API",
    type: "api",
    description: "Aggregates user requests and routes calls into service domains.",
    dependencies: ["auth", "payments", "analytics"],
    metrics: { loc: 1130, imports: 48, complexity: 32 },
    riskScore: 41,
  },
  auth: {
    id: "auth",
    name: "Auth Service",
    type: "service",
    description: "Authentication, session validation, and token refresh logic.",
    dependencies: ["users-db"],
    metrics: { loc: 890, imports: 31, complexity: 24 },
    riskScore: 29,
  },
  payments: {
    id: "payments",
    name: "Payments Service",
    type: "service",
    description: "Billing workflows and provider orchestration.",
    dependencies: ["payments-db"],
    metrics: { loc: 1420, imports: 54, complexity: 38 },
    riskScore: 63,
  },
  analytics: {
    id: "analytics",
    name: "Analytics UI",
    type: "frontend",
    description: "Dashboard rendering and report interactions.",
    dependencies: ["gateway"],
    metrics: { loc: 720, imports: 22, complexity: 18 },
    riskScore: 22,
  },
  "users-db": {
    id: "users-db",
    name: "Users DB",
    type: "db",
    description: "Identity and profile persistence.",
    dependencies: [],
    metrics: { loc: 230, imports: 8, complexity: 12 },
    riskScore: 19,
  },
  "payments-db": {
    id: "payments-db",
    name: "Payments DB",
    type: "db",
    description: "Transaction ledgers and settlement records.",
    dependencies: [],
    metrics: { loc: 320, imports: 6, complexity: 16 },
    riskScore: 44,
  },
};

const makeNode = (id: string, x: number, y: number): Node => ({
  id,
  type: "nodeCard",
  position: { x, y },
  data: { label: baseDetails[id].name, kind: baseDetails[id].type },
});

export const templates: Record<ViewTemplate, GraphTemplate> = {
  architecture: {
    nodes: [
      makeNode("gateway", 60, 200),
      makeNode("auth", 480, 60),
      makeNode("payments", 480, 220),
      makeNode("analytics", 480, 380),
      makeNode("users-db", 900, 60),
      makeNode("payments-db", 900, 220),
    ],
    edges: [
      { id: "e1", source: "gateway", target: "auth", animated: true },
      { id: "e2", source: "gateway", target: "payments", animated: true },
      { id: "e3", source: "gateway", target: "analytics", animated: true },
      { id: "e4", source: "auth", target: "users-db", animated: true },
      { id: "e5", source: "payments", target: "payments-db", animated: true },
    ],
    details: baseDetails,
  },
  dataFlow: {
    nodes: [
      makeNode("analytics", 60, 80),
      makeNode("gateway", 440, 80),
      makeNode("auth", 820, 20),
      makeNode("payments", 820, 200),
      makeNode("users-db", 1200, 20),
      makeNode("payments-db", 1200, 200),
    ],
    edges: [
      { id: "d1", source: "analytics", target: "gateway", animated: true },
      { id: "d2", source: "gateway", target: "auth", animated: true },
      { id: "d3", source: "gateway", target: "payments", animated: true },
      { id: "d4", source: "auth", target: "users-db", animated: true },
      { id: "d5", source: "payments", target: "payments-db", animated: true },
    ],
    details: baseDetails,
  },
  dependency: {
    nodes: [
      makeNode("gateway", 440, 220),
      makeNode("auth", 120, 60),
      makeNode("payments", 760, 60),
      makeNode("analytics", 120, 380),
      makeNode("users-db", 760, 380),
      makeNode("payments-db", 1080, 220),
    ],
    edges: [
      { id: "dp1", source: "auth", target: "gateway", animated: true },
      { id: "dp2", source: "payments", target: "gateway", animated: true },
      { id: "dp3", source: "analytics", target: "gateway", animated: true },
      { id: "dp4", source: "auth", target: "users-db", animated: true },
      { id: "dp5", source: "payments", target: "payments-db", animated: true },
    ],
    details: baseDetails,
  },
  risk: {
    nodes: [
      makeNode("payments", 440, 60),
      makeNode("gateway", 60, 260),
      makeNode("auth", 440, 260),
      makeNode("payments-db", 820, 260),
      makeNode("analytics", 60, 460),
      makeNode("users-db", 440, 460),
    ],
    edges: [
      { id: "r1", source: "gateway", target: "payments", animated: true },
      { id: "r2", source: "payments", target: "payments-db", animated: true },
      { id: "r3", source: "gateway", target: "auth", animated: true },
      { id: "r4", source: "auth", target: "users-db", animated: true },
      { id: "r5", source: "analytics", target: "gateway", animated: true },
    ],
    details: baseDetails,
  },
};
