import fs from "node:fs";
import path from "node:path";
import { parse } from "yaml";
import { projects as extraProjects } from "@/content/projects";
import { t, type Locale } from "@/lib/i18n";
import { tocFromSource, type TocItem } from "@/lib/toc";

const WORK_DIR = path.join(process.cwd(), "content/work");

/** Frontmatter of a post in content/work/<slug>/<locale>.mdx. See content/work/README.md. */
export type PostMeta = {
  title: string;
  kind: "security" | "product";
  year: string;
  order?: number;
  status?: string;
  summary: string;
  why?: string;
  note?: string;
  stack?: string[];
  /** Screenshot under public/, e.g. /work/<slug>/cover.webp */
  cover?: string;
  repo?: string;
  live?: string;
  results?: { value: string; label: string }[];
  draft?: boolean;
};

export type WorkItem = PostMeta & {
  slug: string;
  /** Path of the case-study page, when the project has a post. */
  page?: string;
  /** The language the post is actually written in (falls back to English). */
  postLocale?: Locale;
};

function readMeta(file: string): PostMeta {
  const raw = fs.readFileSync(file, "utf8");
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) throw new Error(`${file}: missing frontmatter`);
  const meta = parse(match[1]) as PostMeta;
  for (const key of ["title", "kind", "year", "summary"] as const) {
    if (!meta[key]) throw new Error(`${file}: frontmatter needs "${key}"`);
  }
  meta.year = String(meta.year);
  return meta;
}

/** Slugs of every post folder that has at least an en.mdx and isn't a draft. */
export function getPostSlugs(): string[] {
  return fs
    .readdirSync(WORK_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && fs.existsSync(path.join(WORK_DIR, d.name, "en.mdx")))
    .map((d) => d.name)
    .filter((slug) => !readMeta(path.join(WORK_DIR, slug, "en.mdx")).draft);
}

/** The locale a post is available in: the requested one if written, otherwise English. */
export function postLocale(slug: string, locale: Locale): Locale {
  return fs.existsSync(path.join(WORK_DIR, slug, `${locale}.mdx`)) ? locale : "en";
}

export function getPost(slug: string, locale: Locale): WorkItem | undefined {
  if (!getPostSlugs().includes(slug)) return undefined;
  const lang = postLocale(slug, locale);
  return { ...readMeta(path.join(WORK_DIR, slug, `${lang}.mdx`)), slug, page: `/${locale}/work/${slug}`, postLocale: lang };
}

/** The post's `##`/`###` headings, for the table of contents. */
export function getPostToc(slug: string, locale: Locale): TocItem[] {
  const file = path.join(WORK_DIR, slug, `${postLocale(slug, locale)}.mdx`);
  return tocFromSource(fs.readFileSync(file, "utf8"));
}

/** Posts plus the smaller projects from content/projects.ts, sorted for display. */
export function getWork(locale: Locale): WorkItem[] {
  const posts = getPostSlugs().map((slug) => getPost(slug, locale)!);
  const extras: WorkItem[] = extraProjects.map((p) => ({
    slug: p.slug,
    title: p.name,
    kind: p.kind,
    year: p.year,
    order: p.order,
    status: p.status && t(p.status, locale),
    summary: t(p.oneLiner, locale),
    stack: p.stack,
    cover: p.cover,
    repo: p.repo,
    live: p.live,
  }));
  return [...posts, ...extras].sort((a, b) => (a.order ?? 99) - (b.order ?? 99) || b.year.localeCompare(a.year));
}

/** Shape the work list for the animated <WorkList>. */
export function toRows(items: WorkItem[], dict: { work: { kindSecurity: string; kindProduct: string } }) {
  return items.map((w) => ({
    slug: w.slug,
    title: w.title,
    kind: w.kind === "security" ? dict.work.kindSecurity : dict.work.kindProduct,
    year: w.year,
    summary: w.summary,
    href: (w.page ?? w.live ?? w.repo)!,
    external: !w.page,
    stack: w.stack ?? [],
    cover: w.cover,
    stat: w.results?.[0],
    status: w.status,
  }));
}
