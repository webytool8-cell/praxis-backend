import { FileUploadForm } from "@/forms/FileUploadForm";

export default function UploadPage() {
  return (
    <section className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-semibold text-slate-100">Upload Project Files</h1>
      <p className="text-sm text-muted">Submit source files for PRAXIS architecture analysis.</p>
      <FileUploadForm />
    </section>
  );
}
