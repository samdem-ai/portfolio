import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Magnetic } from "@/components/motion/Magnetic";
import { Words } from "@/components/motion/Words";
import { ResultsGrid } from "@/components/post-ui";
import { getDictionary } from "@/lib/dictionary";
import { hasLocale, href } from "@/lib/i18n";
import { alternates } from "@/lib/seo";
import { getPost, getPostSlugs, getWork } from "@/lib/work";

export async function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/work/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const post = hasLocale(lang) ? getPost(slug, lang) : undefined;
  if (!hasLocale(lang) || !post) return {};
  return { title: post.title, description: post.summary, alternates: alternates(lang, `/work/${slug}`) };
}

export default function PostPage({ params }: PageProps<"/[lang]/work/[slug]">) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-dark" />}>
      <Post params={params} />
    </Suspense>
  );
}

async function Post({ params }: { params: PageProps<"/[lang]/work/[slug]">["params"] }) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const post = getPost(slug, lang);
  if (!post) notFound();
  const dict = getDictionary(lang);
  const fr = lang === "fr";
  const { default: Body } = await import(`@/content/work/${slug}/${post.postLocale}.mdx`);

  const posts = getWork(lang).filter((w) => w.page);
  const next = posts[(posts.findIndex((p) => p.slug === slug) + 1) % posts.length];

  const meta = [
    { label: fr ? "Type" : "Kind", value: post.kind === "security" ? dict.work.kindSecurity : dict.work.kindProduct },
    { label: dict.ui.year, value: post.year },
    ...(post.status ? [{ label: "Status", value: post.status }] : []),
  ];

  return (
    <article lang={post.postLocale}>
      <section className="bg-dark pb-20 pt-40 text-on-dark sm:pb-28 sm:pt-52">
        <div className="wrap">
          <Words as="h1" text={post.title} className="big block text-[clamp(3rem,9vw,8.5rem)]" />
          <p data-fade="0.25" className="mt-10 max-w-[44ch] text-[clamp(1.15rem,1.7vw,1.5rem)] leading-snug text-on-dark-muted">
            {post.summary}
          </p>
        </div>
      </section>

      <section className="wrap pt-16">
        <dl data-fade className="grid gap-y-8 border-b border-rule pb-10 sm:grid-cols-2 lg:grid-cols-4">
          {meta.map((m) => (
            <div key={m.label}>
              <dt className="eyebrow">{m.label}</dt>
              <dd className="mt-3 border-t border-rule pt-3">{m.value}</dd>
            </div>
          ))}
          <div>
            <dt className="eyebrow">{dict.ui.links}</dt>
            <dd className="mt-3 flex flex-wrap gap-x-5 border-t border-rule pt-3">
              {post.live && (
                <a href={post.live} target="_blank" rel="noreferrer" className="ulink">
                  {dict.ui.live} ↗
                </a>
              )}
              {post.repo && (
                <a href={post.repo} target="_blank" rel="noreferrer" className="ulink">
                  {dict.ui.repo} ↗
                </a>
              )}
              {!post.live && !post.repo && <span className="text-muted">—</span>}
            </dd>
          </div>
        </dl>

        {post.stack && (
          <ul data-fade className="mt-8 flex flex-wrap gap-2">
            {post.stack.map((s) => (
              <li key={s} className="rounded-full border border-rule px-4 py-2 text-sm text-ink-2">
                {s}
              </li>
            ))}
          </ul>
        )}

        {post.cover && (
          <figure data-fade className="mt-16 overflow-hidden rounded-2xl bg-panel px-[5vw] pt-[5vw]">
            {/* eslint-disable-next-line @next/next/no-img-element -- static screenshot, already sized and compressed */}
            <img
              src={post.cover}
              alt={fr ? `Capture d'écran de ${post.title}` : `Screenshot of ${post.title}`}
              width={1440}
              height={900}
              className="block w-full rounded-t-lg shadow-[0_30px_80px_-20px_rgb(0_0_0/0.45)]"
            />
          </figure>
        )}

        <div className="mt-20 grid gap-x-16 gap-y-12 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            {post.postLocale !== lang && (
              <p lang={lang} className="mb-8 rounded-lg bg-panel px-4 py-3 text-sm">
                {fr ? "Cet article n'existe pour l'instant qu'en anglais." : "This post is only available in French for now."}
              </p>
            )}
            {post.why && (
              <div data-fade className="lg:sticky lg:top-12">
                <p className="eyebrow">{dict.work.why}</p>
                <p className="mt-3 text-[1.25rem] leading-snug tracking-[-0.01em]">{post.why}</p>
                {post.note && <p className="mt-5 text-sm text-muted">{post.note}</p>}
              </div>
            )}
          </aside>
          <div data-fade className="prose lg:col-span-8">
            <Body components={{ Results: () => <ResultsGrid items={post.results} /> }} />
          </div>
        </div>
      </section>

      {next && next.slug !== slug && (
        <section className="wrap pb-36 pt-36 text-center">
          <p className="eyebrow">{dict.work.next}</p>
          <Link href={next.page!} data-label={next.title} className="group mt-6 inline-block">
            <span className="big block text-[clamp(2.8rem,8vw,7rem)] transition-colors duration-300 group-hover:text-accent">{next.title}</span>
          </Link>
          <div className="mt-14 flex justify-center">
            <Magnetic strength={0.35}>
              <Link href={href(lang, "/work")} className="pill">
                {dict.ui.back}
                <sup className="text-xs">{posts.length}</sup>
              </Link>
            </Magnetic>
          </div>
        </section>
      )}
    </article>
  );
}
