import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { LiveStats } from "@/components/LiveStats";
import { Magnetic } from "@/components/motion/Magnetic";
import { PageHero } from "@/components/PageHero";
import { certifications, experience, podiums } from "@/content/experience";
import { profile, quickFacts, skills, skillText, strengths, workNotes } from "@/content/profile";
import { getDictionary } from "@/lib/dictionary";
import { hasLocale, t } from "@/lib/i18n";
import { alternates } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/about">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  return { title: getDictionary(lang).nav.about, alternates: alternates(lang, "/about") };
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="wrap mt-32">
      <h2 data-fade className="text-[clamp(1.8rem,3.4vw,3rem)] font-medium tracking-[-0.03em]">
        {title}
      </h2>
      <div data-fade className="mt-10">
        {children}
      </div>
    </section>
  );
}

export default async function AboutPage({ params }: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const a = dict.about;

  return (
    <>
      <PageHero title={a.title} />

      <section className="wrap pt-24">
        <div className="grid gap-x-16 gap-y-10 lg:grid-cols-12">
          <div className="lg:col-span-2">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              <path d="M5 5l14 14M19 8v11H8" />
            </svg>
          </div>
          <div className="space-y-5 text-[1.15rem] leading-relaxed text-ink-2 lg:col-span-6">
            <p data-fade>{a.intro}</p>
            <p data-fade="0.1">{a.intro2}</p>
            <div data-fade="0.2" className="flex flex-wrap gap-3 pt-6">
              <Magnetic strength={0.3}>
                <a href={profile.cv[lang]} target="_blank" rel="noreferrer" className="pill">
                  {a.cv} ↓
                </a>
              </Magnetic>
              <Magnetic strength={0.3}>
                <a href={profile.links.github} target="_blank" rel="noreferrer" className="pill border-rule">
                  GitHub ↗
                </a>
              </Magnetic>
            </div>
          </div>
          <dl data-fade="0.15" className="lg:col-span-4">
            {quickFacts.map((f) => (
              <div key={f.label.en} className="border-t border-rule py-4">
                <dt className="eyebrow">{t(f.label, lang)}</dt>
                <dd className="mt-1">{t(f.value, lang)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <Block title={a.helpTitle}>
        <div className="grid gap-12 md:grid-cols-3">
          {a.help.map((h, i) => (
            <div key={h.title}>
              <p className="border-b border-rule pb-6 text-sm text-muted">0{i + 1}</p>
              <h3 className="mt-6 text-2xl font-medium tracking-[-0.02em]">{h.title}</h3>
              <p className="mt-3 text-ink-2">{h.body}</p>
            </div>
          ))}
        </div>
      </Block>

      <Block title={a.logTitle}>
        <ul className="border-t border-rule">
          {experience.map((e) => (
            <li key={e.title.en} className="grid gap-x-8 gap-y-2 border-b border-rule py-8 md:grid-cols-[1.4fr_1fr_12rem]">
              <div>
                <h3 className="text-[clamp(1.3rem,2vw,1.7rem)] font-medium leading-tight tracking-[-0.02em]">{t(e.title, lang)}</h3>
                <ul className="mt-3 space-y-1 text-ink-2">
                  {e.points.map((p) => (
                    <li key={p.en}>{t(p, lang)}</li>
                  ))}
                </ul>
              </div>
              <p className="text-ink-2">{t(e.where, lang)}</p>
              <p className="text-ink-2 md:text-right">{t(e.when, lang)}</p>
            </li>
          ))}
        </ul>
        <div className="mt-20 grid gap-16 md:grid-cols-2">
          <div>
            <h3 className="eyebrow">{a.podiumTitle}</h3>
            <ul className="mt-4 border-t border-rule">
              {podiums.map((p) => (
                <li key={p.event.en} className="grid grid-cols-[6rem_1fr] items-baseline gap-4 border-b border-rule py-4">
                  <span className="text-2xl font-medium tracking-[-0.03em]">{p.place}</span>
                  <span className="text-ink-2">{t(p.event, lang)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="eyebrow">{a.certsTitle}</h3>
            <ul className="mt-4 border-t border-rule">
              {certifications.map((c) => (
                <li key={c.name} className="border-b border-rule py-4">
                  <span className="block">{c.name}</span>
                  <span className="text-sm text-muted">
                    {c.issuer}
                    {c.year && ` · ${c.year}`}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Block>

      <Block title={`${a.strongTitle} / ${a.learningTitle.toLowerCase()}`}>
        <div className="grid gap-16 md:grid-cols-2">
          <ul className="border-t border-rule">
            {strengths.strong.map((s) => (
              <li key={s.en} className="flex gap-4 border-b border-rule py-4">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-ink" aria-hidden />
                {t(s, lang)}
              </li>
            ))}
          </ul>
          <div>
            <ul className="border-t border-rule">
              {strengths.learning.map((s) => (
                <li key={s.en} className="flex gap-4 border-b border-rule py-4 text-ink-2">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full border border-ink-2" aria-hidden />
                  {t(s, lang)}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm text-muted">{a.honest}</p>
          </div>
        </div>
      </Block>

      <Block title={a.howTitle}>
        <div className="grid gap-12 md:grid-cols-3">
          {workNotes.map((n, i) => (
            <div key={n.title.en}>
              <p className="border-b border-rule pb-6 text-sm text-muted">0{i + 1}</p>
              <h3 className="mt-6 text-xl font-medium">{t(n.title, lang)}</h3>
              <p className="mt-3 text-ink-2">{t(n.body, lang)}</p>
            </div>
          ))}
        </div>
      </Block>

      <Block title={a.skillsTitle}>
        <dl className="border-t border-rule">
          {skills.map((g) => (
            <div key={g.group.en} className="grid gap-x-8 gap-y-1 border-b border-rule py-5 md:grid-cols-[16rem_1fr]">
              <dt className="font-medium">{t(g.group, lang)}</dt>
              <dd className="text-ink-2">{g.items.map((i) => skillText(i, lang)).join(", ")}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-16">
          <p className="eyebrow mb-4">
            {a.statsTitle} · {dict.stats.note}
          </p>
          <Suspense fallback={<div className="h-[118px]" />}>
            <LiveStats dict={dict} locale={lang} />
          </Suspense>
        </div>
      </Block>
      <div className="h-36" />
    </>
  );
}
