import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { canRunAnalysis, ensureSubscriptionRecord } from "@/lib/subscription";
import { analyzeCodebase, type FileContent } from "@/lib/analyzeCodebase";
import { fetchRepoFiles } from "@/lib/fetchRepoFiles";
import { runSecurityScan } from "@/lib/securityScan";

const ALLOWED_EXTENSIONS = new Set([
  ".ts", ".tsx", ".js", ".jsx", ".mjs",
  ".py", ".go", ".java", ".rs", ".rb", ".php", ".cs",
  ".swift", ".kt", ".scala", ".c", ".cpp", ".h",
  ".html", ".css", ".scss",
]);

const MAX_TOTAL_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  // Ensure subscription record exists
  await ensureSubscriptionRecord(userId);

  // Check usage limits
  const { allowed, reason, upgradeUrl } = await canRunAnalysis(userId);
  if (!allowed) {
    return NextResponse.json({ error: reason, upgradeUrl }, { status: 402 });
  }

  let files: FileContent[] = [];
  let projectName = "Untitled Project";
  let sourceType: "upload" | "repo" = "upload";
  let repoUrl: string | undefined;

  const contentType = req.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await req.formData();
    projectName = (formData.get("projectName") as string) || "Untitled Project";
    const repoUrlField = formData.get("repoUrl") as string | null;

    if (repoUrlField) {
      // GitHub repo analysis
      sourceType = "repo";
      repoUrl = repoUrlField;

      const match = repoUrlField.match(/github\.com\/([^/]+)\/([^/]+)/);
      if (!match) {
        return NextResponse.json({ error: "Invalid GitHub URL" }, { status: 400 });
      }

      const githubToken = (session as any).githubAccessToken;
      if (!githubToken) {
        return NextResponse.json({ error: "GitHub access token not available. Please sign in with GitHub." }, { status: 400 });
      }

      try {
        files = await fetchRepoFiles(match[1], match[2].replace(/\.git$/, ""), githubToken);
      } catch (err) {
        return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to fetch repository" }, { status: 400 });
      }
    } else {
      // File upload analysis
      sourceType = "upload";
      const uploadedFiles = formData.getAll("files") as File[];

      if (!uploadedFiles.length) {
        return NextResponse.json({ error: "No files provided" }, { status: 400 });
      }

      let totalSize = 0;
      for (const file of uploadedFiles.slice(0, 50)) {
        const ext = "." + file.name.split(".").pop()?.toLowerCase();
        if (!ALLOWED_EXTENSIONS.has(ext)) continue;
        if (file.name.includes("node_modules") || file.name.includes(".git/")) continue;

        totalSize += file.size;
        if (totalSize > MAX_TOTAL_SIZE) break;

        try {
          const content = await file.text();
          files.push({ name: file.name, content });
        } catch {
          // Skip unreadable files
        }
      }
    }
  } else {
    // JSON body (for programmatic use)
    const body = await req.json();
    projectName = body.projectName ?? "Untitled Project";
    files = body.files ?? [];
    sourceType = body.sourceType ?? "upload";
    repoUrl = body.repoUrl;
  }

  if (files.length === 0) {
    return NextResponse.json({ error: "No analyzable source files found" }, { status: 400 });
  }

  try {
    // Run analysis in parallel with security scan
    const [graphData, securityFindings] = await Promise.all([
      analyzeCodebase(files, projectName),
      runSecurityScan(files),
    ]);

    // Merge security findings into graphData
    graphData.securityFindings = securityFindings;

    const analysis = await prisma.analysis.create({
      data: {
        userId,
        name: projectName,
        sourceType,
        repoUrl,
        graphData: graphData as any,
        securityScan: securityFindings as any,
        aiSummary: graphData.aiSummary,
      },
    });

    return NextResponse.json({ analysisId: analysis.id });
  } catch (err) {
    console.error("Analysis failed:", err);
    return NextResponse.json({ error: "Analysis failed. Please try again." }, { status: 500 });
  }
}
