"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/motion";

/**
 * Endless horizontal name strip. Scrolling down pushes it left, scrolling up reverses it.
 *
 * With `maskFrom` (an <img> id), a second, dark copy runs in lockstep on top and is masked
 * to that image's silhouette: the name stays white on the background and turns dark exactly
 * where it crosses the figure.
 */
export function Marquee({ text, className = "", maskFrom }: { text: string; className?: string; maskFrom?: string }) {
  const back = useRef<HTMLDivElement>(null);
  const front = useRef<HTMLDivElement>(null);
  const frontLayer = useRef<HTMLDivElement>(null);

  // Keep the mask glued to the figure (it moves with parallax and on resize).
  useEffect(() => {
    if (!maskFrom) return;
    const layer = frontLayer.current!;
    const syncMask = () => {
      const img = document.getElementById(maskFrom);
      if (!img) return;
      const a = img.getBoundingClientRect();
      const b = layer.getBoundingClientRect();
      const pos = `${a.left - b.left}px ${a.top - b.top}px`;
      const size = `${a.width}px ${a.height}px`;
      layer.style.maskPosition = layer.style.webkitMaskPosition = pos;
      layer.style.maskSize = layer.style.webkitMaskSize = size;
      layer.style.visibility = "visible";
    };
    syncMask();
    gsap.ticker.add(syncMask);
    window.addEventListener("resize", syncMask);
    return () => {
      gsap.ticker.remove(syncMask);
      window.removeEventListener("resize", syncMask);
    };
  }, [maskFrom]);

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
      {maskFrom && (
        <div data-fade="0.1" className="absolute inset-0 z-10">
          <div
            ref={frontLayer}
            className="h-full overflow-hidden text-dark"
            style={{
              visibility: "hidden",
              maskImage: "url(/samy.svg)",
              WebkitMaskImage: "url(/samy.svg)",
              maskRepeat: "no-repeat",
              WebkitMaskRepeat: "no-repeat",
            }}
          >
            {strip(front)}
          </div>
        </div>
      )}
    </div>
  );
}
