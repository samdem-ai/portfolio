"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/motion";

const WORDS = ["Hello", "Azul", "مرحبا", "Bonjour", "Hola", "Привет", "Ciao", "Hallo"];
const CURVED = "M0 0 L100 0 L100 0 Q50 100 0 0 Z";
const FLAT = "M0 0 L100 0 L100 0 Q50 0 0 0 Z";

/** First-visit intro: greetings flick by, then the curtain lifts with a curved edge. */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const curve = useRef<SVGPathElement>(null);
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    if (html.hasAttribute("data-seen") || prefersReducedMotion()) {
      setDone(true);
      return;
    }
    window.__revealDelay = 0.9 + (WORDS.length - 1) * 0.115 + 0.45;
    let i = 0;
    let timer = window.setTimeout(function next() {
      i += 1;
      if (i < WORDS.length) {
        setIndex(i);
        timer = window.setTimeout(next, 115);
        return;
      }
      const finish = () => {
        try {
          sessionStorage.setItem("seen", "1");
        } catch {
          /* private mode */
        }
        html.setAttribute("data-seen", "");
        setDone(true);
      };
      // Fallback in case animation frames are paused (tab opened in the background).
      timer = window.setTimeout(finish, 1500);
      gsap
        .timeline({ onComplete: finish })
        .to(root.current, { yPercent: -100, duration: 0.85, ease: "power3.inOut" })
        .to(curve.current, { attr: { d: FLAT }, duration: 0.85, ease: "power3.inOut" }, 0);
    }, 900);
    return () => window.clearTimeout(timer);
  }, []);

  if (done) return null;

  return (
    <div ref={root} className="preloader no-print fixed inset-0 z-[100] bg-dark text-on-dark" aria-hidden>
      <div className="flex h-full items-center justify-center">
        <p className="flex items-center gap-3 text-[clamp(2.2rem,5vw,3.6rem)] font-medium tracking-tight">
          <span className="h-2.5 w-2.5 rounded-full bg-on-dark" />
          <span key={index} className="animate-[fadeword_0.4s_ease-out]">
            {WORDS[index]}
          </span>
        </p>
      </div>
      <svg className="absolute left-0 top-full h-[18vh] w-full text-dark" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path ref={curve} d={CURVED} fill="currentColor" />
      </svg>
    </div>
  );
}
