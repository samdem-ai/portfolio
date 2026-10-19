"use client";

import { useState } from "react";
import { WorkList, type WorkRow } from "./WorkList";

type Filter = "all" | "security" | "product";

/** Filter pills above the full project list. */
export function WorkIndex({ rows, kinds, labels }: { rows: WorkRow[]; kinds: Record<string, "security" | "product">; labels: Record<Filter, string> & { view: string } }) {
  const [filter, setFilter] = useState<Filter>("all");
  const shown = filter === "all" ? rows : rows.filter((r) => kinds[r.slug] === filter);
  const count = (f: Filter) => (f === "all" ? rows.length : rows.filter((r) => kinds[r.slug] === f).length);

  return (
    <>
      <div className="mb-14 flex flex-wrap gap-3" role="group" aria-label="Filter">
        {(["all", "security", "product"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={`pill ${filter === f ? "border-dark bg-dark text-on-dark" : "border-rule"}`}
          >
            {labels[f]}
            <sup className="text-xs">{count(f)}</sup>
          </button>
        ))}
      </div>
      <WorkList key={filter} rows={shown} viewLabel={labels.view} columns="detailed" />
    </>
  );
}
