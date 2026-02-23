import { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  const base = "rounded-md px-4 py-2 text-sm font-semibold transition";
  const variants: Record<ButtonVariant, string> = {
    primary: "bg-brand text-white hover:bg-blue-700",
    secondary: "bg-slate-200 text-slate-900 hover:bg-slate-300",
  };

  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
