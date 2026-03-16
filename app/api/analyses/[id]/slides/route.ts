import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { exportSlides } from "@/lib/exportSlides";
import type { AnalysisGraphData } from "@/types/graph";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const planId = (session.user as any).planId ?? "free";
  if (planId === "free") {
    return NextResponse.json({ error: "Slides export requires Pro or Team plan", upgradeUrl: "/pricing" }, { status: 402 });
  }

  const analysis = await prisma.analysis.findFirst({
    where: { id: params.id, userId: session.user.id },
  });

  if (!analysis) {
    return NextResponse.json({ error: "Analysis not found" }, { status: 404 });
  }

  const blob = await exportSlides(analysis.graphData as unknown as AnalysisGraphData, analysis.name);
  const buffer = Buffer.from(await blob.arrayBuffer());
  const filename = `${analysis.name.replace(/[^a-z0-9]/gi, "-")}-architecture.pptx`;

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
