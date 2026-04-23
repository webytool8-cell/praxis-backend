"use client";

import { FormEvent, useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { UpgradePrompt } from "@/components/ui/UpgradePrompt";
import { usePraxisStore } from "@/store/usePraxisStore";

interface GitHubRepo {
  full_name: string;
  name: string;
  owner: string;
  private: boolean;
  language: string | null;
  updated_at: string;
  description: string | null;
}

const LANG_COLORS: Record<string, string> = {
  TypeScript: "bg-blue-500/15 text-blue-300",
  JavaScript: "bg-yellow-500/15 text-yellow-300",
  Python: "bg-green-500/15 text-green-300",
  Go: "bg-cyan-500/15 text-cyan-300",
  Rust: "bg-orange-500/15 text-orange-300",
  Java: "bg-red-500/15 text-red-300",
  Ruby: "bg-red-500/15 text-red-300",
  "C#": "bg-violet-500/15 text-violet-300",
  PHP: "bg-indigo-500/15 text-indigo-300",
  Swift: "bg-orange-500/15 text-orange-300",
  Kotlin: "bg-purple-500/15 text-purple-300",
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const d = Math.floor(diff / 86400000);
  if (d === 0) return "today";
  if (d === 1) return "yesterday";
  if (d < 30) return `${d}d ago`;
  if (d < 365) return `${Math.floor(d / 30)}mo ago`;
  return `${Math.floor(d / 365)}y ago`;
}

export default function ConnectPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { setAnalyzing, isAnalyzing } = usePraxisStore();

  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedRepo, setSelectedRepo] = useState("");
  const [projectName, setProjectName] = useState("");
  const [uploadExpanded, setUploadExpanded] = useState(false);
  const [uploadName, setUploadName] = useState("");
  const [uploadFiles, setUploadFiles] = useState<FileList | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);

  useEffect(() => {
    if (!session) return;
    setLoadingRepos(true);
    fetch("/api/github/repos?sort=updated&per_page=100")
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw new Error(d.error ?? `HTTP ${r.status}`);
        setRepos(Array.isArray(d.repos) ? d.repos : []);
      })
      .catch((err) => setError(`Could not load repositories: ${err.message}`))
      .finally(() => setLoadingRepos(false));
  }, [session]);

  const filtered = repos.filter((r) =>
    r.full_name.toLowerCase().includes(search.toLowerCase()) ||
    (r.description ?? "").toLowerCase().includes(search.toLowerCase())
  );

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

  const selectedRepoObj = repos.find((r) => r.full_name === selectedRepo);

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
              <p className="text-xs text-muted">Recommended · Public and private repos</p>
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
                <Button onClick={() => signIn("github", { callbackUrl: "/repo" })} className="flex items-center gap-2">
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
              <form onSubmit={submitRepo} className="space-y-4">

                {/* Search */}
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder={`Search ${repos.length} repositories…`}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-lg border border-slate-700/60 bg-slate-900/60 pl-8 pr-3 py-2 text-sm text-white placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>

                {/* Repo list */}
                <div className="rounded-lg border border-slate-700/50 overflow-hidden">
                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-800/60">
                    {filtered.length === 0 ? (
                      <div className="px-4 py-6 text-center text-sm text-muted">
                        {search ? "No repositories match your search." : "No repositories found."}
                      </div>
                    ) : (
                      filtered.map((r) => {
                        const isSelected = selectedRepo === r.full_name;
                        const langColor = r.language ? (LANG_COLORS[r.language] ?? "bg-slate-500/15 text-slate-400") : null;
                        return (
                          <button
                            key={r.full_name}
                            type="button"
                            onClick={() => {
                              setSelectedRepo(r.full_name);
                              setProjectName(r.name);
                            }}
                            className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
                              isSelected
                                ? "bg-accent/10 border-l-2 border-l-accent"
                                : "hover:bg-slate-800/40 border-l-2 border-l-transparent"
                            }`}
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`text-sm font-medium truncate ${isSelected ? "text-accent" : "text-slate-200"}`}>
                                  {r.name}
                                </span>
                                {r.private && (
                                  <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded-full bg-slate-700/60 text-slate-400 border border-slate-700/60">
                                    Private
                                  </span>
                                )}
                                {langColor && (
                                  <span className={`shrink-0 text-[10px] px-1.5 py-0.5 rounded-full ${langColor}`}>
                                    {r.language}
                                  </span>
                                )}
                              </div>
                              {r.description && (
                                <p className="text-xs text-muted truncate mt-0.5">{r.description}</p>
                              )}
                            </div>
                            <span className="shrink-0 text-[10px] text-muted tabular-nums">{timeAgo(r.updated_at)}</span>
                            {isSelected && (
                              <svg className="shrink-0 w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Selected summary + project name */}
                {selectedRepoObj && (
                  <div className="rounded-lg border border-accent/20 bg-accent/5 px-4 py-3 space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <svg className="w-3.5 h-3.5 text-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                      <span className="text-slate-300 font-mono text-xs truncate">{selectedRepo}</span>
                    </div>
                    <div>
                      <label className="block text-xs text-muted mb-1">Project name</label>
                      <input
                        type="text"
                        placeholder={selectedRepoObj.name}
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        className="w-full rounded-md border border-slate-700/60 bg-slate-900/60 px-3 py-1.5 text-sm text-white placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent"
                      />
                    </div>
                  </div>
                )}

                {error && (
                  <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
                    {error}
                  </p>
                )}

                <Button type="submit" disabled={isAnalyzing || !selectedRepo} className="w-full">
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
                <p className="text-xs text-muted">Select or drag-and-drop project files</p>
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
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Source Files</label>
                  <input
                    name="files"
                    type="file"
                    multiple
                    required
                    onChange={(e) => {
                      const files = e.target.files;
                      setUploadFiles(files);
                      if (files && files.length > 0) {
                        const first = files[0].name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
                        setUploadName(first);
                      }
                    }}
                    className="w-full rounded-lg border border-slate-700/60 bg-slate-900/60 px-3 py-2 text-sm text-slate-300 file:mr-3 file:rounded-md file:border-0 file:bg-accent/20 file:px-3 file:py-1 file:text-xs file:text-accent file:cursor-pointer focus:outline-none"
                  />
                  <p className="mt-1.5 text-xs text-muted">.ts .tsx .js .py .go .java .rs and more · Max 50 files / 10 MB</p>
                </div>

                {uploadFiles && uploadFiles.length > 0 && (
                  <div className="rounded-lg border border-slate-700/40 bg-slate-900/40 px-4 py-3 space-y-2 animate-fadeIn">
                    <div className="flex items-center gap-2 text-xs text-muted">
                      <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {uploadFiles.length} file{uploadFiles.length !== 1 ? "s" : ""} selected
                    </div>
                    <div>
                      <label className="block text-xs text-muted mb-1">Project name</label>
                      <input
                        name="projectName"
                        value={uploadName}
                        onChange={(e) => setUploadName(e.target.value)}
                        required
                        className="w-full rounded-md border border-slate-700/60 bg-slate-900/60 px-3 py-1.5 text-sm text-white placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent"
                      />
                    </div>
                  </div>
                )}

                {error && (
                  <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
                    {error}
                  </p>
                )}
                <Button type="submit" variant="secondary" disabled={isAnalyzing || !uploadFiles?.length} className="w-full">
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
