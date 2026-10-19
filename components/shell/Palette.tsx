"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ShellData } from "@/lib/shell-data";

type Actions = {
  navigate: (href: string) => void;
  external: (href: string) => void;
  terminal: () => void;
  theme: () => void;
  language: () => void;
  copyEmail: () => void;
};

type Item = { id: string; group: string; label: string; hint?: string; run: () => void };

export function Palette({ data, actions, onClose }: { data: ShellData; actions: Actions; onClose: () => void }) {
  const fr = data.locale === "fr";
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);

  const items = useMemo<Item[]>(() => {
    const g = fr
      ? { pages: "Pages", work: "Projets", profiles: "Profils", actions: "Actions" }
      : { pages: "Pages", work: "Work", profiles: "Profiles", actions: "Actions" };
    return [
      ...data.pages.map((p) => ({ id: `page-${p.id}`, group: g.pages, label: p.label, hint: p.href, run: () => actions.navigate(p.href) })),
      ...data.projects.map((p) => ({
        id: `proj-${p.slug}`,
        group: g.work,
        label: p.name,
        hint: p.page ? (fr ? "étude de cas" : "case study") : p.live ? "live ↗" : "repo ↗",
        run: () => (p.page ? actions.navigate(p.page) : actions.external((p.live ?? p.repo)!)),
      })),
      { id: "gh", group: g.profiles, label: "GitHub", hint: "samdem-ai ↗", run: () => actions.external(data.links.github) },
      { id: "li", group: g.profiles, label: "LinkedIn", hint: "samy-debaili ↗", run: () => actions.external(data.links.linkedin) },
      { id: "thm", group: g.profiles, label: "TryHackMe", hint: "samdem ↗", run: () => actions.external(data.links.tryhackme) },
      { id: "rm", group: g.profiles, label: "Root-Me", hint: "samdem ↗", run: () => actions.external(data.links.rootme) },
      { id: "email", group: g.actions, label: data.labels.copyEmail, hint: data.email, run: actions.copyEmail },
      { id: "cv", group: g.actions, label: fr ? "Télécharger le CV" : "Download CV", hint: "PDF", run: () => actions.external(data.cv) },
      { id: "term", group: g.actions, label: data.labels.openTerminal, hint: "`", run: actions.terminal },
      { id: "theme", group: g.actions, label: fr ? "Changer de thème" : "Toggle theme", run: actions.theme },
      { id: "lang", group: g.actions, label: data.labels.language, run: actions.language },
    ];
  }, [actions, data, fr]);

  const filtered = useMemo(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) return items;
    return items.filter((i) => {
      const hay = `${i.label} ${i.hint ?? ""} ${i.group}`.toLowerCase();
      return words.every((w) => hay.includes(w));
    });
  }, [items, query]);

  useEffect(() => input.current?.focus(), []);
  useEffect(() => {
    list.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(filtered.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      filtered[active]?.run();
    }
  };

  let lastGroup = "";
  return (
    <div className="fixed inset-0 z-[60] bg-black/40 px-4 pt-[12vh] backdrop-blur-[2px]" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={fr ? "Palette de commandes" : "Command palette"}
        className="mx-auto w-full max-w-lg overflow-hidden rounded-2xl bg-canvas shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-rule px-4">
          <span className="font-mono text-muted" aria-hidden>
            ⌘K
          </span>
          <input
            ref={input}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            placeholder={fr ? "Aller à, ouvrir, copier…" : "Jump to, open, copy…"}
            className="w-full bg-transparent py-3.5 text-ink placeholder:text-muted outline-none focus-visible:outline-none"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-activedescendant={filtered[active] ? `pi-${filtered[active].id}` : undefined}
          />
        </div>
        <ul id="palette-list" ref={list} data-lenis-prevent role="listbox" className="max-h-[50vh] overflow-y-auto py-2">
          {filtered.length === 0 && <li className="px-4 py-3 text-sm text-muted">{fr ? "Rien trouvé." : "Nothing found."}</li>}
          {filtered.map((item, index) => {
            const header = item.group !== lastGroup;
            lastGroup = item.group;
            return (
              <li key={item.id} role="presentation">
                {header && <div className="eyebrow px-4 pb-1 pt-3">{item.group}</div>}
                <div
                  id={`pi-${item.id}`}
                  role="option"
                  aria-selected={index === active}
                  data-index={index}
                  onMouseMove={() => setActive(index)}
                  onClick={item.run}
                  className={
                    "mx-2 flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-[0.95rem] " +
                    (index === active ? "bg-panel text-ink" : "text-ink-2")
                  }
                >
                  <span>{item.label}</span>
                  {item.hint && <span className={"ml-4 truncate font-mono text-xs " + "text-muted"}>{item.hint}</span>}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
