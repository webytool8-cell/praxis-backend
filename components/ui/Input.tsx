import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/theme/cn";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className, id, ...props }: Props) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <label className="block space-y-2 text-sm text-text1" htmlFor={inputId}>
      {label ? <span>{label}</span> : null}
      <input
        id={inputId}
        className={cn(
          "w-full rounded-xl border border-[rgb(var(--line-1))] bg-[rgb(var(--bg-1))]/70 px-3 py-2.5 text-sm text-text0 outline-none transition duration-200 placeholder:text-text2 focus:border-[rgb(var(--acc-0))] focus:ring-2 focus:ring-[rgb(var(--acc-0))]/30",
          className,
        )}
        {...props}
      />
    </label>
  );
}
