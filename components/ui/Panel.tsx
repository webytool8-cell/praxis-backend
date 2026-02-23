import { PropsWithChildren } from "react";

interface PanelProps extends PropsWithChildren {
  className?: string;
}

export function Panel({ className = "", children }: PanelProps) {
  return (
    <section className={`glass-panel rounded-xl border border-slate-800/80 shadow-soft ${className}`}>
      {children}
    </section>
  );
}
