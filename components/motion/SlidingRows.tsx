"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/motion";

/** Two rows of tags that slide in opposite directions as the section scrolls past. */
export function SlidingRows({ rows }: { rows: [string[], string[]] }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const [a, b] = gsap.utils.toArray<HTMLElement>("[data-row]");
      const st = { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true };
      gsap.fromTo(a, { xPercent: 0 }, { xPercent: -18, ease: "none", scrollTrigger: st });
      gsap.fromTo(b, { xPercent: -18 }, { xPercent: 0, ease: "none", scrollTrigger: st });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="space-y-3 overflow-hidden py-2" aria-hidden>
      {rows.map((row, i) => (
        <div key={i} data-row className="flex w-max gap-3">
          {[...row, ...row].map((item, j) => (
            <span
              key={j}
              className={`whitespace-nowrap rounded-full border px-6 py-3.5 text-[clamp(1rem,1.6vw,1.35rem)] ${
                i === 0 ? "border-rule text-ink" : "border-transparent bg-panel font-mono text-[clamp(0.85rem,1.3vw,1.1rem)] text-ink-2"
              }`}
            >
              {item}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
