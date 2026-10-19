"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { ShellData } from "@/lib/shell-data";
import { applyTheme, readTheme, nextTheme, toggleIdaMode, type ThemeChoice } from "@/lib/theme-client";
import { Terminal } from "./Terminal";
import { Palette } from "./Palette";

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

const isTyping = (el: EventTarget | null) =>
  el instanceof HTMLElement && (el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName));

let greeted = false;

function greet() {
  if (greeted) return;
  greeted = true;
  const art = [
    "  ___  __ _ _ __ ___  _   _ ",
    " / __|/ _` | '_ ` _ \\| | | |",
    " \\__ \\ (_| | | | | | | |_| |",
    " |___/\\__,_|_| |_| |_|\\__, |",
    "                      |___/ ",
  ].join("\n");
  console.log(`%c${art}`, "font-family:monospace;color:#e5484d;font-size:12px");
  console.log(
    "%cfield note 02%c\nYou opened DevTools on a security engineer's site. Respect.\n" +
      "Here's something for you:  atob() it, then XOR every byte with 0x2a.\n\n" +
      "WlhPWVkKSgoCSEtJQV5DSUEDCktETgpYX0QQClleWENETVkKREVeT0hFRUE=",
    "font-family:monospace;font-weight:bold;color:#e5484d",
    "font-family:monospace",
  );
}

export function Shell({ data }: { data: ShellData }) {
  const router = useRouter();
  const pathname = usePathname();
  const [terminal, setTerminal] = useState(false);
  const [palette, setPalette] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [won, setWon] = useState(false);
  const lastFocus = useRef<HTMLElement | null>(null);
  const konami = useRef(0);

  const flash = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2600);
  }, []);

  const open = useCallback((which: "terminal" | "palette") => {
    lastFocus.current = document.activeElement as HTMLElement | null;
    setPalette(which === "palette");
    setTerminal(which === "terminal");
  }, []);

  const close = useCallback(() => {
    setTerminal(false);
    setPalette(false);
    lastFocus.current?.focus?.();
  }, []);

  const switchLanguage = useCallback(() => {
    const target = data.locale === "en" ? "fr" : "en";
    router.push(pathname.replace(/^\/(en|fr)(?=\/|$)/, `/${target}`));
  }, [data.locale, pathname, router]);

  const setTheme = useCallback((t: ThemeChoice) => applyTheme(t), []);

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(data.email);
      flash(`${data.labels.copied}: ${data.email}`);
    } catch {
      window.location.href = `mailto:${data.email}`;
    }
  }, [data.email, data.labels.copied, flash]);

  useEffect(() => {
    greet();
    const onOpen = (e: Event) => open((e as CustomEvent<"terminal" | "palette">).detail);
    window.addEventListener("shell:open", onOpen);

    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (palette) close();
        else open("palette");
        return;
      }
      if (isTyping(e.target)) return;

      if (e.key === "`" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        if (terminal) close();
        else open("terminal");
        return;
      }

      const expected = KONAMI[konami.current];
      if (e.key.toLowerCase() === expected.toLowerCase()) {
        konami.current += 1;
        if (konami.current === KONAMI.length) {
          konami.current = 0;
          const on = toggleIdaMode();
          const fr = data.locale === "fr";
          flash(on ? (fr ? "vue désassemblage : activée" : "disassembly view: on") : fr ? "vue désassemblage : désactivée" : "disassembly view: off");
        }
      } else {
        konami.current = e.key === KONAMI[0] ? 1 : 0;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("shell:open", onOpen);
      window.removeEventListener("keydown", onKey);
    };
  }, [close, data.locale, flash, open, palette, terminal]);

  return (
    <>
      {terminal && (
        <Terminal
          data={data}
          onClose={close}
          ctx={{
            data,
            navigate: (h) => {
              router.push(h);
            },
            setTheme,
            switchLanguage,
            close,
            clear: () => {},
            onFlag: () => {
              setTerminal(false);
              setWon(true);
            },
          }}
        />
      )}
      {palette && (
        <Palette
          data={data}
          onClose={close}
          actions={{
            navigate: (h) => {
              close();
              router.push(h);
            },
            external: (h) => {
              close();
              window.open(h, "_blank", "noopener");
            },
            terminal: () => open("terminal"),
            theme: () => setTheme(nextTheme(readTheme())),
            language: () => {
              close();
              switchLanguage();
            },
            copyEmail: () => {
              close();
              void copyEmail();
            },
          }}
        />
      )}
      {won && <FlagWon data={data} onClose={() => setWon(false)} />}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[70] flex justify-center px-4">
        {toast && (
          <div className="rounded-full bg-dark px-5 py-2.5 text-sm text-on-dark shadow-lg">{toast}</div>
        )}
      </div>
    </>
  );
}

function FlagWon({ data, onClose }: { data: ShellData; onClose: () => void }) {
  const fr = data.locale === "fr";
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    ref.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-black/50 p-4 backdrop-blur-[2px]" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="flag-title"
        className="relative w-full max-w-md rounded-2xl bg-canvas p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="eyebrow">SAMY&#123;…&#125; ✓</p>
        <h2 id="flag-title" className="big mt-3 text-4xl">
          {fr ? "Vous seriez à votre place ici." : "You'd fit right in."}
        </h2>
        <p className="mt-3 text-ink-2">
          {fr
            ? "Source, console, terminal, ROT13. C'est exactement le genre de curiosité que j'aime. Discutons :"
            : "Source, console, terminal, ROT13. That's exactly the kind of curiosity I like working with. Let's talk:"}
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a className="pill border-transparent bg-accent text-on-accent" href={`mailto:${data.email}?subject=SAMY%7Bflag%7D`}>
            {data.email}
          </a>
          <a className="pill border-rule" href={data.cv} target="_blank" rel="noreferrer">
            CV ↗
          </a>
        </div>
        <button ref={ref} onClick={onClose} className="absolute right-3 top-2 font-mono text-muted hover:text-ink" aria-label="Close">
          ×
        </button>
      </div>
    </div>
  );
}
