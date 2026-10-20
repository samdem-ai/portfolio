import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PrintButton } from "@/components/PrintButton";
import { certifications, experience, podiums } from "@/content/experience";
import { profile, skills, skillText } from "@/content/profile";
import { getWork } from "@/lib/work";
import { getDictionary } from "@/lib/dictionary";
import { hasLocale, t } from "@/lib/i18n";
import { alternates } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/resume">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = getDictionary(lang);
  return { title: dict.resume.title, description: dict.meta.description, alternates: alternates(lang, "/resume") };
}

const summary = {
  en: "Cybersecurity engineer (ESTIN, 2026) with an engineering degree and a Master's in computer science and cybersecurity. Six-month thesis internship at Air Algérie building a DFIR platform (Velociraptor, Elastic, secured LLM assistant). Hands-on experience in security auditing, vulnerability assessment, incident detection and analysis, malware reverse engineering, and technical training.",
  fr: "Ingénieur en cybersécurité (ESTIN, 2026), titulaire d'un diplôme d'ingénieur et d'un master en informatique et cybersécurité. Stage de fin d'études de six mois chez Air Algérie : conception d'une plateforme DFIR (Velociraptor, Elastic, assistant LLM sécurisé). Expérience pratique en audit de sécurité, évaluation de vulnérabilités, détection et analyse d'incidents, rétro-ingénierie de malwares et formation technique.",
};

function H({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 mt-8 border-b border-rule pb-2 text-xs uppercase tracking-[0.06em] text-muted print:mt-4">{children}</h2>
  );
}

export default async function ResumePage({ params }: PageProps<"/[lang]/resume">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const selected = ["dfir-platform", "malware-lab", "promptvault", "safeguard-classifier", "nutridz", "brickwave"]
    .map((s) => getWork(lang).find((p) => p.slug === s)!)
    .filter(Boolean);

  return (
    <>
      <section className="no-print bg-dark pb-16 pt-40 text-on-dark sm:pt-48">
        <div className="wrap">
          <h1 className="big text-[clamp(2.8rem,7vw,6rem)]">{dict.resume.title}</h1>
          <p className="mt-6 max-w-[56ch] text-on-dark-muted">{dict.resume.lede}</p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            <PrintButton label={dict.resume.print} />
            <a href={profile.cv.en} target="_blank" rel="noreferrer" className="pill border-dark-rule">
              {dict.resume.pdfEn} ↓
            </a>
            <a href={profile.cv.fr} target="_blank" rel="noreferrer" className="pill border-dark-rule">
              {dict.resume.pdfFr} ↓
            </a>
          </div>
        </div>
      </section>
      <div className="mx-auto max-w-3xl px-5 pb-36 pt-16 sm:px-8 print:max-w-none print:p-0">
      <article className="print:p-0">
        <header>
          <p className="big text-4xl print:text-3xl">{profile.fullName}</p>
          <p className="mt-1 text-ink-2">{t(profile.role, lang)} · {t(profile.location, lang)}</p>
          <p className="mt-1 font-mono text-xs text-ink-2">
            {profile.email} · linkedin.com/in/samy-debaili · github.com/samdem-ai · tryhackme.com/p/samdem
          </p>
        </header>

        <H>{dict.resume.profile}</H>
        <p className="text-[0.95rem] text-ink-2">{summary[lang]}</p>

        <H>{dict.resume.education}</H>
        <div className="flex flex-wrap justify-between gap-x-4 text-[0.95rem]">
          <span className="font-semibold">
            {lang === "fr" ? "Diplôme d'ingénieur et master, informatique et cybersécurité" : "Engineering degree & Master's, Computer Science and Cybersecurity"}
          </span>
          <span className="font-mono text-xs text-muted">2021 – 2026</span>
        </div>
        <p className="text-[0.95rem] text-ink-2">ESTIN, Béjaïa · {lang === "fr" ? "spécialisation cybersécurité" : "cybersecurity specialisation"}</p>

        <H>{dict.resume.experience}</H>
        <div className="space-y-3">
          {experience.map((e) => (
            <div key={e.title.en} className="break-inside-avoid">
              <div className="flex flex-wrap justify-between gap-x-4 text-[0.95rem]">
                <span>
                  <span className="font-semibold">{t(e.title, lang)}</span>, {t(e.where, lang)}
                </span>
                <span className="font-mono text-xs text-muted">{t(e.when, lang)}</span>
              </div>
              <ul className="mt-0.5 text-[0.9rem] text-ink-2">
                {e.points.map((p) => (
                  <li key={p.en} className="pl-4 -indent-4">– {t(p, lang)}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <H>{dict.resume.projects}</H>
        <ul className="space-y-1.5 text-[0.9rem]">
          {selected.map((p) => (
            <li key={p.slug} className="break-inside-avoid">
              <span className="font-semibold">{p.title}</span>
              <span className="text-ink-2">{lang === "fr" ? " : " : ": "}{p.summary}</span>
            </li>
          ))}
        </ul>

        <H>{dict.resume.skills}</H>
        <dl className="space-y-1 text-[0.9rem]">
          {skills.map((g) => (
            <div key={g.group.en} className="grid grid-cols-[minmax(0,10rem)_1fr] gap-3">
              <dt className="font-semibold">{t(g.group, lang)}</dt>
              <dd className="text-ink-2">{g.items.map((i) => skillText(i, lang)).join(", ")}</dd>
            </div>
          ))}
        </dl>

        <H>{dict.resume.awards}</H>
        <ul className="text-[0.9rem] text-ink-2">
          {podiums.map((p) => (
            <li key={p.event.en}>
              <span className="font-semibold text-ink">{p.place}</span>: {t(p.event, lang)}
            </li>
          ))}
          {certifications.map((c) => (
            <li key={c.name}>
              <span className="font-semibold text-ink">{c.name}</span>, {c.issuer}
              {c.year && ` (${c.year})`}
            </li>
          ))}
        </ul>

        <H>{dict.resume.languages}</H>
        <p className="text-[0.9rem] text-ink-2">
          {lang === "fr"
            ? "Arabe : langue maternelle · Français : courant · Anglais : IELTS 8.0/9.0 (C1)"
            : "Arabic: native · French: fluent · English: IELTS 8.0/9.0 (C1)"}
        </p>
      </article>
      </div>
    </>
  );
}
