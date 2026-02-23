"use client";

import { FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function RepoSelectorForm() {
  const handleConnect = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: Trigger GitHub OAuth flow and save connected repository selection.
  };

  return (
    <form
      onSubmit={handleConnect}
      className="space-y-4 rounded-lg border border-slate-200 bg-white p-6"
    >
      <Input label="GitHub Organization / User" placeholder="openai" required />
      <Input label="Repository Name" placeholder="praxis-backend" required />
      <div className="flex gap-3">
        <Button type="submit">Connect with GitHub</Button>
        <Button type="button" variant="secondary">
          Load Repositories
        </Button>
      </div>
      {/* TODO: Populate repository dropdown and OAuth status from backend auth/session APIs. */}
    </form>
  );
}
