import { RepoSelectorForm } from "@/forms/RepoSelectorForm";

export default function RepoPage() {
  return (
    <section className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-semibold">Connect GitHub Repository</h1>
      <p className="text-sm text-slate-600">
        Authenticate with GitHub and select a repository to analyze.
      </p>
      <RepoSelectorForm />
    </section>
  );
}
