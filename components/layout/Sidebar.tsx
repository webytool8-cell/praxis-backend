import Link from "next/link";
<<<<<<< HEAD
import { Panel } from "@/components/ui/Panel";
=======
<<<<<<< HEAD
import { Panel } from "@/components/ui/Panel";
=======
>>>>>>> main
>>>>>>> main

const dashboardLinks = [
  { href: "/dashboard", label: "System Map" },
  { href: "/upload", label: "Upload Files" },
  { href: "/repo", label: "Connect Repo" },
];

export function Sidebar() {
  return (
<<<<<<< HEAD
    <Panel className="h-full p-3">
      <p className="px-2 pb-3 pt-1 text-xs uppercase tracking-[0.2em] text-muted">Workspace</p>
      <ul className="space-y-1">
=======
<<<<<<< HEAD
    <Panel className="h-full p-3">
      <p className="px-2 pb-3 pt-1 text-xs uppercase tracking-[0.2em] text-muted">Workspace</p>
      <ul className="space-y-1">
=======
    <aside className="h-full rounded-lg border border-slate-200 bg-white p-4">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
        Dashboard
      </h2>
      <ul className="space-y-2">
>>>>>>> main
>>>>>>> main
        {dashboardLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
<<<<<<< HEAD
              className="block rounded-lg px-3 py-2 text-sm text-slate-300 transition duration-300 hover:bg-slate-800/70 hover:text-white"
=======
<<<<<<< HEAD
              className="block rounded-lg px-3 py-2 text-sm text-slate-300 transition duration-300 hover:bg-slate-800/70 hover:text-white"
=======
              className="block rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
>>>>>>> main
>>>>>>> main
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
<<<<<<< HEAD
    </Panel>
=======
<<<<<<< HEAD
    </Panel>
=======
    </aside>
>>>>>>> main
>>>>>>> main
  );
}
