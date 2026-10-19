import { getStats } from "@/lib/stats";
import type { Dictionary } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n";

export async function LiveStats({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const s = await getStats();
  const n = (v: number) => v.toLocaleString(locale === "fr" ? "fr-FR" : "en-US");
  const items = [
    { value: `#${n(s.thm.rank)}`, label: `${dict.stats.thmRank} · ${dict.stats.thmTop} ${s.thm.topPercent}%` },
    { value: n(s.thm.rooms), label: dict.stats.thmRooms },
    { value: n(s.githubRepos), label: dict.stats.repos },
  ];
  return (
    <dl className="grid gap-8 border-t border-rule pt-8 sm:grid-cols-3">
      {items.map((i) => (
        <div key={i.label} className="flex flex-col-reverse justify-end">
          <dt className="mt-2 text-sm text-muted">{i.label}</dt>
          <dd className="text-[clamp(2.4rem,4vw,3.6rem)] font-medium leading-none tracking-[-0.04em]">{i.value}</dd>
        </div>
      ))}
    </dl>
  );
}
