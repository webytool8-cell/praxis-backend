"use client";

import { useEffect, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  Edge,
  MarkerType,
  MiniMap,
  Node,
  NodeMouseHandler,
} from "reactflow";
import "reactflow/dist/style.css";
import { Panel } from "@/components/ui/Panel";
import { NodeCard } from "@/dashboard/NodeCard";
import { SecurityPanel } from "@/components/SecurityPanel";
import type { AnalysisGraphData, GraphNodeDetails, SecurityFinding } from "@/types/graph";

const nodeTypes = { nodeCard: NodeCard };

interface NodeCommentData {
  id: string;
  nodeId: string;
  author: string;
  content: string;
  createdAt: string;
}

interface SharedDashboardProps {
  analysisId: string;
  graphData: AnalysisGraphData;
  securityFindings: SecurityFinding[];
}

export function SharedDashboard({ analysisId, graphData, securityFindings }: SharedDashboardProps) {
  const [selectedNode, setSelectedNode] = useState<GraphNodeDetails | null>(null);
  const [comments, setComments] = useState<NodeCommentData[]>([]);
  const [commentAuthor, setCommentAuthor] = useState("");
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  const nodes: Node[] = graphData.nodes.map((n) => ({
    ...n,
    style: { transition: "all 240ms ease-in-out" },
  }));

  const edges: Edge[] = graphData.edges.map((e) => ({
    ...e,
    type: "smoothstep",
    markerEnd: { type: MarkerType.ArrowClosed, color: "#5B8CFF" },
    animated: true,
    style: { stroke: "#4469b3", strokeWidth: 1.2 },
  }));

  // Load comments for selected node
  useEffect(() => {
    if (!selectedNode) return;
    fetch(`/api/analyses/${analysisId}/comments?nodeId=${selectedNode.id}`)
      .then((r) => r.json())
      .then((data) => setComments(data.comments ?? []))
      .catch(() => {});
  }, [selectedNode, analysisId]);

  const handleNodeClick: NodeMouseHandler = (_, node) => {
    const details = graphData.details[node.id];
    if (details) setSelectedNode(details);
  };

  const submitComment = async () => {
    if (!selectedNode || !commentText.trim() || !commentAuthor.trim()) return;
    setSubmittingComment(true);
    try {
      const res = await fetch(`/api/analyses/${analysisId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nodeId: selectedNode.id, author: commentAuthor, content: commentText }),
      });
      if (res.ok) {
        const { comment } = await res.json();
        setComments((prev) => [...prev, comment]);
        setCommentText("");
      }
    } finally {
      setSubmittingComment(false);
    }
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
      <Panel className="relative h-[600px] overflow-hidden">
        <div className="h-full w-full">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            fitView
            nodeTypes={nodeTypes}
            onNodeClick={handleNodeClick}
          >
            <Background color="#172030" gap={26} size={1} />
            <MiniMap
              pannable
              zoomable
              style={{ backgroundColor: "#0f1622", border: "1px solid #223047" }}
            />
            <Controls showInteractive={false} />
          </ReactFlow>
        </div>
      </Panel>

      <div className="space-y-4">
        {selectedNode ? (
          <Panel className="p-4 space-y-3">
            <p className="text-sm font-semibold text-blue-100">{selectedNode.name}</p>
            <p className="text-xs text-muted">{selectedNode.description}</p>

            <div className="space-y-1 text-xs text-slate-300">
              <p>LOC: {selectedNode.metrics.loc}</p>
              <p>Risk: {selectedNode.riskScore}/100</p>
            </div>

            {selectedNode.remediations?.length ? (
              <div>
                <p className="text-xs font-semibold text-accentViolet mb-2">AI Suggestions</p>
                <ul className="space-y-1">
                  {selectedNode.remediations.map((r, i) => (
                    <li key={i} className="text-xs text-slate-300 flex gap-2">
                      <span className="text-accentViolet shrink-0">→</span>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {/* Comments */}
            <div className="border-t border-white/10 pt-3">
              <p className="text-xs font-semibold text-slate-300 mb-2">Comments</p>
              {comments.length === 0 && (
                <p className="text-xs text-muted">No comments yet.</p>
              )}
              {comments.map((c) => (
                <div key={c.id} className="text-xs mb-2 p-2 rounded bg-white/5">
                  <p className="font-medium text-white">{c.author}</p>
                  <p className="text-slate-300 mt-0.5">{c.content}</p>
                </div>
              ))}

              <div className="mt-3 space-y-2">
                <input
                  placeholder="Your name"
                  value={commentAuthor}
                  onChange={(e) => setCommentAuthor(e.target.value)}
                  className="w-full text-xs bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white placeholder:text-muted focus:outline-none"
                />
                <textarea
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  rows={2}
                  className="w-full text-xs bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white placeholder:text-muted focus:outline-none resize-none"
                />
                <button
                  onClick={submitComment}
                  disabled={submittingComment || !commentText.trim() || !commentAuthor.trim()}
                  className="w-full text-xs bg-accent/20 text-accent rounded px-3 py-1.5 hover:bg-accent/30 transition-colors disabled:opacity-50"
                >
                  {submittingComment ? "Posting…" : "Post Comment"}
                </button>
              </div>
            </div>
          </Panel>
        ) : (
          <Panel className="p-4">
            <p className="text-sm text-muted">Click a node to inspect details and leave comments.</p>
          </Panel>
        )}

        {securityFindings.length > 0 && (
          <Panel className="p-4">
            <p className="text-xs font-semibold text-slate-300 mb-3">Security Findings</p>
            <SecurityPanel findings={securityFindings} />
          </Panel>
        )}
      </div>
    </div>
  );
}
