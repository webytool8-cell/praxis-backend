"use client";

import { FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Panel } from "@/components/ui/Panel";

export function FileUploadForm() {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: Integrate with backend upload endpoint and trigger asynchronous analysis job.
  };

  return (
    <Panel className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Project Name" name="projectName" placeholder="praxis-app" required />
        <Input label="Upload Files" name="files" type="file" multiple required />
        <Button type="submit">Start Analysis</Button>
      </form>
    </Panel>
  );
}
