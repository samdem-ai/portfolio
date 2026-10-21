import type { TocItem } from "@/lib/toc";

/** Clickable table of contents for a post. Anchors jump to the heading ids.
 *  Inside the sticky sidebar it caps to the viewport and scrolls internally,
 *  so a long list is never cut off. */
export function Toc({ items, label }: { items: TocItem[]; label: string }) {
  if (items.length < 3) return null;
  return (
    <nav aria-label={label} className="mt-8 flex min-h-0 flex-1 flex-col border-t border-rule pt-5">
      <p className="eyebrow mb-3 shrink-0">{label}</p>
      <ul className="space-y-1 overflow-y-auto pr-2 text-[0.82rem] [scrollbar-width:thin]">
        {items.map((it) => (
          <li key={it.id} className={it.level === 3 ? "pl-4" : ""}>
            <a
              href={`#${it.id}`}
              title={it.text}
              className="block truncate text-muted transition-colors hover:text-ink"
            >
              {it.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
