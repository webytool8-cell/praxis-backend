const layers = ["Frontend", "Backend", "DB", "Infra", "External APIs"];

export function LayerToggles() {
  return (
    <div className="space-y-2">
      <p className="text-xs uppercase tracking-wider text-text2">Layers</p>
      <div className="grid grid-cols-2 gap-2">
        {layers.map((layer) => (
          <button key={layer} type="button" className="rounded-lg border border-[rgb(var(--line-1))] bg-white/5 px-2 py-1.5 text-xs text-text1 hover:border-[rgb(var(--acc-0))]/40">
            {layer}
          </button>
        ))}
      </div>
    </div>
  );
}
