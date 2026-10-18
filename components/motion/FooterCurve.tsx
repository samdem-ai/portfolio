"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/motion";

/** The page's bottom edge bulges into the footer, then flattens as the footer scrolls into view. */
export function FooterCurve() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (prefersReducedMotion()) {
      gsap.set(ref.current, { height: 0 });
      return;
    }
    const tween = gsap.fromTo(
      ref.current,
      { height: "9vh" },
      { height: 0, ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "top 25%", scrub: true } },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);
  return (
    <div className="relative h-0 overflow-x-clip overflow-y-visible" aria-hidden>
      <div ref={ref} className="absolute -left-1/4 top-0 h-[9vh] w-[150%] rounded-b-[50%] bg-canvas shadow-[0_40px_60px_-30px_rgb(0_0_0/0.35)]" />
    </div>
  );
}
