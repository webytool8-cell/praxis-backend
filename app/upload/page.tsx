import { Panel } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";

export default function UploadPage() {
  return (
    <section className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-2xl font-semibold">Upload Project</h1>
      <Panel className="space-y-4 p-6">
        <div className="grid h-40 place-items-center rounded-xl border border-dashed border-[rgb(var(--line-1))] bg-white/5 text-sm text-text1">
          Drag & drop ZIP here
        </div>
        <p className="text-xs text-text2">Supported: TypeScript, JavaScript, Python, Go.</p>
        <Button variant="primary">Analyze</Button>
      </Panel>
    </section>
  );
}
