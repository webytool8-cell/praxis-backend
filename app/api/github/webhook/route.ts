import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { prisma } from "@/lib/prisma";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function verifySignature(body: string, signature: string | null): boolean {
  if (!signature || !process.env.GITHUB_WEBHOOK_SECRET) return false;

  const hmac = createHmac("sha256", process.env.GITHUB_WEBHOOK_SECRET);
  const digest = "sha256=" + hmac.update(body).digest("hex");

  try {
    return timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("x-hub-signature-256");
  const event = req.headers.get("x-github-event");

  if (!verifySignature(body, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const payload = JSON.parse(body);

  if (event !== "pull_request") {
    return NextResponse.json({ ok: true });
  }

  const action = payload.action as string;
  if (action !== "opened" && action !== "synchronize") {
    return NextResponse.json({ ok: true });
  }

  const repo = payload.repository?.full_name as string;
  const prNumber = payload.number as number;
  const installationToken = await getInstallationToken(payload.installation?.id);

  if (!installationToken) {
    return NextResponse.json({ error: "Installation not found" }, { status: 404 });
  }

  // Find the user who owns this repo
  const repoAnalysis = await prisma.analysis.findFirst({
    where: {
      repoUrl: { contains: repo },
      user: {
        subscription: { planId: "team", status: "active" },
      },
    },
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  if (!repoAnalysis) {
    return NextResponse.json({ ok: true, message: "No matching analysis found" });
  }

  // Fetch PR diff
  const diffRes = await fetch(`https://api.github.com/repos/${repo}/pulls/${prNumber}/files`, {
    headers: {
      Authorization: `Bearer ${installationToken}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!diffRes.ok) {
    return NextResponse.json({ error: "Failed to fetch PR files" }, { status: 500 });
  }

  const changedFiles = await diffRes.json();
  const changedFileNames = changedFiles.map((f: any) => f.filename).slice(0, 20);

  // Analyze impact via Claude
  const graphData = repoAnalysis.graphData as any;
  const componentList = Object.values(graphData.details ?? {})
    .map((n: any) => `${n.name} (${n.type})`)
    .join(", ");

  const impactResponse = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 512,
    messages: [
      {
        role: "user",
        content: `A PR is changing these files: ${changedFileNames.join(", ")}

The system has these components: ${componentList}

Briefly identify:
1. Which components are affected (1 line)
2. Any coupling or risk concerns introduced (1-2 lines)
3. One recommendation

Keep response under 100 words. Be specific and actionable.`,
      },
    ],
  });

  const impact = (impactResponse.content[0] as { text: string }).text.trim();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://praxis.app";

  // Post comment on PR
  const commentBody = `## 🔍 PRAXIS Architecture Review

${impact}

[View full impact map](${appUrl}/dashboard?analysisId=${repoAnalysis.id}) · *Powered by [PRAXIS](${appUrl})*`;

  await fetch(`https://api.github.com/repos/${repo}/issues/${prNumber}/comments`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${installationToken}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ body: commentBody }),
  });

  return NextResponse.json({ ok: true });
}

async function getInstallationToken(installationId: number | undefined): Promise<string | null> {
  if (!installationId || !process.env.GITHUB_APP_ID || !process.env.GITHUB_APP_PRIVATE_KEY) {
    return null;
  }

  try {
    const { createAppAuth } = await import("@octokit/auth-app");
    const auth = createAppAuth({
      appId: process.env.GITHUB_APP_ID,
      privateKey: process.env.GITHUB_APP_PRIVATE_KEY.replace(/\\n/g, "\n"),
    });

    const { token } = await auth({ type: "installation", installationId });
    return token;
  } catch {
    return null;
  }
}
