"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/motion";

/**
 * Wires up the declarative scroll animations after every navigation:
 *  - [data-reveal]  words (wrapped in .rw > span) slide up, staggered
 *  - [data-fade]    block fades and rises; the attribute value is an extra delay in seconds
 */
export function MotionRoot() {
  const pathname = usePathname();

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const base = window.__revealDelay ?? 0;
    window.__revealDelay = 0;
    let ctx: gsap.Context | undefined;

    // Wait a beat so the new page has hydrated before GSAP writes inline styles into it.
    const start = window.setTimeout(() => {
      ctx = gsap.context(() => {
        const delayFor = (el: Element, extra = 0) =>
          ScrollTrigger.isInViewport(el) ? base + extra : extra;

        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
          gsap.to(el.querySelectorAll(".rw > span"), {
            y: 0,
            duration: 1.1,
            ease: "expo.out",
            stagger: 0.022,
            delay: delayFor(el, Number(el.dataset.reveal) || 0),
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-fade]").forEach((el) => {
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "expo.out",
            delay: delayFor(el, Number(el.dataset.fade) || 0),
            scrollTrigger: { trigger: el, start: "top 94%", once: true },
          });
        });
      });
      ScrollTrigger.refresh();
    }, 80);

    return () => {
      window.clearTimeout(start);
      ctx?.revert();
    };
  }, [pathname]);

  return null;
}
