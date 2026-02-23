export function MetricsBar({ value }: { value: number }) {
  return (
    <div className="space-y-1">
      <div className="h-2 w-full overflow-hidden rounded bg-white/10">
        <div
          className="h-full rounded bg-[linear-gradient(90deg,rgba(var(--ok),0.9),rgba(var(--warn),0.9),rgba(var(--bad),0.9))]"
          style={{ width: `${value}%` }}
        />
      </div>
      <p className="text-xs text-text2">Risk {value}/100</p>
    </div>
  );
}
