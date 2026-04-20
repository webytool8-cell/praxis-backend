"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { usePraxisStore } from "@/store/usePraxisStore";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/upload", label: "Upload" },
  { href: "/repo", label: "Repository" },
  { href: "/pricing", label: "Pricing" },
];

const PLAN_BADGE: Record<string, { label: string; className: string }> = {
  free: { label: "Free", className: "text-muted bg-white/5" },
  pro: { label: "Pro", className: "text-accent bg-accent/10 shadow-glow-sm" },
  team: { label: "Team", className: "text-accentViolet bg-accentViolet/10" },
};

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const chatOpen = usePraxisStore((state) => state.chatOpen);
  const setChatOpen = usePraxisStore((state) => state.setChatOpen);
  const currentAnalysisId = usePraxisStore((state) => state.currentAnalysisId);

  const planId = (session?.user as any)?.planId ?? "free";
  const isPro = planId === "pro" || planId === "team";
  const badge = PLAN_BADGE[planId] ?? PLAN_BADGE.free;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-800/80 bg-bg/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold tracking-wider text-slate-100">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-accent shadow-glow animate-pulseSlow" />
          PRAXIS
        </Link>

        <nav className="flex items-center gap-0.5 text-sm text-slate-300">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-3 py-2 transition duration-200 ${
                  isActive
                    ? "text-accent bg-accent/10 shadow-glow-sm border border-accent/25"
                    : "hover:bg-slate-800/70 hover:text-white border border-transparent"
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          {currentAnalysisId && (
            <button
              onClick={() => {
                if (!isPro) {
                  window.location.href = "/pricing";
                  return;
                }
                setChatOpen(!chatOpen);
              }}
              className={`flex items-center gap-1.5 rounded-md px-3 py-2 transition duration-200 border ${
                chatOpen
                  ? "bg-accent/15 text-accent shadow-glow-sm border-accent/25"
                  : "border-transparent hover:bg-slate-800/70 hover:text-white"
              }`}
              title={isPro ? "AI Codebase Chat" : "Upgrade to Pro for AI Chat"}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              {!isPro && <span className="text-xs text-accentViolet">Pro</span>}
            </button>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {session?.user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 transition-all duration-200 ${
                  menuOpen
                    ? "border-accent/40 bg-accent/10 shadow-glow-sm"
                    : "border-slate-700/60 bg-panel hover:border-accent/30"
                }`}
              >
                {session.user.image && (
                  <img
                    src={session.user.image}
                    alt="Avatar"
                    className="w-6 h-6 rounded-full"
                  />
                )}
                <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${badge.className}`}>
                  {badge.label}
                </span>
                <svg className="w-3 h-3 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-44 rounded-xl border border-accent/20 bg-panel shadow-glow-sm z-50 overflow-hidden animate-fadeIn">
                  <div className="px-4 py-3 border-b border-slate-800">
                    <p className="text-xs font-medium text-white truncate">{session.user.name}</p>
                    <p className="text-xs text-muted truncate">{session.user.email}</p>
                  </div>
                  <Link
                    href="/account"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2.5 text-sm text-slate-300 hover:bg-accent/10 hover:text-accent transition-colors"
                  >
                    Account & Billing
                  </Link>
                  <button
                    onClick={() => { signOut({ callbackUrl: "/" }); setMenuOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800/70 hover:text-white transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/sign-in"
              className="rounded-lg border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm text-accent hover:shadow-glow-sm hover:border-accent/50 transition-all duration-200"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
