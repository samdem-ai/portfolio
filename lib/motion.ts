"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

declare global {
  interface Window {
    __lenis?: Lenis;
    /** Seconds to wait before animating what's already on screen (intro / page curtain still covering it). */
    __revealDelay?: number;
  }
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const finePointer = () => typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

export function scrollToTop() {
  if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true, force: true });
  else window.scrollTo(0, 0);
}

export function lockScroll(locked: boolean) {
  if (window.__lenis) {
    if (locked) window.__lenis.stop();
    else window.__lenis.start();
  }
  document.documentElement.style.overflow = locked ? "hidden" : "";
}
