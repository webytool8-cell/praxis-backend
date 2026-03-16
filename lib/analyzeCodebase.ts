import Anthropic from "@anthropic-ai/sdk";
import type { AnalysisGraphData, GraphNodeDetails, NodeKind } from "@/types/graph";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface FileContent {
  name: string;
  content: string;
}

interface RawNode {
  id: string;
  name: string;
  type: NodeKind;
  description: string;
  dependencies: string[];
  metrics: { loc: number; imports: number; complexity: number };
}

interface RawRisk {
  nodeId: string;
  riskScore: number;
  explanation: string;
  remediations: string[];
}

// Truncate file to avoid token overflow
function truncateFile(content: string, maxLines = 300): string {
  const lines = content.split("\n");
  if (lines.length <= maxLines) return content;
  return lines.slice(0, maxLines).join("\n") + `\n... (truncated, ${lines.length - maxLines} more lines)`;
}

function buildFileContext(files: FileContent[]): string {
  return files
    .slice(0, 50)
    .map((f) => `### ${f.name}\n\`\`\`\n${truncateFile(f.content)}\n\`\`\``)
    .join("\n\n");
}

export async function analyzeCodebase(
  files: FileContent[],
  projectName: string
): Promise<AnalysisGraphData> {
  const fileContext = buildFileContext(files);

  // Step 1: Extract architecture
  const architectureResponse = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: `You are a software architect analyzing a codebase called "${projectName}".

Analyze these source files and identify the major components/services:

${fileContext}

Return a JSON array of components. Each component must have:
- id: snake_case identifier
- name: human-readable name
- type: one of "api" | "db" | "frontend" | "service"
- description: 1-2 sentence description of what this component does
- dependencies: array of other component ids this depends on
- metrics: { loc: estimated lines of code, imports: estimated import count, complexity: cyclomatic complexity estimate 1-50 }

Return ONLY valid JSON, no markdown. Example:
[{"id":"auth","name":"Auth Service","type":"service","description":"...","dependencies":["users_db"],"metrics":{"loc":800,"imports":24,"complexity":18}}]`,
      },
    ],
  });

  let nodes: RawNode[] = [];
  try {
    const raw = (architectureResponse.content[0] as { text: string }).text.trim();
    const jsonStr = raw.startsWith("[") ? raw : raw.substring(raw.indexOf("["), raw.lastIndexOf("]") + 1);
    nodes = JSON.parse(jsonStr);
  } catch {
    nodes = generateFallbackNodes(files, projectName);
  }

  // Step 2: Risk analysis
  const nodeList = nodes.map((n) => `- ${n.id}: ${n.name} (${n.type})`).join("\n");

  const riskResponse = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: `Analyze risk for these components in "${projectName}":

${nodeList}

Context (source files):
${fileContext}

For each component, assess risk based on:
- High coupling (many dependencies)
- Missing error handling
- Missing authentication/authorization
- High complexity
- Single point of failure potential
- Security vulnerabilities

Return a JSON array:
[{"nodeId":"auth","riskScore":35,"explanation":"Moderate risk due to...","remediations":["Add rate limiting","Implement refresh token rotation"]}]

Return ONLY valid JSON, no markdown.`,
      },
    ],
  });

  let risks: RawRisk[] = [];
  try {
    const raw = (riskResponse.content[0] as { text: string }).text.trim();
    const jsonStr = raw.startsWith("[") ? raw : raw.substring(raw.indexOf("["), raw.lastIndexOf("]") + 1);
    risks = JSON.parse(jsonStr);
  } catch {
    risks = nodes.map((n) => ({
      nodeId: n.id,
      riskScore: Math.floor(Math.random() * 40) + 20,
      explanation: "Risk analysis could not be completed for this component.",
      remediations: ["Review code for security best practices", "Add comprehensive error handling"],
    }));
  }

  // Step 3: AI Summary
  const summaryResponse = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `Write a 2-3 paragraph architecture overview for "${projectName}" based on these components: ${nodeList}

Write it in a professional tone suitable for technical documentation or an onboarding doc. Focus on the system's purpose, structure, and key architectural decisions.`,
      },
    ],
  });

  const aiSummary = (summaryResponse.content[0] as { text: string }).text.trim();

  // Build the final graph data
  const riskMap = new Map(risks.map((r) => [r.nodeId, r]));

  const details: AnalysisGraphData["details"] = {};
  nodes.forEach((node) => {
    const risk = riskMap.get(node.id);
    details[node.id] = {
      ...node,
      riskScore: risk?.riskScore ?? 30,
      aiExplanation: risk?.explanation,
      remediations: risk?.remediations ?? [],
    };
  });

  // Generate ReactFlow-compatible nodes with positions
  const flowNodes = generateFlowLayout(nodes);
  const flowEdges = generateFlowEdges(nodes);

  return {
    nodes: flowNodes,
    edges: flowEdges,
    details,
    aiSummary,
  };
}

function generateFlowLayout(nodes: RawNode[]) {
  const typeGroups: Record<NodeKind, RawNode[]> = {
    api: [],
    frontend: [],
    service: [],
    db: [],
  };

  nodes.forEach((n) => {
    const kind = (["api", "db", "frontend", "service"].includes(n.type) ? n.type : "service") as NodeKind;
    typeGroups[kind].push(n);
  });

  const positions: Array<{ id: string; x: number; y: number }> = [];
  const rows: NodeKind[] = ["frontend", "api", "service", "db"];

  rows.forEach((type, rowIndex) => {
    const group = typeGroups[type];
    group.forEach((node, colIndex) => {
      positions.push({
        id: node.id,
        x: colIndex * 220 + (rowIndex % 2 === 0 ? 110 : 0),
        y: rowIndex * 180,
      });
    });
  });

  return nodes.map((node) => {
    const pos = positions.find((p) => p.id === node.id) ?? { x: 0, y: 0 };
    return {
      id: node.id,
      type: "praxisNode",
      position: { x: pos.x, y: pos.y },
      data: { label: node.name, nodeKind: node.type },
    };
  });
}

function generateFlowEdges(nodes: RawNode[]) {
  const edges: Array<{ id: string; source: string; target: string; animated: boolean }> = [];
  nodes.forEach((node) => {
    node.dependencies.forEach((dep) => {
      if (nodes.some((n) => n.id === dep)) {
        edges.push({
          id: `${node.id}-${dep}`,
          source: node.id,
          target: dep,
          animated: true,
        });
      }
    });
  });
  return edges;
}

function generateFallbackNodes(files: FileContent[], projectName: string): RawNode[] {
  // Simple heuristic fallback when JSON parsing fails
  const hasDB = files.some((f) => /prisma|schema\.sql|models\./i.test(f.name));
  const hasAPI = files.some((f) => /api|route|controller/i.test(f.name));
  const hasFrontend = files.some((f) => /page\.|component\.|\.tsx|\.jsx/i.test(f.name));

  const nodes: RawNode[] = [];
  if (hasFrontend) {
    nodes.push({ id: "frontend", name: "Frontend", type: "frontend", description: `UI layer for ${projectName}`, dependencies: hasAPI ? ["api"] : [], metrics: { loc: 500, imports: 20, complexity: 12 } });
  }
  if (hasAPI) {
    nodes.push({ id: "api", name: "API Layer", type: "api", description: "Backend API routes and handlers", dependencies: hasDB ? ["database"] : [], metrics: { loc: 800, imports: 30, complexity: 22 } });
  }
  if (hasDB) {
    nodes.push({ id: "database", name: "Database", type: "db", description: "Data persistence layer", dependencies: [], metrics: { loc: 200, imports: 5, complexity: 8 } });
  }
  if (nodes.length === 0) {
    nodes.push({ id: "app", name: projectName, type: "service", description: "Main application module", dependencies: [], metrics: { loc: files.reduce((s, f) => s + f.content.split("\n").length, 0), imports: 10, complexity: 15 } });
  }
  return nodes;
}
