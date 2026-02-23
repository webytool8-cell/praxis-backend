"use client";

import { FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
<<<<<<< HEAD
import { Panel } from "@/components/ui/Panel";
=======
<<<<<<< HEAD
import { Panel } from "@/components/ui/Panel";
=======
>>>>>>> main
>>>>>>> main

export function FileUploadForm() {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> main
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
<<<<<<< HEAD
=======
=======
    // TODO: Integrate with upload API endpoint for project archive/files.
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-slate-200 bg-white p-6">
      <Input label="Project Name" name="projectName" placeholder="My Awesome App" required />
      <Input label="Upload Files" name="files" type="file" multiple required />
      <Button type="submit">Start Analysis</Button>
    </form>
>>>>>>> main
>>>>>>> main
  );
}
