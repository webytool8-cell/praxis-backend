import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function TopBar() {
  return (
    <header className="sticky top-0 z-30 border-b border-[rgb(var(--line-0))] bg-[rgb(var(--bg-0))]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between px-4 md:px-6">
        <Link href="/" className="text-sm font-semibold tracking-[0.16em] text-text0">
          PRAXIS
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/repo">
            <Button variant="ghost" className="text-xs">Connect GitHub</Button>
          </Link>
          <div className="h-7 w-7 rounded-full border border-[rgb(var(--line-1))] bg-[rgb(var(--bg-2))]" />
        </div>
      </div>
    </header>
  );
}
