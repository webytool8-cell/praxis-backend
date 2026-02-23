import { Input } from "@/components/ui/Input";

export function Filters() {
  return (
    <div className="space-y-2">
      <p className="text-xs uppercase tracking-wider text-text2">Filters</p>
      <Input label="Search node" placeholder="auth service" />
      <label className="flex items-center gap-2 text-xs text-text1">
        <input type="checkbox" className="h-3.5 w-3.5 rounded border-[rgb(var(--line-1))] bg-transparent" />
        Hide vendor / test files
      </label>
    </div>
  );
}
