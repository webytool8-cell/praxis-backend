import { FileUploadForm } from "@/forms/FileUploadForm";

export default function UploadPage() {
  return (
    <section className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-semibold">Upload Project Files</h1>
      <p className="text-sm text-slate-600">
        Submit source files for analysis to generate a PRAXIS system map.
      </p>
      <FileUploadForm />
    </section>
  );
}
