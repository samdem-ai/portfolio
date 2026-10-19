import { profile } from "@/content/profile";
import { getDictionary } from "@/lib/dictionary";
import { href, type Locale } from "@/lib/i18n";
import { getWork } from "@/lib/work";

/** Everything the client-side terminal and palette need, already localised and serialisable. */
export function getShellData(locale: Locale) {
  const dict = getDictionary(locale);
  return {
    locale,
    email: profile.email,
    cv: profile.cv[locale],
    links: profile.links,
    pages: [
      { id: "home", label: dict.nav.home, href: href(locale) },
      { id: "work", label: dict.nav.work, href: href(locale, "/work") },
      { id: "about", label: dict.nav.about, href: href(locale, "/about") },
      { id: "lab", label: dict.nav.lab, href: href(locale, "/lab") },
      { id: "uses", label: dict.nav.uses, href: href(locale, "/uses") },
      { id: "resume", label: dict.nav.resume, href: href(locale, "/resume") },
    ],
    projects: getWork(locale).map((w) => ({
      slug: w.slug,
      name: w.title,
      oneLiner: w.summary,
      stack: w.stack ?? [],
      repo: w.repo,
      live: w.live,
      page: w.page,
    })),
    labels: {
      openTerminal: dict.ui.openTerminal,
      copyEmail: dict.ui.copyEmail,
      copied: dict.ui.copied,
      language: dict.ui.language,
      theme: dict.ui.theme,
      themeNames: dict.ui.themeNames,
      readCase: dict.ui.readCase,
    },
  };
}

export type ShellData = ReturnType<typeof getShellData>;
