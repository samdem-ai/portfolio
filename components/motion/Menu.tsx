"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { applyTheme, nextTheme, readTheme } from "@/lib/theme-client";
import { gsap, lockScroll, prefersReducedMotion, ScrollTrigger } from "@/lib/motion";
import { Magnetic } from "./Magnetic";

type Item = { label: string; href: string };

/**
 * Side menu. Opened from the header ("Menu" on mobile) or from the round button
 * that pops in once you scroll past the top of the page.
 */
export function Menu({
  items,
  socials,
  labels,
  locale,
}: {
  items: Item[];
  socials: Item[];
  labels: { menu: string; close: string; navigation: string; socials: string; terminal: string; palette: string; theme: string; language: string };
  locale: "en" | "fr";
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const fab = useRef<HTMLButtonElement>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);

  const close = useCallback(() => setOpen(false), []);

  // Round button appears after scrolling past the first screen.
  useEffect(() => {
    const el = fab.current!;
    gsap.set(el, { scale: 0 });
    const st = ScrollTrigger.create({
      start: () => window.innerHeight * 0.35,
      end: "max",
      onToggle: (self) => gsap.to(el, { scale: self.isActive ? 1 : 0, duration: 0.35, ease: self.isActive ? "back.out(1.6)" : "power3.in" }),
    });
    const onOpen = () => setOpen(true);
    window.addEventListener("menu:open", onOpen);
    return () => {
      st.kill();
      window.removeEventListener("menu:open", onOpen);
    };
  }, []);

  useEffect(() => {
    lockScroll(open);
    const p = panel.current!;
    const links = p.querySelectorAll("[data-menu-item]");
    const quick = prefersReducedMotion();
    if (open) {
      gsap.set(p, { display: "flex" });
      gsap.fromTo(p, { xPercent: 100 }, { xPercent: 0, duration: quick ? 0 : 0.8, ease: "power4.out" });
      gsap.fromTo(links, { x: 80 }, { x: 0, duration: quick ? 0 : 0.9, ease: "power4.out", stagger: 0.04 });
      if (fab.current) gsap.to(fab.current, { scale: 1, duration: 0.3 });
      window.setTimeout(() => firstLink.current?.focus(), 50);
    } else if (p.style.display === "flex") {
      gsap.to(p, { xPercent: 100, duration: quick ? 0 : 0.6, ease: "power3.in", onComplete: () => void gsap.set(p, { display: "none" }) });
      if (fab.current && window.scrollY < window.innerHeight * 0.35) gsap.to(fab.current, { scale: 0, duration: 0.3 });
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- close the menu whenever the route changes
  useEffect(() => setOpen(false), [pathname]);

  const shell = (which: "terminal" | "palette") => {
    close();
    window.setTimeout(() => window.dispatchEvent(new CustomEvent("shell:open", { detail: which })), 350);
  };

  return (
    <>
      {open && <div className="fixed inset-0 z-[55] bg-black/40" onClick={close} aria-hidden />}

      {/* Click-through wrapper: while the button is scaled to 0 it must not block the header controls beneath it. */}
      <div className="no-print pointer-events-none fixed right-5 top-5 z-[70] sm:right-8 sm:top-8">
        <Magnetic strength={0.3} className="block">
          <button
            ref={fab}
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? labels.close : labels.menu}
            className={`pointer-events-auto grid h-16 w-16 place-items-center rounded-full shadow-lg transition-colors duration-300 sm:h-[4.5rem] sm:w-[4.5rem] ${
              open ? "bg-accent" : "bg-dark"
            }`}
          >
            <span className="relative block h-3 w-6">
              <span className={`absolute left-0 h-px w-full bg-white transition-transform duration-300 ${open ? "top-1/2 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 h-px w-full bg-white transition-transform duration-300 ${open ? "top-1/2 -rotate-45" : "bottom-0"}`} />
            </span>
          </button>
        </Magnetic>
      </div>

      <div
        ref={panel}
        id="site-menu"
        role="dialog"
        aria-modal="true"
        aria-label={labels.navigation}
        data-lenis-prevent
        className="no-print fixed inset-y-0 right-0 z-[60] hidden w-full max-w-[34rem] flex-col justify-between overflow-y-auto bg-dark px-8 pb-10 pt-28 text-on-dark sm:px-16"
      >
        <svg className="absolute right-full top-0 hidden h-full w-[8vw] text-dark sm:block" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
          <path d="M100 0 Q0 50 100 100 Z" fill="currentColor" />
        </svg>
        <nav>
          <p className="eyebrow border-b border-dark-rule pb-5 text-on-dark-muted">{labels.navigation}</p>
          <ul className="mt-8 space-y-1">
            {items.map((it, i) => (
              <li key={it.href} data-menu-item>
                <Link
                  ref={i === 0 ? firstLink : undefined}
                  href={it.href}
                  onClick={close}
                  className="group flex items-center gap-4 py-1 text-[clamp(2.4rem,6vw,3.6rem)] font-medium tracking-[-0.03em]"
                >
                  <span className="h-2.5 w-2.5 scale-0 rounded-full bg-on-dark transition-transform duration-300 group-hover:scale-100" />
                  <span className="-ml-6 transition-transform duration-300 group-hover:translate-x-1">{it.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-12 space-y-8 text-sm">
          <div data-menu-item>
            <p className="eyebrow text-on-dark-muted">{labels.socials}</p>
            <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
              {socials.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noreferrer" className="ulink">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div data-menu-item className="flex flex-wrap gap-x-6 gap-y-2 text-on-dark-muted">
            <button type="button" className="ulink hover:text-on-dark" onClick={() => shell("palette")}>
              {labels.palette}
            </button>
            <button type="button" className="ulink hover:text-on-dark" onClick={() => shell("terminal")}>
              {labels.terminal}
            </button>
            <button type="button" className="ulink hover:text-on-dark" onClick={() => applyTheme(nextTheme(readTheme()))}>
              {labels.theme}
            </button>
            <Link
              href={pathname.replace(/^\/(en|fr)(?=\/|$)/, `/${locale === "en" ? "fr" : "en"}`)}
              className="ulink hover:text-on-dark"
              hrefLang={locale === "en" ? "fr" : "en"}
            >
              {labels.language}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
