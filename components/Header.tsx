import Link from "next/link";
import { Magnetic } from "@/components/motion/Magnetic";
import type { Dictionary } from "@/lib/dictionary";
import { href, type Locale } from "@/lib/i18n";
import { LangSwitch, MenuButton, ShellButton, ThemeToggle } from "./controls";

export function Header({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const nav = [
    { label: dict.nav.work, to: href(locale, "/work") },
    { label: dict.nav.about, to: href(locale, "/about") },
    { label: dict.nav.lab, to: href(locale, "/lab") },
    { label: dict.nav.contact, to: "#contact" },
  ];

  return (
    <header className="no-print absolute inset-x-0 top-0 z-40 text-on-dark">
      <div className="wrap flex items-center justify-between py-7 sm:py-9">
        <Link href={href(locale)} className="group flex items-center gap-1.5 font-medium" aria-label="Samy Debaili, home">
          <span className="inline-block transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:rotate-[360deg]">©</span>
          <span className="relative block overflow-hidden whitespace-nowrap leading-tight">
            <span className="block transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-full">{dict.ui.codeBy}</span>
            <span className="absolute inset-x-0 top-0 block translate-y-full transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-y-0">
              Samy Debaili
            </span>
          </span>
        </Link>

        <nav aria-label="Main" className="flex items-center gap-2">
          <ul className="hidden items-center md:flex">
            {nav.map((n) => (
              <li key={n.to}>
                <Magnetic strength={0.4}>
                  <Link href={n.to} className="dotlink inline-block px-4 py-2">
                    {n.label}
                  </Link>
                </Magnetic>
              </li>
            ))}
          </ul>
          <span className="mx-1 hidden h-5 w-px bg-dark-rule md:block" aria-hidden />
          <Magnetic strength={0.35}>
            <ShellButton
              label={`${dict.ui.palette} (Ctrl+K)`}
              which="palette"
              className="grid h-10 min-w-10 place-items-center rounded-full border border-dark-rule px-3 font-mono text-xs text-on-dark transition-colors hover:border-on-dark hover:bg-on-dark hover:text-dark"
            >
              <span aria-hidden>⌘K</span>
            </ShellButton>
          </Magnetic>
          <Magnetic strength={0.35}>
            <ShellButton
              label={`${dict.ui.openTerminal} (\`)`}
              className="grid h-10 w-10 place-items-center rounded-full border border-dark-rule font-mono text-sm text-on-dark transition-colors hover:border-on-dark hover:bg-on-dark hover:text-dark"
            >
              <span aria-hidden>&gt;_</span>
            </ShellButton>
          </Magnetic>
          <LangSwitch locale={locale} label={dict.ui.language} title={dict.ui.languageLabel} className="hidden md:inline-block" />
          <ThemeToggle label={dict.ui.theme} names={dict.ui.themeNames} className="hidden md:grid" />
          <MenuButton label={dict.ui.menu} />
        </nav>
      </div>
    </header>
  );
}
