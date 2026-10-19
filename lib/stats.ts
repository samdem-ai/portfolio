import { cacheLife } from "next/cache";

export type Stats = {
  thm: { rank: number; topPercent: number; rooms: number };
  githubRepos: number;
  live: boolean;
};

// Values as of 2026-10-20, used whenever an API is unreachable.
const fallback: Stats = {
  thm: { rank: 39704, topPercent: 2, rooms: 125 },
  githubRepos: 33,
  live: false,
};

async function getJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, {
      headers: { "user-agent": "samy-portfolio", accept: "application/json" },
      signal: AbortSignal.timeout(5000),
    });
    return res.ok ? ((await res.json()) as T) : null;
  } catch {
    return null;
  }
}

export async function getStats(): Promise<Stats> {
  "use cache";
  cacheLife("days");

  const [thm, gh] = await Promise.all([
    getJson<{ data?: { rank?: number; topPercentage?: number; completedRoomsNumber?: number } }>(
      "https://tryhackme.com/api/v2/public-profile?username=samdem",
    ),
    getJson<{ public_repos?: number }>("https://api.github.com/users/samdem-ai"),
  ]);

  const d = thm?.data;
  return {
    thm: {
      rank: d?.rank ?? fallback.thm.rank,
      topPercent: d?.topPercentage ?? fallback.thm.topPercent,
      rooms: d?.completedRoomsNumber ?? fallback.thm.rooms,
    },
    githubRepos: gh?.public_repos ?? fallback.githubRepos,
    live: Boolean(d || gh),
  };
}
