import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WorkIndex } from "@/components/motion/WorkIndex";
import { PageHero } from "@/components/PageHero";
import { archive } from "@/content/projects";
import { getDictionary } from "@/lib/dictionary";
import { hasLocale, t } from "@/lib/i18n";
import { alternates } from "@/lib/seo";
import { getWork, toRows } from "@/lib/work";

export async function generateMetadata({ params }: PageProps<"/[lang]/work">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  return { title: getDictionary(lang).nav.work, alternates: alternates(lang, "/work") };
}

export default async function WorkPage({ params }: PageProps<"/[lang]/work">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const work = getWork(lang);

  return (
    <>
      <PageHero title={dict.work.title} />
      <section className="wrap pb-36 pt-20">
        <div data-fade>
          <WorkIndex
            rows={toRows(work, dict)}
            kinds={Object.fromEntries(work.map((w) => [w.slug, w.kind]))}
            labels={{ all: dict.work.all, security: dict.work.security, product: dict.work.product, view: dict.ui.view }}
          />
        </div>
        <p data-fade className="mt-14 text-sm text-muted">
          <span className="mr-2 text-ink">{dict.work.archive}:</span>
          {archive.map((a, i) => (
            <span key={a.name}>
              <a href={a.href} target="_blank" rel="noreferrer" className="ulink text-ink-2">
                {a.name}
              </a>{" "}
              ({t(a.desc, lang)}){i < archive.length - 1 && ", "}
            </span>
          ))}
        </p>
      </section>
    </>
  );
}
