import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const analysis = await prisma.analysis.findFirst({
    where: { id: params.id, userId: session.user.id },
  });

  if (!analysis) {
    return NextResponse.json({ error: "Analysis not found" }, { status: 404 });
  }

  const shareToken = analysis.shareToken ?? randomUUID();

  if (!analysis.shareToken) {
    await prisma.analysis.update({
      where: { id: params.id },
      data: { shareToken },
    });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return NextResponse.json({ shareUrl: `${appUrl}/share/${shareToken}` });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const analysis = await prisma.analysis.findFirst({
    where: { id: params.id, userId: session.user.id },
  });

  if (!analysis) {
    return NextResponse.json({ error: "Analysis not found" }, { status: 404 });
  }

  await prisma.analysis.update({
    where: { id: params.id },
    data: { shareToken: null },
  });

  return NextResponse.json({ success: true });
}
