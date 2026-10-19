"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { ShellData } from "@/lib/shell-data";
import { completionsFor, run, type Ctx, type Line } from "./terminal-commands";

// Survives closing and reopening the terminal within a visit.
const session: { lines: Line[] | null; history: string[] } = { lines: null, history: [] };

const terminalColors = {
  "--ink": "#ececea",
  "--ink-2": "#c6c6c2",
  "--muted": "#8d8d89",
  "--accent": "#ff6b70",
  "--rule": "#2a2a2a",
  "--canvas": "#141517",
} as CSSProperties;

export function Terminal({ data, ctx, onClose }: { data: ShellData; ctx: Omit<Ctx, "clear"> & { clear?: () => void }; onClose: () => void }) {
  const fr = data.locale === "fr";
  const [lines, setLines] = useState<Line[]>(
    () =>
      session.lines ?? [
        { kind: "dim", text: fr ? "samy-sh 1.0 · tapez help pour commencer · Échap pour fermer" : "samy-sh 1.0 · type help to start · Esc to close" },
      ],
  );
  const [value, setValue] = useState("");
  const [cursor, setCursor] = useState<number | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    input.current?.focus();
  }, []);

  useEffect(() => {
    session.lines = lines;
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight });
  }, [lines]);

  const submit = async () => {
    const cmd = value;
    setValue("");
    setCursor(null);
    if (cmd.trim()) session.history.push(cmd);
    const echo: Line = { kind: "in", text: cmd };
    let cleared = false;
    const result = await run(cmd, { ...ctx, clear: () => (cleared = true) }, session.history);
    setLines((prev) => (cleared ? [] : [...prev, echo, ...result]));
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "Enter") {
      e.preventDefault();
      void submit();
    } else if (e.key === "Tab") {
      e.preventDefault();
      const options = completionsFor(value, data);
      if (options.length === 1) setValue(options[0] + " ");
      else if (options.length > 1)
        setLines((prev) => [...prev, { kind: "in", text: value }, { kind: "dim", text: options.map((o) => o.split(" ").pop()).join("   ") }]);
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      const h = session.history;
      if (!h.length) return;
      e.preventDefault();
      const next =
        e.key === "ArrowUp"
          ? Math.max(0, (cursor ?? h.length) - 1)
          : cursor === null
            ? null
            : cursor + 1 >= h.length
              ? null
              : cursor + 1;
      setCursor(next);
      setValue(next === null ? "" : h[next]);
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/30" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={data.labels.openTerminal}
        style={terminalColors}
        className="absolute inset-x-0 top-0 mx-auto flex h-[min(70vh,560px)] max-w-4xl flex-col overflow-hidden border-b border-x border-rule bg-canvas font-mono text-[0.85rem] leading-relaxed text-ink shadow-2xl sm:top-6 sm:rounded-2xl sm:border"
        onClick={(e) => {
          e.stopPropagation();
          input.current?.focus();
        }}
      >
        <div className="flex items-center justify-between border-b border-rule px-4 py-2 text-xs text-muted">
          <span>samy@notebook: ~</span>
          <button onClick={onClose} className="hover:text-ink" aria-label="Close terminal">
            esc ×
          </button>
        </div>
        <div ref={scroller} data-lenis-prevent className="flex-1 overflow-y-auto px-4 py-3" aria-live="polite">
          {lines.map((l, i) => (
            <div
              key={i}
              className={
                "whitespace-pre-wrap break-words " +
                (l.kind === "err" ? "text-[#ff6b6b]" : l.kind === "dim" ? "text-muted" : l.kind === "accent" ? "text-accent" : "text-ink")
              }
            >
              {l.kind === "in" ? (
                <>
                  <span className="text-accent">❯ </span>
                  {l.text}
                </>
              ) : (
                l.text || " "
              )}
            </div>
          ))}
          <div className="flex items-center">
            <label htmlFor="term-input" className="text-accent">
              ❯&nbsp;
            </label>
            <input
              id="term-input"
              ref={input}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKeyDown}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              className="flex-1 bg-transparent text-ink caret-[var(--accent)] outline-none focus-visible:outline-none"
              aria-label="Command"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
