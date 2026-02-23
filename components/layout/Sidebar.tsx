import Link from "next/link";
import { Panel } from "@/components/ui/Panel";

const dashboardLinks = [
  { href: "/dashboard", label: "System Map" },
  { href: "/upload", label: "Upload Files" },
  { href: "/repo", label: "Connect Repo" },
];

export function Sidebar() {
  return (
    <Panel className="h-full p-3">
      <p className="px-2 pb-3 pt-1 text-xs uppercase tracking-[0.2em] text-muted">Workspace</p>
      <ul className="space-y-1">
        {dashboardLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="block rounded-lg px-3 py-2 text-sm text-slate-300 transition duration-300 hover:bg-slate-800/70 hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
