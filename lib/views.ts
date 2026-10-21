/** Per-post view counts, stored in Upstash Redis via its REST API (no SDK).
 *  Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in the environment
 *  (or the KV_REST_API_* pair the Vercel Upstash integration injects).
 *  Without them every call returns null and the counter simply hides. */

const URL = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

async function cmd(path: string): Promise<number | null> {
  if (!URL || !TOKEN) return null;
  try {
    const res = await fetch(`${URL}/${path}`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { result: number | string | null };
    return data.result == null ? 0 : Number(data.result);
  } catch {
    return null;
  }
}

const key = (slug: string) => `views:${encodeURIComponent(slug)}`;

export const bumpViews = (slug: string) => cmd(`incr/${key(slug)}`);
export const readViews = (slug: string) => cmd(`get/${key(slug)}`);
