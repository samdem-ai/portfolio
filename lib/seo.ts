import type { Metadata } from "next";
import { locales, type Locale } from "./i18n";

/** Canonical + hreflang alternates for a path that exists in every locale. */
export function alternates(locale: Locale, path = ""): Metadata["alternates"] {
  return {
    canonical: `/${locale}${path}`,
    languages: {
      ...Object.fromEntries(locales.map((l) => [l, `/${l}${path}`])),
      "x-default": `/en${path}`,
    },
  };
}
