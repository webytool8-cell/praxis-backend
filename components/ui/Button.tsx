import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/theme/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({ variant = "secondary", className, ...props }: Props) {
  return (
    <button
      className={cn(
        "rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--acc-0))]/60",
        variant === "primary" &&
          "bg-[linear-gradient(135deg,rgba(var(--acc-0),0.95),rgba(var(--acc-1),0.9))] text-white shadow-glow",
        variant === "secondary" &&
          "glass-panel border border-[rgb(var(--line-1))] text-text0 hover:border-[rgb(var(--acc-0))]/50",
        variant === "ghost" && "text-text1 hover:bg-white/5 hover:text-text0",
        variant === "danger" && "border border-red-400/40 bg-red-400/15 text-red-200",
        className,
      )}
      {...props}
    />
  );
}
