import type { TocItem } from "@/lib/toc";

/** Clickable table of contents for a post. Anchors jump to the heading ids. */
export function Toc({ items, label }: { items: TocItem[]; label: string }) {
  if (items.length < 3) return null;
  return (
    <nav aria-label={label} className="mt-10 border-t border-rule pt-6">
      <p className="eyebrow mb-4">{label}</p>
      <ul className="space-y-2.5 text-sm leading-snug">
        {items.map((it) => (
          <li key={it.id} className={it.level === 3 ? "pl-4" : ""}>
            <a href={`#${it.id}`} className="text-muted transition-colors hover:text-ink">
              {it.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
