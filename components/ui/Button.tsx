import { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  const base =
    "rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-accent/50 disabled:opacity-50 active:scale-[0.98]";
  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-accent text-white shadow-glow-sm hover:shadow-glow hover:brightness-110",
    secondary:
      "bg-panel border border-slate-700/70 text-slate-100 hover:border-accent/50 hover:shadow-glow-sm hover:text-white",
    ghost: "text-slate-300 hover:bg-slate-800/70 hover:text-white",
  };

  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
