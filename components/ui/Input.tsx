import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Input({ label, id, className = "", ...props }: InputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <label className="block space-y-2 text-sm font-medium text-slate-700" htmlFor={inputId}>
      <span>{label}</span>
      <input
        id={inputId}
        className={`w-full rounded-md border border-slate-300 px-3 py-2 outline-none ring-brand focus:ring-2 ${className}`}
        {...props}
      />
    </label>
  );
}
