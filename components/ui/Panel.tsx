import { PropsWithChildren } from "react";
import { cn } from "@/lib/theme/cn";

interface Props extends PropsWithChildren {
  className?: string;
}

export function Panel({ className, children }: Props) {
  return <section className={cn("glass-panel rounded-2xl border border-[rgb(var(--line-1))] shadow-soft", className)}>{children}</section>;
}
