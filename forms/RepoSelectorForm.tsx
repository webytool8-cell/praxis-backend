"use client";

import { FormEvent, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Panel } from "@/components/ui/Panel";
import { UpgradePrompt } from "@/components/ui/UpgradePrompt";
import { usePraxisStore } from "@/store/usePraxisStore";

interface GitHubRepo {
  full_name: string;
  html_url: string;
  private: boolean;
  updated_at: string;
}

export function RepoSelectorForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const { setAnalyzing, isAnalyzing } = usePraxisStore();
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState("");
  const [projectName, setProjectName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);

  // Load repos once session is available
  useEffect(() => {
    const token = (session as any)?.githubAccessToken;
    if (!token) return;

    setLoadingRepos(true);
    fetch("https://api.github.com/user/repos?sort=updated&per_page=50", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data: GitHubRepo[]) => setRepos(Array.isArray(data) ? data : []))
      .catch(() => setRepos([]))
      .finally(() => setLoadingRepos(false));
  }, [session]);

  const handleConnect = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!selectedRepo) {
      setError("Please select a repository.");
      return;
    }

    setAnalyzing(true);

    const formData = new FormData();
    formData.set("projectName", projectName || selectedRepo.split("/")[1]);
    formData.set("repoUrl", `https://github.com/${selectedRepo}`);
    formData.set("sourceType", "repo");

    try {
      const response = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await response.json();

      if (response.status === 402) {
        setShowUpgrade(true);
        return;
      }

      if (!response.ok) {
        setError(data.error ?? "Failed to analyze repository.");
        return;
      }

      router.push(`/dashboard?analysisId=${data.analysisId}`);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  if (!session) {
    return (
      <Panel className="p-6">
        <p className="text-sm text-muted">
          Sign in with GitHub to connect your repositories.
        </p>
        <Button className="mt-4" onClick={() => router.push("/sign-in")}>
          Sign in with GitHub
        </Button>
      </Panel>
    );
  }

  return (
    <>
      {showUpgrade && <UpgradePrompt onDismiss={() => setShowUpgrade(false)} />}

      <Panel className="p-6">
        <form onSubmit={handleConnect} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Select Repository
            </label>
            {loadingRepos ? (
              <p className="text-sm text-muted">Loading your repositories…</p>
            ) : repos.length > 0 ? (
              <select
                value={selectedRepo}
                onChange={(e) => {
                  setSelectedRepo(e.target.value);
                  setProjectName(e.target.value.split("/")[1] ?? "");
                }}
                required
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent"
              >
                <option value="">Choose a repository…</option>
                {repos.map((repo) => (
                  <option key={repo.full_name} value={repo.full_name}>
                    {repo.full_name} {repo.private ? "🔒" : ""}
                  </option>
                ))}
              </select>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-muted">No repositories found via OAuth. Enter manually:</p>
                <Input
                  label="Owner/Repository"
                  placeholder="owner/repo-name"
                  value={selectedRepo}
                  onChange={(e) => setSelectedRepo(e.target.value)}
                  required
                />
              </div>
            )}
          </div>

          <Input
            label="Project Name (optional)"
            placeholder="My Project"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />

          {error && (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
              {error}
            </p>
          )}

          <Button type="submit" disabled={isAnalyzing || !selectedRepo}>
            {isAnalyzing ? "Analyzing…" : "Analyze Repository"}
          </Button>
        </form>
      </Panel>
    </>
  );
}
