"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/motion";

/** The Open Peeps illustration of Samy, anchored to the bottom of the hero with a slow parallax. */
export function HeroPortrait({ alt }: { alt: string }) {
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = ref.current!;
    const tween = gsap.to(el, {
      yPercent: 12,
      ease: "none",
      scrollTrigger: { trigger: el.closest("section"), start: "top top", end: "bottom top", scrub: true },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    // eslint-disable-next-line @next/next/no-img-element -- static SVG illustration
    <img
      ref={ref}
      src="/samy.svg"
      alt={alt}
      width={1220}
      height={1222}
      fetchPriority="high"
      className="pointer-events-none absolute bottom-0 left-1/2 z-[5] h-[52svh] w-auto max-w-none -translate-x-1/2 select-none md:h-[78svh]"
    />
  );
}
