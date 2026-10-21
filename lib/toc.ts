/** Heading slugs + table-of-contents extraction, shared by the MDX heading
 *  components (which stamp the id) and the post page (which builds the list). */

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // drops backticks, punctuation, accents-free ascii only
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export type TocItem = { level: 2 | 3; text: string; id: string };

/** Parse `##` and `###` headings out of an MDX source (frontmatter stripped). */
export function tocFromSource(src: string): TocItem[] {
  const body = src.replace(/^---\r?\n[\s\S]*?\r?\n---/, "");
  const items: TocItem[] = [];
  let inFence = false;
  for (const line of body.split("\n")) {
    if (/^\s*```/.test(line)) inFence = !inFence; // skip headings inside code fences
    if (inFence) continue;
    const m = /^(#{2,3})\s+(.*\S)\s*$/.exec(line);
    if (!m) continue;
    items.push({ level: m[1].length as 2 | 3, text: m[2].replace(/`/g, ""), id: slugify(m[2]) });
  }
  return items;
}
