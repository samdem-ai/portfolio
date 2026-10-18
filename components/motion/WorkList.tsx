"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { finePointer, gsap, prefersReducedMotion } from "@/lib/motion";

export type WorkRow = {
  slug: string;
  title: string;
  kind: string;
  year: string;
  summary: string;
  href: string;
  external: boolean;
  stack: string[];
  cover?: string;
  stat?: { value: string; label: string };
  status?: string;
};

const tints = [
  "#d9d6d2",
  "#cfd6d4",
  "#d6d2da",
  "#d8d4cb",
  "#d0d4dc",
  "#dad3cf",
];

/**
 * Big project rows. On desktop a preview card and a round "View" cursor follow the mouse;
 * the card shows the project's headline number (or its stack) instead of a screenshot.
 */
export function WorkList({
  rows,
  viewLabel,
  columns = "simple",
}: {
  rows: WorkRow[];
  viewLabel: string;
  columns?: "simple" | "detailed";
}) {
  const list = useRef<HTMLUListElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const cursor = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- pointer type is only known in the browser
    setEnabled(finePointer() && !prefersReducedMotion());
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const cx = gsap.quickTo(card.current, "x", {
      duration: 0.8,
      ease: "power3",
    });
    const cy = gsap.quickTo(card.current, "y", {
      duration: 0.8,
      ease: "power3",
    });
    const ux = gsap.quickTo(cursor.current, "x", {
      duration: 0.45,
      ease: "power3",
    });
    const uy = gsap.quickTo(cursor.current, "y", {
      duration: 0.45,
      ease: "power3",
    });
    const move = (e: MouseEvent) => {
      cx(e.clientX);
      cy(e.clientY);
      ux(e.clientX);
      uy(e.clientY);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    const shown = active !== null;
    gsap.to([card.current, cursor.current], {
      scale: shown ? 1 : 0,
      duration: 0.45,
      ease: shown ? "power3.out" : "power3.in",
    });
    if (shown)
      gsap.to(strip.current, {
        yPercent: -100 * active,
        duration: 0.7,
        ease: "power3.inOut",
      });
  }, [active, enabled]);

  return (
    <div className="relative">
      <ul
        ref={list}
        className="border-t border-rule"
        onMouseLeave={() => setActive(null)}
      >
        {rows.map((r, i) => {
          const inner = (
            <span
              className={`grid gap-x-8 gap-y-2 py-8 transition-[opacity,transform] duration-500 ease-[var(--ease-out-expo)] md:py-11 ${
                columns === "detailed"
                  ? "md:grid-cols-[1fr_10rem_6rem]"
                  : "md:grid-cols-[1fr_auto]"
              } ${active !== null && active !== i ? "md:opacity-40" : ""} ${active === i ? "md:-translate-x-2.5" : ""}`}
            >
              <span>
                {r.cover && (
                  // eslint-disable-next-line @next/next/no-img-element -- static screenshot, already sized and compressed
                  <img
                    src={r.cover}
                    alt=""
                    loading="lazy"
                    width={1440}
                    height={900}
                    className="mb-5 block aspect-[16/10] w-full rounded-xl object-cover object-top md:hidden"
                  />
                )}
                <span className="block text-[clamp(1.9rem,4.6vw,4.4rem)] font-medium leading-[1.02] tracking-[-0.035em]">
                  {r.title}
                </span>
                <span className="mt-2 block max-w-[60ch] text-ink-2 md:hidden">
                  {r.summary}
                </span>
              </span>
              <span className="self-center text-ink-2 md:text-right">
                {r.kind}
                {r.status && (
                  <span className="block text-sm text-muted">{r.status}</span>
                )}
              </span>
              {columns === "detailed" && (
                <span className="hidden self-center text-right text-ink-2 md:block">
                  {r.year}
                </span>
              )}
            </span>
          );
          return (
            <li
              key={r.slug}
              className="border-b border-rule"
              onMouseEnter={() => setActive(i)}
            >
              {r.external ? (
                <a
                  href={r.href}
                  target="_blank"
                  rel="noreferrer"
                  className="block focus-visible:outline-offset-[-2px]"
                >
                  {inner}
                </a>
              ) : (
                <Link
                  href={r.href}
                  data-label={r.title}
                  className="block focus-visible:outline-offset-[-2px]"
                >
                  {inner}
                </Link>
              )}
            </li>
          );
        })}
      </ul>

      {enabled &&
        // Portalled to <body>: a transformed ancestor (scroll fade-ins) would otherwise trap position: fixed.
        createPortal(
          <>
            <div
              ref={card}
              className="pointer-events-none fixed left-0 top-0 z-30 h-[300px] w-[400px] -translate-x-1/2 -translate-y-1/2 overflow-hidden"
              style={{ transform: "scale(0)" }}
              aria-hidden
            >
              <div ref={strip} className="h-full w-full">
                {rows.map((r, i) => (
                  <div
                    key={r.slug}
                    className="flex h-full w-full items-center justify-center p-8"
                    style={{ background: tints[i % tints.length] }}
                  >
                    {r.cover ? (
                      // eslint-disable-next-line @next/next/no-img-element -- static screenshot, already sized and compressed
                      <img
                        src={r.cover}
                        alt=""
                        width={1440}
                        height={900}
                        className="aspect-[16/10] w-full object-cover object-top shadow-2xl"
                      />
                    ) : (
                      <div className="w-full bg-[#1c1d20] p-6 text-white shadow-2xl">
                        <p className="font-mono text-[0.68rem] text-white/50">
                          {r.slug}
                        </p>
                        {r.stat ? (
                          <>
                            <p className="mt-6 text-6xl font-medium tracking-[-0.04em]">
                              {r.stat.value}
                            </p>
                            <p className="mt-2 text-sm leading-snug text-white/65">
                              {r.stat.label}
                            </p>
                          </>
                        ) : (
                          <ul className="mt-5 flex flex-wrap gap-1.5">
                            {r.stack.slice(0, 5).map((s) => (
                              <li
                                key={s}
                                className="rounded-full border border-white/20 px-2.5 py-1 text-xs text-white/80"
                              >
                                {s}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div
              ref={cursor}
              style={{ transform: "scale(0)" }}
              className="pointer-events-none fixed left-0 top-0 z-30 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-accent text-sm text-on-accent"
              aria-hidden
            >
              {viewLabel}
            </div>
          </>,
          document.body,
        )}
    </div>
  );
}
