export function DependencyList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1 text-sm text-text1">
      {items.map((item) => (
        <li key={item} className="rounded-md bg-white/5 px-2 py-1">
          {item}
        </li>
      ))}
    </ul>
  );
}
