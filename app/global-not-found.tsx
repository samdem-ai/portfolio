import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { fontVariables } from "@/lib/fonts";
import { themeScript } from "@/lib/theme-script";

export const metadata: Metadata = {
  title: "404 · Samy Debaili",
  description: "This address points to nothing.",
};

export default function GlobalNotFound() {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="bg-dark">
        <main className="flex min-h-[100svh] flex-col justify-center bg-dark text-on-dark">
          <div className="wrap">
            <p className="text-on-dark-muted">© Code by Samy</p>
            <p className="big mt-8 text-[clamp(7rem,26vw,22rem)] leading-[0.85]">404</p>
            <p className="mt-10 max-w-[48ch] text-lg">This address points to nothing. Either the page moved, or you&apos;re fuzzing me. Both are fine.</p>
            <p className="mt-2 max-w-[48ch] text-on-dark-muted" lang="fr">
              Cette adresse ne pointe vers rien. Soit la page a bougé, soit vous êtes en train de me fuzzer.
            </p>
            <Link href="/" className="pill mt-10 border-dark-rule">
              ← Home
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
