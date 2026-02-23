import { PropsWithChildren } from "react";
import { TopBar } from "@/components/shell/TopBar";

export function AppShell({ children }: PropsWithChildren) {
  return (
    <>
      <TopBar />
      <main className="mx-auto max-w-[1600px] px-4 py-5 md:px-6">{children}</main>
    </>
  );
}
