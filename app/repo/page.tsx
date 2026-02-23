import { Panel } from "@/components/ui/Panel";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function RepoPage() {
  return (
    <section className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-2xl font-semibold">Connect GitHub</h1>
      <Panel className="space-y-4 p-6">
        <Button variant="primary">Connect GitHub OAuth</Button>
        <Input label="Search repositories" placeholder="praxis" />
        <Input label="Branch" placeholder="main" />
        <div className="rounded-xl border border-[rgb(var(--line-1))] bg-white/5 p-3 text-sm text-text1">
          Recent repos will appear here.
        </div>
      </Panel>
    </section>
  );
}
