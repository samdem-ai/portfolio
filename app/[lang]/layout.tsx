import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { Footer } from "@/components/Footer";
import { Menu } from "@/components/motion/Menu";
import { MotionRoot } from "@/components/motion/MotionRoot";
import { PageTransition } from "@/components/motion/PageTransition";
import { Preloader } from "@/components/motion/Preloader";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { profile } from "@/content/profile";
import { Header } from "@/components/Header";
import { Shell } from "@/components/shell/Shell";
import { site } from "@/content/profile";
import { getDictionary } from "@/lib/dictionary";
import { fontVariables } from "@/lib/fonts";
import { hasLocale, href, locales } from "@/lib/i18n";
import { getShellData } from "@/lib/shell-data";
import { sourceNote, themeScript } from "@/lib/theme-script";

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = getDictionary(lang);
  return {
    metadataBase: new URL(site.url),
    title: { default: dict.meta.title, template: `%s · Samy Debaili` },
    description: dict.meta.description,
    authors: [{ name: "Samy Debaili", url: site.url }],
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: lang === "fr" ? "fr_DZ" : "en_US",
      title: dict.meta.title,
      description: dict.meta.description,
    },
    twitter: { card: "summary_large_image" },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1c1d20" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0c0d" },
  ],
};

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <html lang={lang} className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <noscript>
          <style>{".preloader{display:none}"}</style>
        </noscript>
      </head>
      <body className="min-h-dvh">
        <div hidden dangerouslySetInnerHTML={{ __html: sourceNote }} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-50 focus:bg-ink focus:px-3 focus:py-2 focus:text-canvas"
        >
          {dict.ui.skip}
        </a>
        <Preloader />
        <Header locale={lang} dict={dict} />
        <main id="main">{children}</main>
        <Footer locale={lang} dict={dict} />
        <Menu
          locale={lang}
          items={[
            { label: dict.nav.home, href: href(lang) },
            { label: dict.nav.work, href: href(lang, "/work") },
            { label: dict.nav.about, href: href(lang, "/about") },
            { label: dict.nav.lab, href: href(lang, "/lab") },
            { label: dict.nav.uses, href: href(lang, "/uses") },
            { label: dict.nav.resume, href: href(lang, "/resume") },
          ]}
          socials={[
            { label: "GitHub", href: profile.links.github },
            { label: "LinkedIn", href: profile.links.linkedin },
            { label: "TryHackMe", href: profile.links.tryhackme },
            { label: "Root-Me", href: profile.links.rootme },
          ]}
          labels={{
            menu: dict.ui.menu,
            close: dict.ui.close,
            navigation: dict.ui.navigation,
            socials: dict.ui.socials,
            terminal: dict.ui.openTerminal,
            palette: dict.ui.palette,
            theme: dict.ui.theme,
            language: dict.ui.language,
          }}
        />
        <Shell data={getShellData(lang)} />
        <SmoothScroll />
        <PageTransition />
        <MotionRoot />
      </body>
    </html>
  );
}
