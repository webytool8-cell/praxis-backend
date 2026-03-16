import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Public endpoint - no auth required for viewing/posting comments on shared analyses
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { searchParams } = new URL(req.url);
  const nodeId = searchParams.get("nodeId");

  // Verify analysis is publicly shared
  const analysis = await prisma.analysis.findFirst({
    where: { id: params.id, shareToken: { not: null } },
  });

  if (!analysis) {
    return NextResponse.json({ error: "Not found or not shared" }, { status: 404 });
  }

  const comments = await prisma.nodeComment.findMany({
    where: { analysisId: params.id, ...(nodeId ? { nodeId } : {}) },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ comments });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { nodeId, author, content } = await req.json();

  if (!nodeId || !author?.trim() || !content?.trim()) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Verify analysis is publicly shared
  const analysis = await prisma.analysis.findFirst({
    where: { id: params.id, shareToken: { not: null } },
  });

  if (!analysis) {
    return NextResponse.json({ error: "Not found or not shared" }, { status: 404 });
  }

  const comment = await prisma.nodeComment.create({
    data: {
      analysisId: params.id,
      nodeId,
      author: author.trim().slice(0, 100),
      content: content.trim().slice(0, 2000),
    },
  });

  return NextResponse.json({ comment }, { status: 201 });
}
