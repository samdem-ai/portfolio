import Link from "next/link";
import { FooterCurve } from "@/components/motion/FooterCurve";
import { LocalTime } from "@/components/motion/LocalTime";
import { Magnetic } from "@/components/motion/Magnetic";
import { ScrollShift } from "@/components/motion/ScrollShift";
import { profile } from "@/content/profile";
import type { Dictionary } from "@/lib/dictionary";
import { href, type Locale } from "@/lib/i18n";
import { ShellButton } from "./controls";

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const socials = [
    ["GitHub", profile.links.github],
    ["LinkedIn", profile.links.linkedin],
    ["TryHackMe", profile.links.tryhackme],
    ["Root-Me", profile.links.rootme],
  ];
  return (
    <footer id="contact" className="no-print relative overflow-x-clip bg-dark text-on-dark">
      <FooterCurve />
      <div className="wrap pb-8 pt-32 sm:pt-44">
        <div className="max-w-5xl">
          <div className="flex items-center gap-5">
            <ShellButton
              label={dict.ui.openTerminal}
              className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-on-dark/10 font-mono text-lg text-on-dark transition-colors hover:bg-accent sm:h-24 sm:w-24 sm:text-2xl"
            />
            <h2 className="big text-[clamp(2.6rem,7vw,6.2rem)]">{dict.footer.lets}</h2>
          </div>
          <h2 className="big text-[clamp(2.6rem,7vw,6.2rem)]">{dict.footer.together}</h2>
        </div>

        <div className="relative mt-16 border-b border-dark-rule sm:mt-20">
          <ScrollShift from="-22vw" className="absolute right-[8%] top-0 -translate-y-1/2">
            <Magnetic strength={0.45}>
              <a
                href={`mailto:${profile.email}`}
                className="pill grid h-36 w-36 place-items-center rounded-full border-transparent bg-accent px-0 text-base text-on-accent sm:h-44 sm:w-44 sm:text-lg [&::before]:bg-on-dark hover:text-dark"
              >
                {dict.footer.cta}
              </a>
            </Magnetic>
          </ScrollShift>
        </div>

        <div className="mt-24 flex flex-wrap gap-3 sm:mt-16">
          <Magnetic strength={0.3}>
            <a href={`mailto:${profile.email}`} className="pill border-dark-rule">
              {profile.email}
            </a>
          </Magnetic>
          <Magnetic strength={0.3}>
            <a href={profile.cv[locale]} target="_blank" rel="noreferrer" className="pill border-dark-rule">
              CV · PDF
            </a>
          </Magnetic>
          <Magnetic strength={0.3}>
            <Link href={href(locale, "/resume")} className="pill border-dark-rule">
              {dict.nav.resume}
            </Link>
          </Magnetic>
        </div>

        <div className="mt-28 flex flex-col gap-8 text-sm sm:flex-row sm:items-end sm:justify-between">
          <div className="flex gap-10">
            <div>
              <p className="eyebrow text-on-dark-muted">{dict.footer.version}</p>
              <p className="mt-2">{dict.footer.edition}</p>
            </div>
            <div>
              <p className="eyebrow text-on-dark-muted">{dict.footer.localTime}</p>
              <p className="mt-2">
                <LocalTime />
              </p>
            </div>
          </div>
          <div>
            <p className="eyebrow text-on-dark-muted">{dict.footer.socials}</p>
            <ul className="mt-2 flex flex-wrap gap-x-6 gap-y-1">
              {socials.map(([name, url]) => (
                <li key={name}>
                  <a href={url} target="_blank" rel="noreferrer" className="ulink">
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-10 hidden font-mono text-xs text-on-dark-muted sm:block">{dict.footer.hint}</p>
      </div>
    </footer>
  );
}
