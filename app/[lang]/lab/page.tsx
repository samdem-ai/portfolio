import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { specimens } from "@/content/specimens";
import { getDictionary } from "@/lib/dictionary";
import { hasLocale, t } from "@/lib/i18n";
import { alternates } from "@/lib/seo";
import { getPost } from "@/lib/work";

export async function generateMetadata({ params }: PageProps<"/[lang]/lab">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = getDictionary(lang);
  return { title: dict.lab.title, description: dict.lab.lede, alternates: alternates(lang, "/lab") };
}

export default async function LabPage({ params }: PageProps<"/[lang]/lab">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const lab = getPost("malware-lab", lang);

  return (
    <>
      <PageHero title={dict.lab.title}>
        <div data-fade="0.3" className="mt-12 grid gap-8 md:grid-cols-12">
          <p className="max-w-[56ch] text-lg text-on-dark-muted md:col-span-7">{dict.lab.lede}</p>
          {lab && (
            <p className="flex flex-wrap gap-x-6 gap-y-2 md:col-span-4 md:col-start-9 md:justify-end">
              <Link href={lab.page!} className="ulink" data-label="malware-lab">
                {dict.lab.toolkit} →
              </Link>
              {lab.live && (
                <a href={lab.live} target="_blank" rel="noreferrer" className="ulink">
                  {dict.lab.full} ↗
                </a>
              )}
            </p>
          )}
        </div>
      </PageHero>

      <section className="wrap pb-36 pt-20">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {specimens.map((s, i) => (
            <li
              key={s.name}
              data-fade={(i % 3) * 0.08}
              className="group flex flex-col rounded-2xl bg-panel p-6 transition-transform duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-dark px-3 py-1 text-xs text-on-dark">{s.type}</span>
                <span className="font-mono text-xs text-muted">№ {String(i + 1).padStart(3, "0")}</span>
              </div>
              <h2 className="mt-6 break-words font-mono text-[0.95rem] font-medium">{s.name}</h2>
              <p className="mt-1 font-mono text-xs text-muted">
                {dict.lab.alias} <span className="line-through">{s.alias}</span>
              </p>
              <p className="mt-4 flex-1 text-ink-2">{t(s.behaviour, lang)}</p>
              <div className="mt-6 space-y-4 border-t border-rule pt-4">
                <div>
                  <h3 className="eyebrow">{dict.lab.iocs}</h3>
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {s.iocs.map((ioc) => (
                      <li key={ioc} className="rounded-md bg-canvas px-2 py-0.5 font-mono text-[0.72rem]">
                        {ioc}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="eyebrow">{dict.lab.attack}</h3>
                  <ul className="mt-2 space-y-0.5 text-[0.85rem]">
                    {s.attack.map((a) => (
                      <li key={a.id}>
                        <a href={`https://attack.mitre.org/techniques/${a.id.replace(".", "/")}/`} target="_blank" rel="noreferrer" className="ulink font-mono">
                          {a.id}
                        </a>{" "}
                        <span className="text-muted">{a.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-10 text-sm text-muted">
          {lang === "fr"
            ? "Analysés dans une VM isolée, sans réseau réel. Ne faites pas ça sur votre machine perso."
            : "Analysed in an isolated VM with no real network. Don't do this on your daily driver."}
        </p>
      </section>
    </>
  );
}
