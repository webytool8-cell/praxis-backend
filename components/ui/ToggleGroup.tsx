interface ToggleGroupProps<T extends string> {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
}

export function ToggleGroup<T extends string>({ label, value, options, onChange }: ToggleGroupProps<T>) {
  return (
    <div className="space-y-2">
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => {
          const active = option === value;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              className={`rounded-lg border px-3 py-2 text-xs capitalize transition duration-300 ${
                active
                  ? "border-accent/80 bg-accent/20 text-blue-100 shadow-glow"
                  : "border-slate-700 bg-slate-900/60 text-slate-300 hover:border-slate-500"
              }`}
            >
              {option.replace(/([A-Z])/g, " $1")}
            </button>
          );
        })}
      </div>
    </div>
  );
}
