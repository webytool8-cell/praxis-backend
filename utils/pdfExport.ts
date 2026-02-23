import jsPDF from "jspdf";
import { toPng } from "html-to-image";
import { GraphNodeDetails, ViewTemplate } from "@/types/graph";

interface ExportPayload {
  template: ViewTemplate;
  summary: string;
  selectedNode: GraphNodeDetails | null;
  graphElementId: string;
}

export async function exportDashboardPdf(payload: ExportPayload) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  doc.setFillColor(11, 15, 20);
  doc.rect(0, 0, 595, 842, "F");

  doc.setTextColor(229, 231, 235);
  doc.setFontSize(20);
  doc.text("PRAXIS System Report", 40, 50);

  doc.setFontSize(11);
  doc.setTextColor(148, 163, 184);
  doc.text(`Template: ${payload.template}`, 40, 74);
  doc.text(`Summary: ${payload.summary}`, 40, 94, { maxWidth: 520 });

  const element = document.getElementById(payload.graphElementId);
  if (element) {
    const imageData = await toPng(element, { pixelRatio: 2, backgroundColor: "#0B0F14" });
    doc.addImage(imageData, "PNG", 40, 120, 515, 290);
  }

  doc.setTextColor(229, 231, 235);
  doc.setFontSize(14);
  doc.text("Risk + Metrics", 40, 440);
  doc.setFontSize(11);

  const node = payload.selectedNode;
  if (node) {
    doc.text(`Node: ${node.name}`, 40, 465);
    doc.text(`Risk Score: ${node.riskScore}`, 40, 485);
    doc.text(`LOC: ${node.metrics.loc} | Imports: ${node.metrics.imports}`, 40, 505);
    doc.text(`Dependencies: ${node.dependencies.join(", ") || "None"}`, 40, 525, { maxWidth: 520 });
  } else {
    doc.text("Select a node in PRAXIS to enrich this report with module-level metrics.", 40, 465, {
      maxWidth: 520,
    });
  }

  // TODO: Pull full architecture summary + risk analysis from PRAXIS backend analysis endpoints.
  doc.save(`praxis-${payload.template}-report.pdf`);
}
