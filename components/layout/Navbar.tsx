import Link from "next/link";

const navItems = [
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
  { href: "/", label: "Home" },
>>>>>>> main
>>>>>>> main
  { href: "/dashboard", label: "Dashboard" },
  { href: "/upload", label: "Upload" },
  { href: "/repo", label: "Repository" },
];

export function Navbar() {
  return (
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> main
    <header className="sticky top-0 z-20 border-b border-slate-800/80 bg-bg/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold tracking-wider text-slate-100">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-accent shadow-glow" />
          PRAXIS
        </Link>
        <nav className="flex items-center gap-2 text-sm text-slate-300">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 transition duration-300 hover:bg-slate-800/70 hover:text-white"
            >
<<<<<<< HEAD
=======
=======
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="text-xl font-bold tracking-tight text-brand">
          PRAXIS
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium text-slate-700">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-brand">
>>>>>>> main
>>>>>>> main
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
