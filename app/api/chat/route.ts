import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { AnalysisGraphData } from "@/types/graph";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check Pro/Team plan
  const planId = (session.user as any).planId ?? "free";
  if (planId === "free") {
    return NextResponse.json(
      { error: "AI Chat requires a Pro or Team plan", upgradeUrl: "/pricing" },
      { status: 402 }
    );
  }

  const { analysisId, message } = await req.json();

  if (!analysisId || !message) {
    return NextResponse.json({ error: "Missing analysisId or message" }, { status: 400 });
  }

  // Verify ownership
  const analysis = await prisma.analysis.findFirst({
    where: { id: analysisId, userId: session.user.id },
  });

  if (!analysis) {
    return NextResponse.json({ error: "Analysis not found" }, { status: 404 });
  }

  // Get recent chat history
  const history = await prisma.chatMessage.findMany({
    where: { analysisId },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const graphData = analysis.graphData as AnalysisGraphData;
  const componentSummary = Object.values(graphData.details)
    .map((n) => `- ${n.name} (${n.type}): risk ${n.riskScore}/100, ${n.description}`)
    .join("\n");

  // Save user message
  await prisma.chatMessage.create({
    data: {
      userId: session.user.id,
      analysisId,
      role: "user",
      content: message,
    },
  });

  const systemPrompt = `You are an expert software architect assistant for PRAXIS, analyzing the "${analysis.name}" codebase.

Architecture Overview:
${graphData.aiSummary ?? "No summary available."}

Components:
${componentSummary}

Answer questions about this codebase accurately and concisely. Reference specific components by name when relevant. If asked about risks or improvements, be specific and actionable.`;

  const messages = [
    ...history
      .reverse()
      .slice(0, -1) // exclude the message we just saved
      .map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
    { role: "user" as const, content: message },
  ];

  // Stream the response
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let fullContent = "";

      try {
        const response = await anthropic.messages.create({
          model: "claude-sonnet-4-6",
          max_tokens: 1024,
          system: systemPrompt,
          messages,
          stream: true,
        });

        for await (const event of response) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            const text = event.delta.text;
            fullContent += text;
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
          }
        }

        // Save assistant response
        await prisma.chatMessage.create({
          data: {
            userId: session.user.id,
            analysisId,
            role: "assistant",
            content: fullContent,
          },
        });

        controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
      } catch (err) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: "Stream failed" })}\n\n`));
      } finally {
        controller.close();
      }
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
