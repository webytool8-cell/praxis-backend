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
              className={`rounded-lg border px-3 py-2 text-xs capitalize transition duration-200 active:scale-95 ${
                active
                  ? "border-accent/70 bg-accent/15 text-accent shadow-glow-sm"
                  : "border-slate-700 bg-panel/60 text-slate-400 hover:border-accent/30 hover:text-slate-200"
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
