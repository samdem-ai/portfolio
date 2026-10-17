export const locales = ["en", "fr"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

/** A string that exists in every supported language. */
export type L = Record<Locale, string>;

export const hasLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

export const t = (value: L, locale: Locale) => value[locale];

export const otherLocale = (locale: Locale): Locale => (locale === "en" ? "fr" : "en");

/** Builds a locale-prefixed path: href("fr", "/lab") -> "/fr/lab". */
export const href = (locale: Locale, path = "") =>
  `/${locale}${path === "/" ? "" : path}`;
