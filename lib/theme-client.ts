export type ThemeChoice = "light" | "dark" | "system";

export function readTheme(): ThemeChoice {
  try {
    const t = localStorage.getItem("theme");
    return t === "light" || t === "dark" ? t : "system";
  } catch {
    return "system";
  }
}

export function applyTheme(choice: ThemeChoice) {
  const root = document.documentElement;
  if (choice === "system") delete root.dataset.theme;
  else root.dataset.theme = choice;
  try {
    if (choice === "system") localStorage.removeItem("theme");
    else localStorage.setItem("theme", choice);
  } catch {
    /* storage blocked: the choice still applies for this page view */
  }
  window.dispatchEvent(new CustomEvent("themechange", { detail: choice }));
}

export const nextTheme = (c: ThemeChoice): ThemeChoice =>
  c === "system" ? "light" : c === "light" ? "dark" : "system";

export function toggleIdaMode(): boolean {
  const root = document.documentElement;
  const on = root.dataset.mode !== "ida";
  if (on) root.dataset.mode = "ida";
  else delete root.dataset.mode;
  try {
    if (on) sessionStorage.setItem("mode", "ida");
    else sessionStorage.removeItem("mode");
  } catch {
    /* ignore */
  }
  return on;
}
