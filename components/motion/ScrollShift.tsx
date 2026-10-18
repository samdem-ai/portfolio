"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, prefersReducedMotion } from "@/lib/motion";

/**
 * Slides its content horizontally in step with scrolling. It starts offset by `from`
 * and settles at its normal position once the trigger section is fully scrolled into view.
 */
export function ScrollShift({ children, from, className = "" }: { children: ReactNode; from: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const trigger = el.closest("footer, section") ?? el;
    const tween = gsap.fromTo(
      el,
      { x: from },
      { x: 0, ease: "none", scrollTrigger: { trigger, start: "top bottom", end: "bottom bottom", scrub: 0.6 } },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [from]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
