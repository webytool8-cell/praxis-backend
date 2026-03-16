import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import type { AnalysisGraphData } from "@/types/graph";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Note: Full Remotion rendering requires a dedicated render server.
// This endpoint generates the narration script and audio,
// then delegates to Remotion bundle/render when server-side rendering is configured.
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const planId = (session.user as any).planId ?? "free";
  if (planId !== "team") {
    return NextResponse.json(
      { error: "Video generation requires the Team plan", upgradeUrl: "/pricing" },
      { status: 402 }
    );
  }

  const analysis = await prisma.analysis.findFirst({
    where: { id: params.id, userId: session.user.id },
  });

  if (!analysis) {
    return NextResponse.json({ error: "Analysis not found" }, { status: 404 });
  }

  const graphData = analysis.graphData as unknown as AnalysisGraphData;
  const componentList = Object.values(graphData.details)
    .map((n) => `${n.name} (${n.type}, risk: ${n.riskScore}/100)`)
    .join(", ");

  // Step 1: Generate narration script via Claude
  const scriptResponse = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `Write a 60-90 second professional narration script for an architecture walkthrough video of "${analysis.name}".

Components: ${componentList}

Overview: ${graphData.aiSummary ?? "A modern software system"}

Structure the script as 5 short paragraphs:
1. Introduction (what this system does)
2. Architecture overview (main components and their roles)
3. Data flow (how data moves through the system)
4. Risk areas (highest risk components and why)
5. Recommendations (top 2-3 improvements)

Keep it concise, professional, and suitable for text-to-speech. No stage directions or markdown.`,
      },
    ],
  });

  const narrationScript = (scriptResponse.content[0] as { text: string }).text.trim();

  // Step 2: Generate audio via OpenAI TTS
  let audioBuffer: Buffer | null = null;
  try {
    const speech = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: narrationScript,
    });
    const arrayBuffer = await speech.arrayBuffer();
    audioBuffer = Buffer.from(arrayBuffer);
  } catch (err) {
    console.error("TTS generation failed:", err);
  }

  // Step 3: Return script + audio for client-side Remotion rendering
  // (Full server-side Remotion rendering requires additional infrastructure)
  if (audioBuffer) {
    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": `attachment; filename="${analysis.name.replace(/[^a-z0-9]/gi, "-")}-narration.mp3"`,
        "X-Narration-Script": encodeURIComponent(narrationScript),
      },
    });
  }

  // Fallback: return the script as text if audio generation failed
  return new NextResponse(narrationScript, {
    headers: {
      "Content-Type": "text/plain",
      "Content-Disposition": `attachment; filename="${analysis.name.replace(/[^a-z0-9]/gi, "-")}-script.txt"`,
    },
  });
}
