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
<<<<<<< HEAD
import { Panel } from "@/components/ui/Panel";
=======
>>>>>>> main
>>>>>>> main
>>>>>>> main

export function RepoSelectorForm() {
  const handleConnect = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> main
>>>>>>> main
    // TODO: Trigger GitHub OAuth and repository discovery APIs from PRAXIS backend.
  };

  return (
    <Panel className="p-6">
      <form onSubmit={handleConnect} className="space-y-4">
        <Input label="GitHub Organization / User" placeholder="webytool8-cell" required />
        <Input label="Repository Name" placeholder="praxis-backend" required />
        <div className="flex gap-3">
          <Button type="submit">Connect with GitHub</Button>
          <Button type="button" variant="secondary">
            Load Repositories
          </Button>
        </div>
        <p className="text-xs text-muted">OAuth status + repo list will appear here after integration.</p>
      </form>
    </Panel>
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
=======
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
>>>>>>> main
>>>>>>> main
>>>>>>> main
  );
}
