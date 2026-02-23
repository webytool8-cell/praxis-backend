import { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  const base =
    "rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-accent/50 disabled:opacity-50";
  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-gradient-to-b from-accent to-blue-600 text-white shadow-[0_8px_24px_rgba(91,140,255,0.35)] hover:shadow-glow hover:-translate-y-px",
    secondary:
      "glass-panel border border-slate-700/70 text-slate-100 hover:border-slate-500",
    ghost: "text-slate-300 hover:bg-slate-800/70 hover:text-white",
  };

  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
