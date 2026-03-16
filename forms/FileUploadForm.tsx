"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Panel } from "@/components/ui/Panel";
import { UpgradePrompt } from "@/components/ui/UpgradePrompt";
import { usePraxisStore } from "@/store/usePraxisStore";

export function FileUploadForm() {
  const router = useRouter();
  const { setAnalyzing, isAnalyzing } = usePraxisStore();
  const [error, setError] = useState<string | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setAnalyzing(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.status === 402) {
        setShowUpgrade(true);
        return;
      }

      if (!response.ok) {
        setError(data.error ?? "Upload failed. Please try again.");
        return;
      }

      router.push(`/dashboard?analysisId=${data.analysisId}`);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <>
      {showUpgrade && <UpgradePrompt onDismiss={() => setShowUpgrade(false)} />}

      <Panel className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Project Name" name="projectName" placeholder="my-awesome-app" required />
          <Input
            label="Upload Source Files"
            name="files"
            type="file"
            multiple
            required
            // accept common source file types
          />
          <p className="text-xs text-muted">
            Supported: .ts, .tsx, .js, .py, .go, .java, .rs, .rb, .php, .cs and more. Max 50 files / 10MB.
          </p>

          {error && (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
              {error}
            </p>
          )}

          <Button type="submit" disabled={isAnalyzing}>
            {isAnalyzing ? "Analyzing…" : "Start Analysis"}
          </Button>
        </form>
      </Panel>
    </>
  );
}
