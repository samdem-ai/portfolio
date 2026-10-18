"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion, scrollToTop } from "@/lib/motion";

const labels: Record<string, Record<"en" | "fr", string>> = {
  "": { en: "Home", fr: "Accueil" },
  work: { en: "Work", fr: "Projets" },
  about: { en: "About", fr: "À propos" },
  lab: { en: "Lab", fr: "Labo" },
  uses: { en: "Uses", fr: "Outils" },
  resume: { en: "Resume", fr: "CV" },
};

function labelFor(pathname: string, link: HTMLAnchorElement) {
  if (link.dataset.label) return link.dataset.label;
  const [, locale = "en", ...rest] = pathname.split("/");
  const key = rest.join("/");
  const lang = locale === "fr" ? "fr" : "en";
  return labels[key]?.[lang] ?? labels[rest[0] ?? ""]?.[lang] ?? "";
}

const TOP_CURVED = "M0 100 L100 100 L100 100 Q50 0 0 100 Z";
const TOP_FLAT = "M0 100 L100 100 L100 100 Q50 100 0 100 Z";
const BOTTOM_CURVED = "M0 0 L100 0 L100 0 Q50 100 0 0 Z";
const BOTTOM_FLAT = "M0 0 L100 0 L100 0 Q50 0 0 0 Z";

/** Curtain transition between pages: slides up over the old page, shows the destination name, lifts off the new one. */
export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const curtain = useRef<HTMLDivElement>(null);
  const top = useRef<SVGPathElement>(null);
  const bottom = useRef<SVGPathElement>(null);
  const pending = useRef<{ path: string; hash: string } | null>(null);
  const liftRef = useRef<() => void>(() => {});
  const [label, setLabel] = useState("");

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element | null)?.closest?.("a");
      if (!link || (link.target && link.target !== "_self") || link.hasAttribute("download") || prefersReducedMotion()) return;
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (/\.[a-z0-9]{2,5}$/i.test(url.pathname)) return; // files: PDFs, txt
      if (url.pathname === window.location.pathname) return; // same page, maybe a #hash: let Lenis handle it

      e.preventDefault();
      e.stopPropagation();
      pending.current = { path: url.pathname, hash: url.hash };
      window.__revealDelay = 0.45;
      setLabel(labelFor(url.pathname, link));

      const el = curtain.current!;
      gsap.killTweensOf([el, top.current, bottom.current]);
      gsap.set(el, { display: "block", yPercent: 100 });
      gsap.set(top.current, { attr: { d: TOP_CURVED } });
      gsap.set(bottom.current, { attr: { d: BOTTOM_FLAT } });
      let navigated = false;
      const go = () => {
        if (navigated) return;
        navigated = true;
        router.push(url.pathname + url.search + url.hash, { scroll: false });
      };
      // The animation is decoration: navigate on time even if frames stall (background tab, slow device).
      window.setTimeout(go, 750);
      gsap
        .timeline({ onComplete: go })
        .to(el, { yPercent: 0, duration: 0.6, ease: "power3.inOut" })
        .to(top.current, { attr: { d: TOP_FLAT }, duration: 0.6, ease: "power3.inOut" }, 0);

      // Never leave the curtain down if navigation fails.
      window.setTimeout(() => pending.current && lift(), 4000);
    };

    const lift = () => {
      const target = pending.current;
      pending.current = null;
      scrollToTop();
      if (target?.hash) {
        const anchor = document.querySelector(target.hash);
        if (anchor && window.__lenis) window.__lenis.scrollTo(anchor as HTMLElement, { immediate: true });
        else anchor?.scrollIntoView();
      }
      gsap.set(bottom.current, { attr: { d: BOTTOM_CURVED } });
      const hide = () => void gsap.set(curtain.current, { display: "none" });
      window.setTimeout(hide, 1200);
      gsap
        .timeline({ delay: 0.1, onComplete: hide })
        .to(curtain.current, { yPercent: -100, duration: 0.75, ease: "power3.inOut" })
        .to(bottom.current, { attr: { d: BOTTOM_FLAT }, duration: 0.75, ease: "power3.inOut" }, 0);
    };

    liftRef.current = lift;
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  useEffect(() => {
    if (!pending.current) return;
    liftRef.current();
  }, [pathname]);

  return (
    <div ref={curtain} className="no-print pointer-events-auto fixed inset-0 z-[90] hidden bg-dark text-on-dark" aria-hidden>
      <svg className="absolute bottom-full left-0 h-[16vh] w-full text-dark" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path ref={top} d={TOP_CURVED} fill="currentColor" />
      </svg>
      <div className="flex h-full items-center justify-center">
        <p className="flex items-center gap-3 text-[clamp(2rem,4.5vw,3.4rem)] font-medium tracking-tight">
          <span className="h-2.5 w-2.5 rounded-full bg-on-dark" />
          {label}
        </p>
      </div>
      <svg className="absolute left-0 top-full h-[16vh] w-full text-dark" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path ref={bottom} d={BOTTOM_FLAT} fill="currentColor" />
      </svg>
    </div>
  );
}
