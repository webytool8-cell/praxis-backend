import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import type { AnalysisGraphData, GraphNodeDetails } from "@/types/graph";

interface PraxisVideoProps {
  analysis: AnalysisGraphData;
  projectName: string;
  narrationScript?: string;
}

// Duration: ~90 seconds at 30fps = 2700 frames
const FPS = 30;
const TOTAL_FRAMES = 2700;

// Section durations (in frames)
const TITLE_DURATION = 5 * FPS;
const OVERVIEW_DURATION = 20 * FPS;
const PER_NODE_DURATION = 8 * FPS;
const RISK_SUMMARY_DURATION = 15 * FPS;

const NODE_TYPE_COLORS: Record<string, string> = {
  api: "#5B8CFF",
  db: "#8B5CF6",
  frontend: "#10B981",
  service: "#6366F1",
};

function riskColor(score: number): string {
  if (score >= 70) return "#EF4444";
  if (score >= 45) return "#F59E0B";
  return "#10B981";
}

// Title card
function TitleCard({ projectName, frame }: { projectName: string; frame: number }) {
  const { fps } = useVideoConfig();
  const opacity = interpolate(frame, [0, 20], [0, 1]);
  const y = interpolate(frame, [0, 20], [30, 0]);

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0B0F14 0%, #0F1720 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity,
        transform: `translateY(${y}px)`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#5B8CFF", boxShadow: "0 0 20px #5B8CFF" }} />
        <p style={{ color: "#5B8CFF", fontSize: 14, fontFamily: "Arial", letterSpacing: 8, textTransform: "uppercase" }}>
          PRAXIS
        </p>
      </div>
      <h1 style={{ color: "#E2E8F0", fontSize: 52, fontFamily: "Arial", fontWeight: "bold", textAlign: "center", margin: 0 }}>
        {projectName}
      </h1>
      <p style={{ color: "#8A95A8", fontSize: 22, fontFamily: "Arial", marginTop: 16 }}>
        Architecture Review
      </p>
    </AbsoluteFill>
  );
}

// Overview section
function OverviewSection({ aiSummary, frame }: { aiSummary: string; frame: number }) {
  const opacity = interpolate(frame, [0, 15], [0, 1]);
  const lines = aiSummary.split(". ").slice(0, 4);

  return (
    <AbsoluteFill
      style={{
        background: "#0B0F14",
        padding: "60px 80px",
        opacity,
      }}
    >
      <p style={{ color: "#5B8CFF", fontSize: 13, fontFamily: "Arial", letterSpacing: 6, textTransform: "uppercase", marginBottom: 24 }}>
        SYSTEM OVERVIEW
      </p>
      <div style={{ borderLeft: "3px solid #5B8CFF44", paddingLeft: 24 }}>
        {lines.map((line, i) => {
          const lineOpacity = interpolate(frame, [10 + i * 8, 25 + i * 8], [0, 1]);
          return (
            <p
              key={i}
              style={{
                color: "#CBD5E1",
                fontSize: 18,
                fontFamily: "Arial",
                lineHeight: 1.6,
                marginBottom: 16,
                opacity: lineOpacity,
              }}
            >
              {line}{i < lines.length - 1 ? "." : ""}
            </p>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}

// Node detail card
function NodeCard({ node, frame }: { node: GraphNodeDetails; frame: number }) {
  const { fps } = useVideoConfig();
  const color = NODE_TYPE_COLORS[node.type] ?? "#5B8CFF";
  const risk = riskColor(node.riskScore);

  const scale = spring({ fps, frame, config: { damping: 12 } });
  const opacity = interpolate(frame, [0, 10], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        background: "#0B0F14",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      <div style={{
        background: "#101722",
        border: `1px solid ${color}44`,
        borderRadius: 16,
        padding: "48px 64px",
        maxWidth: 800,
        width: "100%",
        boxShadow: `0 0 60px ${color}22`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
          <span style={{ color, fontSize: 11, fontFamily: "Arial", letterSpacing: 4, textTransform: "uppercase" }}>
            {node.type}
          </span>
        </div>
        <h2 style={{ color: "#E2E8F0", fontSize: 36, fontFamily: "Arial", fontWeight: "bold", marginBottom: 16 }}>
          {node.name}
        </h2>
        <p style={{ color: "#8A95A8", fontSize: 16, fontFamily: "Arial", lineHeight: 1.6, marginBottom: 32 }}>
          {node.description}
        </p>

        <div style={{ display: "flex", gap: 40, marginBottom: 32 }}>
          {[
            { label: "LOC", value: node.metrics.loc },
            { label: "Imports", value: node.metrics.imports },
            { label: "Complexity", value: node.metrics.complexity },
          ].map(({ label, value }) => (
            <div key={label}>
              <p style={{ color: "#8A95A8", fontSize: 12, fontFamily: "Arial", marginBottom: 4 }}>{label}</p>
              <p style={{ color: "#E2E8F0", fontSize: 24, fontFamily: "Arial", fontWeight: "bold" }}>{value}</p>
            </div>
          ))}
        </div>

        <div>
          <p style={{ color: "#8A95A8", fontSize: 12, fontFamily: "Arial", marginBottom: 8 }}>
            RISK SCORE
          </p>
          <div style={{ background: "#1E293B", borderRadius: 4, height: 8, width: "100%", marginBottom: 8 }}>
            <div style={{
              background: risk,
              borderRadius: 4,
              height: 8,
              width: `${node.riskScore}%`,
              transition: "width 0.5s",
            }} />
          </div>
          <p style={{ color: risk, fontSize: 18, fontFamily: "Arial", fontWeight: "bold" }}>
            {node.riskScore}/100
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
}

// Risk summary
function RiskSummary({ nodes, frame }: { nodes: GraphNodeDetails[]; frame: number }) {
  const opacity = interpolate(frame, [0, 15], [0, 1]);
  const sorted = [...nodes].sort((a, b) => b.riskScore - a.riskScore).slice(0, 5);

  return (
    <AbsoluteFill style={{ background: "#0B0F14", padding: "60px 80px", opacity }}>
      <p style={{ color: "#EF4444", fontSize: 13, fontFamily: "Arial", letterSpacing: 6, textTransform: "uppercase", marginBottom: 24 }}>
        RISK ASSESSMENT
      </p>
      {sorted.map((node, i) => {
        const itemOpacity = interpolate(frame, [10 + i * 6, 25 + i * 6], [0, 1]);
        return (
          <div key={node.id} style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 20, opacity: itemOpacity }}>
            <div style={{ background: riskColor(node.riskScore), borderRadius: 4, width: 4, height: 40, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <p style={{ color: "#E2E8F0", fontSize: 18, fontFamily: "Arial", fontWeight: "bold", marginBottom: 4 }}>
                {node.name}
              </p>
              {node.remediations?.[0] && (
                <p style={{ color: "#8A95A8", fontSize: 14, fontFamily: "Arial" }}>→ {node.remediations[0]}</p>
              )}
            </div>
            <p style={{ color: riskColor(node.riskScore), fontSize: 22, fontFamily: "Arial", fontWeight: "bold" }}>
              {node.riskScore}
            </p>
          </div>
        );
      })}
    </AbsoluteFill>
  );
}

// Outro
function Outro({ frame }: { frame: number }) {
  const opacity = interpolate(frame, [0, 15], [0, 1]);
  return (
    <AbsoluteFill style={{
      background: "linear-gradient(135deg, #0B0F14 0%, #0F1720 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      opacity,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#5B8CFF" }} />
        <p style={{ color: "#5B8CFF", fontSize: 12, fontFamily: "Arial", letterSpacing: 8, textTransform: "uppercase" }}>
          PRAXIS
        </p>
      </div>
      <p style={{ color: "#8A95A8", fontSize: 18, fontFamily: "Arial" }}>
        Developer System Intelligence
      </p>
    </AbsoluteFill>
  );
}

export function PraxisVideo({ analysis, projectName }: PraxisVideoProps) {
  const frame = useCurrentFrame();
  const nodes = Object.values(analysis.details);

  let nodeStart = TITLE_DURATION + OVERVIEW_DURATION;
  const nodeSequences = nodes.map((node) => {
    const start = nodeStart;
    nodeStart += PER_NODE_DURATION;
    return { node, start };
  });

  const riskStart = nodeStart;
  const outroStart = riskStart + RISK_SUMMARY_DURATION;

  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={TITLE_DURATION}>
        <TitleCard projectName={projectName} frame={frame} />
      </Sequence>

      <Sequence from={TITLE_DURATION} durationInFrames={OVERVIEW_DURATION}>
        <OverviewSection aiSummary={analysis.aiSummary ?? ""} frame={frame - TITLE_DURATION} />
      </Sequence>

      {nodeSequences.map(({ node, start }) => (
        <Sequence key={node.id} from={start} durationInFrames={PER_NODE_DURATION}>
          <NodeCard node={node} frame={frame - start} />
        </Sequence>
      ))}

      <Sequence from={riskStart} durationInFrames={RISK_SUMMARY_DURATION}>
        <RiskSummary nodes={nodes} frame={frame - riskStart} />
      </Sequence>

      <Sequence from={outroStart} durationInFrames={3 * FPS}>
        <Outro frame={frame - outroStart} />
      </Sequence>
    </AbsoluteFill>
  );
}

export const RemotionRoot = {
  component: PraxisVideo,
  fps: FPS,
  durationInFrames: TOTAL_FRAMES,
  width: 1920,
  height: 1080,
  id: "PraxisVideo",
};
