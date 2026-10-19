import { Children, isValidElement, type ReactNode } from "react";

/** <Stage label="..." sub="..." /> — one box in an architecture sketch. */
export function Stage({ label, sub }: { label: string; sub?: string }) {
  return (
    <li>
      <div className="flex-1 rounded-lg border border-rule bg-canvas px-3.5 py-3">
        <div className="font-mono text-[0.78rem] font-medium leading-snug text-ink">{label}</div>
        {sub && <div className="mt-0.5 text-xs leading-snug text-muted">{sub}</div>}
      </div>
    </li>
  );
}

/** <Lane title="..."> — a titled row of stages. */
export function Lane({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div>
      {title && <p className="eyebrow mb-3">{title}</p>}
      <ol className="pipe">{children}</ol>
    </div>
  );
}

/** <Pipeline> — wraps stages directly, or several <Lane>s. */
export function Pipeline({ children }: { children: ReactNode }) {
  const hasLanes = Children.toArray(children).some((c) => isValidElement(c) && c.type === Lane);
  return <figure className="my-10 space-y-7 rounded-2xl bg-panel p-5 sm:p-7">{hasLanes ? children : <Lane>{children}</Lane>}</figure>;
}

/** <Note>...</Note> — a highlighted aside. */
export function Note({ children }: { children: ReactNode }) {
  return <aside className="rounded-xl bg-panel px-5 py-4 text-ink">{children}</aside>;
}

export function ResultsGrid({ items }: { items?: { value: string; label: string }[] }) {
  if (!items?.length) return null;
  return (
    <dl className="my-10 grid grid-cols-2 gap-x-8 gap-y-10">
      {items.map((r) => (
        <div key={r.label} className="flex flex-col-reverse justify-end border-t border-rule pt-4">
          <dt className="mt-2 text-sm leading-snug text-muted">{r.label}</dt>
          <dd className="text-[clamp(2.4rem,4vw,3.4rem)] font-medium leading-none tracking-[-0.04em] text-ink">{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** <Figure src="/work/.../x.webp" caption="..." /> — a captioned screenshot. */
export function Figure({ src, caption, alt }: { src: string; caption?: string; alt?: string }) {
  return (
    <figure className="my-10">
      {/* eslint-disable-next-line @next/next/no-img-element -- static screenshots, already sized and compressed */}
      <img src={src} alt={alt ?? caption ?? ""} loading="lazy" className="block w-full rounded-xl border border-rule" />
      {caption && <figcaption className="mt-3 text-sm text-muted">{caption}</figcaption>}
    </figure>
  );
}

/** <Gallery> — lays out <Figure>s two per row on wider screens. */
export function Gallery({ children }: { children: ReactNode }) {
  return <div className="my-10 grid gap-x-6 sm:grid-cols-2 [&>figure]:my-0 [&>figure]:mb-6">{children}</div>;
}
