import type { MetadataRoute } from "next";
import { site } from "@/content/profile";
import { locales } from "@/lib/i18n";
import { getPostSlugs } from "@/lib/work";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/lab", "/uses", "/resume", ...getPostSlugs().map((slug) => `/work/${slug}`)];
  return paths.map((path) => ({
    url: `${site.url}/en${path}`,
    alternates: { languages: Object.fromEntries(locales.map((l) => [l, `${site.url}/${l}${path}`])) },
  }));
}
