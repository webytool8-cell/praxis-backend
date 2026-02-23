import { FileUploadForm } from "@/forms/FileUploadForm";

export default function UploadPage() {
  return (
    <section className="mx-auto max-w-2xl space-y-4">
<<<<<<< HEAD
      <h1 className="text-2xl font-semibold text-slate-100">Upload Project Files</h1>
      <p className="text-sm text-muted">Submit source files for PRAXIS architecture analysis.</p>
=======
      <h1 className="text-2xl font-semibold">Upload Project Files</h1>
      <p className="text-sm text-slate-600">
        Submit source files for analysis to generate a PRAXIS system map.
      </p>
>>>>>>> codex/generate-next.js-project-structure-for-praxis
      <FileUploadForm />
    </section>
  );
}
