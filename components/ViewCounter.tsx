"use client";

import { useEffect, useState } from "react";

/** Shows a post's view count and counts the current visit once per session.
 *  Always renders a <dl> cell (hidden while the count is unknown) so the
 *  client component is present in the prerendered payload and its effect runs;
 *  it stays hidden when views aren't configured (the API returns null). */
export function ViewCounter({ slug, label, unit }: { slug: string; label: string; unit: string }) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    const flag = `viewed:${slug}`;
    let seen = false;
    try {
      seen = sessionStorage.getItem(flag) === "1";
      sessionStorage.setItem(flag, "1");
    } catch {
      /* private mode: just count it */
    }
    fetch(`/api/views/${slug}`, { method: seen ? "GET" : "POST" })
      .then((r) => r.json())
      .then((d) => {
        if (active && typeof d.count === "number") setCount(d.count);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [slug]);

  return (
    <div className={count === null ? "hidden" : undefined}>
      <dt className="eyebrow">{label}</dt>
      <dd className="mt-3 border-t border-rule pt-3">
        {count === null ? "" : `${count.toLocaleString()} ${unit}`}
      </dd>
    </div>
  );
}
