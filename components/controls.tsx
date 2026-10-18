"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { applyTheme, nextTheme, readTheme, type ThemeChoice } from "@/lib/theme-client";

export function ThemeToggle({ label, names, className = "grid" }: { label: string; names: Record<ThemeChoice, string>; className?: string }) {
  const [theme, setTheme] = useState<ThemeChoice | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage is only readable after mount
    setTheme(readTheme());
    const onChange = (e: Event) => setTheme((e as CustomEvent<ThemeChoice>).detail);
    window.addEventListener("themechange", onChange);
    return () => window.removeEventListener("themechange", onChange);
  }, []);

  return (
    <button
      type="button"
      onClick={() => applyTheme(nextTheme(theme ?? "system"))}
      className={`${className} h-10 w-10 place-items-center rounded-full text-on-dark-muted transition-colors hover:text-on-dark`}
      aria-label={`${label}: ${theme ? names[theme] : names.system}`}
      title={`${label}: ${theme ? names[theme] : names.system}`}
    >
      <svg aria-hidden viewBox="0 0 20 20" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        {theme === "light" ? (
          <>
            <circle cx="10" cy="10" r="3.6" />
            <path d="M10 1.8v2.1M10 16.1v2.1M1.8 10h2.1M16.1 10h2.1M4.2 4.2l1.5 1.5M14.3 14.3l1.5 1.5M4.2 15.8l1.5-1.5M14.3 5.7l1.5-1.5" />
          </>
        ) : theme === "dark" ? (
          <path d="M15.5 12.6A6.5 6.5 0 0 1 7.4 4.5a6.5 6.5 0 1 0 8.1 8.1Z" />
        ) : (
          <>
            <circle cx="10" cy="10" r="6.5" />
            <path d="M10 3.5a6.5 6.5 0 0 1 0 13Z" fill="currentColor" />
          </>
        )}
      </svg>
    </button>
  );
}

export function LangSwitch({ locale, label, title, className = "" }: { locale: "en" | "fr"; label: string; title: string; className?: string }) {
  const pathname = usePathname();
  const target = locale === "en" ? "fr" : "en";
  const to = pathname.replace(/^\/(en|fr)(?=\/|$)/, `/${target}`);
  return (
    <Link
      href={to}
      hrefLang={target}
      lang={target}
      title={title}
      className={`px-3 py-2 text-sm uppercase text-on-dark-muted transition-colors hover:text-on-dark ${className}`}
    >
      <span className="sr-only">{label}</span>
      <span aria-hidden>{target}</span>
    </Link>
  );
}

export function ShellButton({ label, which = "terminal", className, children }: { label: string; which?: "terminal" | "palette"; className?: string; children?: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent("shell:open", { detail: which }))}
      className={className ?? "grid h-9 min-w-9 place-items-center px-2 font-mono text-sm text-ink-2 hover:bg-panel hover:text-ink"}
      aria-label={label}
      title={label}
    >
      {children ?? <span aria-hidden>&gt;_</span>}
    </button>
  );
}

export function MenuButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("menu:open"))}
      className="flex items-center gap-2 px-2 py-2 md:hidden"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
      {label}
    </button>
  );
}
