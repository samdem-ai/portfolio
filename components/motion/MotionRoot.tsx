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
    const ctx = gsap.context(() => {});

    // Build triggers for any not-yet-initialised elements. Re-runnable because
    // the post body streams in via <Suspense> AFTER the first pass, so elements
    // can mount late; the :not([data-fx]) guard stops double-animating.
    const build = () => {
      ctx.add(() => {
        const delayFor = (el: Element, extra = 0) =>
          ScrollTrigger.isInViewport(el) ? base + extra : extra;

        gsap.utils.toArray<HTMLElement>("[data-reveal]:not([data-fx])").forEach((el) => {
          el.dataset.fx = "1";
          gsap.to(el.querySelectorAll(".rw > span"), {
            y: 0,
            duration: 1.1,
            ease: "expo.out",
            stagger: 0.022,
            delay: delayFor(el, Number(el.dataset.reveal) || 0),
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-fade]:not([data-fx])").forEach((el) => {
          el.dataset.fx = "1";
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
    };

    const timers = [window.setTimeout(build, 80), window.setTimeout(build, 450)];

    // Safety net: whatever happens with hydration timing, never leave content
    // that is in view stuck invisible — force-reveal any in-view element still at
    // opacity 0 (below-the-fold elements keep their scroll reveal).
    timers.push(
      window.setTimeout(() => {
        build();
        document.querySelectorAll<HTMLElement>("[data-fade]").forEach((el) => {
          const r = el.getBoundingClientRect();
          const inView = r.top < window.innerHeight && r.bottom > 0;
          if (inView && (gsap.getProperty(el, "opacity") as number) < 0.05) {
            gsap.to(el, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", overwrite: true });
          }
        });
      }, 1600),
    );

    return () => {
      timers.forEach(window.clearTimeout);
      ctx.revert();
    };
  }, [pathname]);

  return null;
}
