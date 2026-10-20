import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Globe } from "@/components/motion/Globe";
import { HeroPortrait } from "@/components/motion/HeroPortrait";
import { Magnetic } from "@/components/motion/Magnetic";
import { Marquee } from "@/components/motion/Marquee";
import { SlidingRows } from "@/components/motion/SlidingRows";
import { WorkList } from "@/components/motion/WorkList";
import { Words } from "@/components/motion/Words";
import { specimens } from "@/content/specimens";
import { getDictionary } from "@/lib/dictionary";
import { hasLocale, href } from "@/lib/i18n";
import { alternates } from "@/lib/seo";
import { getWork, toRows } from "@/lib/work";

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  return hasLocale(lang) ? { alternates: alternates(lang) } : {};
}

const tools = ["Ghidra", "IDA Pro", "x64 assembly", "YARA", "Velociraptor", "Elastic", "MITRE ATT&CK", "Wireshark", "Burp Suite", "Docker", "Python", "TypeScript"];

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const work = getWork(lang);
  const recent = toRows(work.filter((w) => w.page).slice(0, 4), dict);

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-hero text-on-dark">
        <HeroPortrait alt={lang === "fr" ? "Illustration de Samy Debaili" : "Illustration of Samy Debaili"} />
        <div className="wrap relative z-10 flex flex-1 items-start pt-32 md:items-center md:pt-28">
          <div className="flex w-full flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div data-fade="0.2" className="-ml-[clamp(1.25rem,5vw,5rem)] flex w-max items-center gap-6 rounded-r-full bg-dark-2 py-4 pl-[clamp(1.25rem,5vw,5rem)] pr-4">
              <p className="text-[0.95rem] leading-tight">
                {dict.hero.located}
                <br />
                {dict.hero.place}
              </p>
              <span className="grid h-16 w-16 place-items-center rounded-full bg-on-dark/10" aria-hidden>
                <Globe className="text-[0.9rem]" />
              </span>
            </div>
            <div data-fade="0.35" className="md:mr-[6%]">
              <svg viewBox="0 0 24 24" className="mb-6 h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <path d="M5 5l14 14M19 8v11H8" />
              </svg>
              <p className="text-[clamp(1.6rem,2.6vw,2.4rem)] font-medium leading-[1.15] tracking-[-0.02em]">
                {dict.hero.role1}
                <br />
                {dict.hero.role2}
              </p>
            </div>
          </div>
        </div>
        <h1 className="sr-only">Samy Debaili, {dict.hero.role1.toLowerCase()}</h1>
        <div className="relative pb-[4vh]">
          <Marquee text="Samy Debaili" maskFrom="hero-figure" className="text-[clamp(5.5rem,17vw,15rem)] font-medium leading-[1.1] tracking-[-0.045em]" />
        </div>
      </section>

      {/* Intro */}
      <section className="wrap pb-16 pt-24 sm:pt-36">
        <div className="grid gap-x-16 gap-y-10 lg:grid-cols-12">
          <Words as="p" text={dict.home.statement} className="text-[clamp(1.6rem,2.9vw,2.6rem)] font-medium leading-[1.25] tracking-[-0.02em] lg:col-span-8" />
          <div className="lg:col-span-4">
            <p data-fade="0.2" className="text-ink-2 lg:pt-2">
              {dict.home.sub}
            </p>
            <div className="mt-12 flex lg:mt-20">
              <Magnetic strength={0.4}>
                <Link
                  href={href(lang, "/about")}
                  className="pill grid h-40 w-40 place-items-center rounded-full border-transparent bg-dark px-0 text-base text-on-dark sm:h-48 sm:w-48"
                >
                  {dict.home.aboutMe}
                </Link>
              </Magnetic>
            </div>
          </div>
        </div>
      </section>

      {/* Recent work */}
      <section className="wrap pb-16 pt-10" aria-labelledby="recent">
        <h2 id="recent" className="eyebrow mb-8">
          {dict.home.recent}
        </h2>
        <div data-fade>
          <WorkList rows={recent} viewLabel={dict.ui.view} />
        </div>
        <div className="mt-16 flex justify-center">
          <Magnetic strength={0.35}>
            <Link href={href(lang, "/work")} className="pill">
              {dict.home.moreWork}
              <sup className="text-xs">{work.length}</sup>
            </Link>
          </Magnetic>
        </div>
      </section>

      {/* Sliding rows */}
      <section className="pb-36 pt-20" aria-hidden>
        <SlidingRows rows={[tools, specimens.map((s) => s.name)]} />
      </section>
    </>
  );
}
