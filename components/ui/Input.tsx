import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Input({ label, id, className = "", ...props }: InputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> codex/generate-next.js-project-structure-for-praxis-tnp5m1
=======
>>>>>>> main
=======
>>>>>>> codex/generate-next.js-project-structure-for-praxis-xj8r91
>>>>>>> main
>>>>>>> main
    <label className="block space-y-2 text-sm font-medium text-slate-300" htmlFor={inputId}>
      <span>{label}</span>
      <input
        id={inputId}
        className={`w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2.5 text-slate-100 outline-none transition duration-300 placeholder:text-slate-500 focus:border-accent focus:ring-2 focus:ring-accent/30 ${className}`}
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
=======
    <label className="block space-y-2 text-sm font-medium text-slate-700" htmlFor={inputId}>
      <span>{label}</span>
      <input
        id={inputId}
        className={`w-full rounded-md border border-slate-300 px-3 py-2 outline-none ring-brand focus:ring-2 ${className}`}
<<<<<<< HEAD
>>>>>>> codex/generate-next.js-project-structure-for-praxis
>>>>>>> codex/generate-next.js-project-structure-for-praxis-tnp5m1
=======
>>>>>>> main
>>>>>>> main
>>>>>>> main
>>>>>>> main
>>>>>>> main
        {...props}
      />
    </label>
  );
}
