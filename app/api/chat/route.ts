import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { AnalysisGraphData } from "@/types/graph";

const getAnthropic = () => new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Plan check disabled
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

  const graphData = analysis.graphData as unknown as AnalysisGraphData;
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

  const systemPrompt = `You are an intelligent assistant inside Praksys, analyzing the "${analysis.name}" codebase.

Your primary goal is to transform complexity into clarity. Convert complex, technical, or abstract information about this codebase into clear, structured, human-readable explanations that feel effortless to read while preserving depth and accuracy.

## Codebase Context

Architecture Overview:
${graphData.aiSummary ?? "No summary available."}

Components:
${componentSummary}

---

## Output Style

- Short paragraphs (2–4 lines max). No dense blocks of text.
- Use headings when helpful to separate ideas.
- Use bullet points only when they genuinely improve clarity — not as a default.
- Translate jargon into plain language. If a technical term is necessary, explain it briefly.
- Start simple, then add depth, then add advanced insight if useful.

## Tone

Calm. Clear. Intelligent. Grounded.

Be precise, not verbose. Be insightful, not abstract. Avoid filler. Avoid repetition.

## Final Check

Before every response ask: "Can someone unfamiliar with this topic understand this easily?"

Reference specific components by name. If asked about risks or improvements, be specific and actionable.`;

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
        const response = await getAnthropic().messages.create({
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
