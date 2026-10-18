"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/motion";

/** Endless horizontal name strip. Scrolling down pushes it left, scrolling up reverses it. */
export function Marquee({ text, className = "" }: { text: string; className?: string }) {
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = track.current!;
    let x = 0;
    let direction = -1;
    const tick = () => {
      if (x <= -50) x = 0;
      if (x > 0) x = -50;
      gsap.set(el, { xPercent: x });
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

  return (
    <div className={`overflow-hidden ${className}`} aria-hidden>
      <div ref={track} className="flex w-max whitespace-nowrap will-change-transform">
        {[0, 1].map((k) => (
          <span key={k} className="pr-[0.3em]">
            {text} —&nbsp;{text} —&nbsp;
          </span>
        ))}
      </div>
    </div>
  );
}
