"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/motion";

/**
 * Endless horizontal name strip. Scrolling down pushes it left, scrolling up reverses it.
 * With `outline`, a second, outlined copy moves in lockstep on a higher layer, so the name
 * can pass behind something (the hero figure) and still read as an outline in front of it.
 */
export function Marquee({ text, className = "", outline = false }: { text: string; className?: string; outline?: boolean }) {
  const back = useRef<HTMLDivElement>(null);
  const front = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const tracks = [back.current, front.current].filter(Boolean);
    let x = 0;
    let direction = -1;
    const tick = () => {
      if (x <= -50) x = 0;
      if (x > 0) x = -50;
      gsap.set(tracks, { xPercent: x });
      x += 0.035 * direction;
    };
    gsap.ticker.add(tick);
    const st = ScrollTrigger.create({
      trigger: document.documentElement,
      start: 0,
      end: "max",
      onUpdate: (self) => (direction = self.direction === 1 ? -1 : 1),
    });
    return () => {
      gsap.ticker.remove(tick);
      st.kill();
    };
  }, []);

  const strip = (ref: React.RefObject<HTMLDivElement | null>) => (
    <div ref={ref} className="flex w-max whitespace-nowrap will-change-transform">
      {[0, 1].map((k) => (
        <span key={k} className="pr-[0.3em]">
          {text} —&nbsp;{text} —&nbsp;
        </span>
      ))}
    </div>
  );

  // No z-index or transform on this wrapper: the two layers must stack independently around siblings.
  return (
    <div className={`relative ${className}`} aria-hidden>
      <div data-fade="0.1" className="relative z-0 overflow-hidden">
        {strip(back)}
      </div>
      {outline && (
        <div data-fade="0.1" className="text-outline absolute inset-0 z-10 overflow-hidden">
          {strip(front)}
        </div>
      )}
    </div>
  );
}
