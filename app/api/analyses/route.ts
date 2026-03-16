import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "10", 10), 50);
  const skip = (page - 1) * limit;

  const [analyses, total] = await Promise.all([
    prisma.analysis.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        sourceType: true,
        repoUrl: true,
        aiSummary: true,
        shareToken: true,
        createdAt: true,
        // Don't return full graphData in list view
      },
    }),
    prisma.analysis.count({ where: { userId: session.user.id } }),
  ]);

  return NextResponse.json({ analyses, total, page, limit });
}
