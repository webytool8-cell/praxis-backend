"use client";

import { FormEvent, useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { UpgradePrompt } from "@/components/ui/UpgradePrompt";
import { usePraxisStore } from "@/store/usePraxisStore";

interface GitHubRepo {
  full_name: string;
  name: string;
  private: boolean;
  language: string | null;
  updated_at: string;
  description: string | null;
}

export default function ConnectPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { setAnalyzing, isAnalyzing } = usePraxisStore();

  // GitHub repos
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState("");
  const [projectName, setProjectName] = useState("");

  // File upload
  const [uploadExpanded, setUploadExpanded] = useState(false);

  // Shared
  const [error, setError] = useState<string | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);

  useEffect(() => {
    if (!session) return;
    setLoadingRepos(true);
    fetch("/api/github/repos?sort=updated&per_page=50")
      .then((r) => r.json())
      .then((d) => setRepos(Array.isArray(d.repos) ? d.repos : []))
      .catch(() => setRepos([]))
      .finally(() => setLoadingRepos(false));
  }, [session]);

  const submitRepo = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedRepo) return;
    setError(null);
    setAnalyzing(true);
    const fd = new FormData();
    fd.set("projectName", projectName || selectedRepo.split("/")[1]);
    fd.set("repoUrl", `https://github.com/${selectedRepo}`);
    fd.set("sourceType", "repo");
    await submit(fd);
  };

  const submitFiles = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setAnalyzing(false);
    setAnalyzing(true);
    const fd = new FormData(e.currentTarget as HTMLFormElement);
    await submit(fd);
  };

  const submit = async (fd: FormData) => {
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.status === 402) { setShowUpgrade(true); return; }
      if (!res.ok) { setError(data.error ?? "Analysis failed. Please try again."); return; }
      router.push(`/dashboard?analysisId=${data.analysisId}`);
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <>
      {showUpgrade && <UpgradePrompt onDismiss={() => setShowUpgrade(false)} />}

      <div className="mx-auto max-w-xl py-4 space-y-3">

        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-white">Connect Project</h1>
          <p className="mt-1 text-sm text-muted">
            Analyze your codebase and generate an interactive system map.
          </p>
        </div>

        {/* ── Primary: GitHub ── */}
        <div className="rounded-xl border border-slate-800/80 bg-panel/60 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-800/60 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800">
              <svg className="w-4 h-4 text-slate-200" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-white">GitHub Repository</p>
              <p className="text-xs text-muted">Recommended · Access public and private repos</p>
            </div>
          </div>

          <div className="px-5 py-5">
            {status === "loading" ? (
              <p className="text-sm text-muted">Loading…</p>

            ) : !session ? (
              <div className="space-y-3">
                <p className="text-sm text-slate-400">
                  Sign in with GitHub to automatically load your repositories.
                  Read-only access — we never push code.
                </p>
                <Button
                  onClick={() => signIn("github", { callbackUrl: "/repo" })}
                  className="flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                  </svg>
                  Sign in with GitHub
                </Button>
              </div>

            ) : loadingRepos ? (
              <div className="flex items-center gap-2 text-sm text-muted py-2">
                <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                Loading your repositories…
              </div>

            ) : (
              <form onSubmit={submitRepo} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Repository</label>
                  {repos.length > 0 ? (
                    <select
                      value={selectedRepo}
                      onChange={(e) => {
                        setSelectedRepo(e.target.value);
                        setProjectName(e.target.value.split("/")[1] ?? "");
                      }}
                      required
                      className="w-full rounded-lg border border-slate-700/60 bg-slate-900/60 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent"
                    >
                      <option value="">Choose a repository…</option>
                      {repos.map((r) => (
                        <option key={r.full_name} value={r.full_name}>
                          {r.full_name}{r.private ? " 🔒" : ""}{r.language ? ` · ${r.language}` : ""}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <Input
                      placeholder="owner/repo-name"
                      value={selectedRepo}
                      onChange={(e) => setSelectedRepo(e.target.value)}
                      required
                    />
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">
                    Project Name <span className="text-muted font-normal">(optional)</span>
                  </label>
                  <Input
                    placeholder={selectedRepo.split("/")[1] || "my-project"}
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                  />
                </div>

                {error && (
                  <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
                    {error}
                  </p>
                )}

                <Button type="submit" disabled={isAnalyzing || !selectedRepo}>
                  {isAnalyzing ? "Analyzing…" : "Analyze Repository"}
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="flex items-center gap-3 py-1">
          <div className="flex-1 h-px bg-slate-800/80" />
          <span className="text-xs text-muted">or</span>
          <div className="flex-1 h-px bg-slate-800/80" />
        </div>

        {/* ── Secondary: File Upload ── */}
        <div className="rounded-xl border border-slate-800/60 overflow-hidden">
          <button
            type="button"
            onClick={() => setUploadExpanded(!uploadExpanded)}
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-800/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800/80">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-300">Upload Files</p>
                <p className="text-xs text-muted">Drag-and-drop or select project files</p>
              </div>
            </div>
            <svg
              className={`w-4 h-4 text-muted transition-transform duration-200 ${uploadExpanded ? "rotate-180" : ""}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {uploadExpanded && (
            <div className="border-t border-slate-800/60 px-5 py-4 animate-fadeIn">
              <form onSubmit={submitFiles} className="space-y-3">
                <Input label="Project Name" name="projectName" placeholder="my-project" required />
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Source Files</label>
                  <input
                    name="files"
                    type="file"
                    multiple
                    required
                    className="w-full rounded-lg border border-slate-700/60 bg-slate-900/60 px-3 py-2 text-sm text-slate-300 file:mr-3 file:rounded-md file:border-0 file:bg-accent/20 file:px-3 file:py-1 file:text-xs file:text-accent file:cursor-pointer focus:outline-none"
                  />
                  <p className="mt-1.5 text-xs text-muted">
                    .ts .tsx .js .py .go .java .rs and more · Max 50 files / 10 MB
                  </p>
                </div>

                {error && (
                  <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
                    {error}
                  </p>
                )}

                <Button type="submit" variant="secondary" disabled={isAnalyzing}>
                  {isAnalyzing ? "Analyzing…" : "Upload & Analyze"}
                </Button>
              </form>
            </div>
          )}
        </div>

      </div>
    </>
  );
}
