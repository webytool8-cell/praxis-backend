"use client";

import { Template } from "@/types/graph";

interface Props {
  value: Template;
  onChange: (v: Template) => void;
}

const templates: Template[] = ["architecture", "dependencies", "dataflow", "risk"];

export function TemplateSelect({ value, onChange }: Props) {
  return (
    <div className="space-y-2">
      <p className="text-xs uppercase tracking-wider text-text2">Template</p>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as Template)}
        className="w-full rounded-xl border border-[rgb(var(--line-1))] bg-[rgb(var(--bg-1))] px-3 py-2 text-sm text-text0"
      >
        {templates.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
}
