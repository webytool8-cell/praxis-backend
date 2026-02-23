import { GraphNodeData, Template } from "@/types/graph";

interface ExportPayload {
  template: Template;
  summary: string;
  selectedNode: GraphNodeData | null;
  graphElementId: string;
}

export async function exportDashboardPdf(payload: ExportPayload) {
  const graph = document.getElementById(payload.graphElementId);
  const note = payload.selectedNode
    ? `Node: ${payload.selectedNode.label} | Risk: ${payload.selectedNode.metrics.risk}`
    : "Node: none selected";

  // TODO: Replace browser print fallback with pdf-lib/jsPDF report generation once dependency install is guaranteed in target environment.
  const printWindow = window.open("", "_blank", "width=1200,height=900");
  if (!printWindow) return;

  printWindow.document.write(`
    <html>
      <head><title>PRAXIS Report</title></head>
      <body style="font-family: Inter, system-ui, sans-serif; background:#0b0f14; color:#f5f7fa; padding:24px;">
        <h1>PRAXIS Report</h1>
        <p>Template: ${payload.template}</p>
        <p>${payload.summary}</p>
        <p>${note}</p>
        <div style="margin-top:16px; border:1px solid rgba(255,255,255,.12); padding:12px; border-radius:10px;">${
          graph?.outerHTML ?? "Graph snapshot unavailable"
        }</div>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}
