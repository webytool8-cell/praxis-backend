import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const githubToken = (session as any).githubAccessToken as string | undefined;

  if (!githubToken) {
    return NextResponse.json(
      { error: "GitHub access token not found. Please sign out and sign back in." },
      { status: 400 }
    );
  }

  const { searchParams } = new URL(req.url);
  const sort = searchParams.get("sort") ?? "updated";
  const perPage = Math.min(parseInt(searchParams.get("per_page") ?? "50"), 100);

  const res = await fetch(
    `https://api.github.com/user/repos?sort=${sort}&per_page=${perPage}&type=all`,
    {
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    }
  );

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    return NextResponse.json(
      { error: `GitHub API error ${res.status}: ${body.message ?? "unknown"}` },
      { status: res.status }
    );
  }

  const repos = await res.json();

  // Return a slimmed-down list
  const simplified = (Array.isArray(repos) ? repos : []).map((r: any) => ({
    full_name: r.full_name,
    name: r.name,
    owner: r.owner?.login,
    private: r.private,
    language: r.language,
    updated_at: r.updated_at,
    description: r.description,
  }));

  return NextResponse.json({ repos: simplified });
}
