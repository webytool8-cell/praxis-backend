import Link from "next/link";

const dashboardLinks = [
  { href: "/dashboard", label: "System Map" },
  { href: "/upload", label: "Upload Files" },
  { href: "/repo", label: "Connect Repo" },
];

export function Sidebar() {
  return (
    <aside className="h-full rounded-lg border border-slate-200 bg-white p-4">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
        Dashboard
      </h2>
      <ul className="space-y-2">
        {dashboardLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="block rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
