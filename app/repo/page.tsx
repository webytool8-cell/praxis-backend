import { RepoSelectorForm } from "@/forms/RepoSelectorForm";

export default function RepoPage() {
  return (
    <section className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-semibold text-slate-100">Connect GitHub Repository</h1>
      <p className="text-sm text-muted">Authenticate and select a repository to analyze.</p>
      <RepoSelectorForm />
    </section>
  );
}
