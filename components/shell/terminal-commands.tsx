import type { ReactNode } from "react";
import type { ShellData } from "@/lib/shell-data";
import type { ThemeChoice } from "@/lib/theme-client";

export type Line = { kind: "in" | "out" | "err" | "dim" | "accent"; text: ReactNode };

export type Ctx = {
  data: ShellData;
  navigate: (href: string) => void;
  setTheme: (t: ThemeChoice) => void;
  switchLanguage: () => void;
  clear: () => void;
  close: () => void;
  onFlag: () => void;
};

const FLAG_SHA256 = "13c1195fac83060bd98db1bab558e37c927d6ab4e469345419855ea166844bce";

async function sha256(text: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

const out = (text: ReactNode): Line => ({ kind: "out", text });
const dim = (text: ReactNode): Line => ({ kind: "dim", text });
const err = (text: ReactNode): Line => ({ kind: "err", text });
const accent = (text: ReactNode): Line => ({ kind: "accent", text });

const ext = (url: string, label = url.replace(/^https?:\/\/(www\.)?/, "")) => (
  <a className="underline underline-offset-2 hover:text-accent" href={url} target="_blank" rel="noreferrer">
    {label}
  </a>
);

const help: Record<"en" | "fr", [string, string][]> = {
  en: [
    ["whoami", "the short version"],
    ["ls [projects|pages]", "list things"],
    ["cat <project>", "read about a project"],
    ["open <project|page|github|linkedin|cv>", "go there"],
    ["strings resume", "pull the readable bits out of my CV"],
    ["file samy", "identify the target"],
    ["nmap samy", "scan for ways to reach me"],
    ["sudo hire-me", "you know what this does"],
    ["theme [light|dark|system]", "change the theme"],
    ["lang", "switch to French"],
    ["submit <flag>", "found something?"],
    ["clear · history · exit", ""],
  ],
  fr: [
    ["whoami", "la version courte"],
    ["ls [projects|pages]", "lister"],
    ["cat <projet>", "lire la fiche d'un projet"],
    ["open <projet|page|github|linkedin|cv>", "y aller"],
    ["strings resume", "extraire les lignes lisibles de mon CV"],
    ["file samy", "identifier la cible"],
    ["nmap samy", "scanner les moyens de me joindre"],
    ["sudo hire-me", "vous savez ce que ça fait"],
    ["theme [light|dark|system]", "changer de thème"],
    ["lang", "passer en anglais"],
    ["submit <flag>", "vous avez trouvé quelque chose ?"],
    ["clear · history · exit", ""],
  ],
};

export const commandNames = [
  "help", "whoami", "ls", "cat", "open", "strings", "file", "nmap", "sudo", "theme", "lang", "submit", "clear", "history", "exit",
];

export function completionsFor(input: string, data: ShellData): string[] {
  const parts = input.split(/\s+/);
  if (parts.length <= 1) return commandNames.filter((c) => c.startsWith(parts[0] ?? ""));
  const [cmd, arg = ""] = parts;
  const pool: Record<string, string[]> = {
    cat: data.projects.map((p) => p.slug),
    open: [...data.projects.map((p) => p.slug), ...data.pages.map((p) => p.id), "github", "linkedin", "tryhackme", "cv"],
    ls: ["projects", "pages"],
    strings: ["resume", "notebook"],
    theme: ["light", "dark", "system"],
    file: ["samy"],
    nmap: ["samy"],
    sudo: ["hire-me"],
  };
  return (pool[cmd] ?? []).filter((o) => o.startsWith(arg)).map((o) => `${cmd} ${o}`);
}

export async function run(raw: string, ctx: Ctx, history: string[]): Promise<Line[]> {
  const { data } = ctx;
  const fr = data.locale === "fr";
  const [cmd = "", ...args] = raw.trim().split(/\s+/);
  const arg = args.join(" ");
  const project = (slug: string) => data.projects.find((p) => p.slug === slug.toLowerCase());

  switch (cmd.toLowerCase()) {
    case "":
      return [];
    case "help":
      return [
        ...help[data.locale].map(([c, d]) =>
          out(
            <span>
              <span className="inline-block min-w-[19ch] text-accent">{c}</span>
              <span className="text-muted">{d}</span>
            </span>,
          ),
        ),
        dim(fr ? "Tab complète, ↑/↓ parcourt l'historique." : "Tab completes, ↑/↓ walks history."),
      ];
    case "whoami":
      return fr
        ? [
            out("samy debaili, ingénieur en cybersécurité, Alger."),
            out("ingénieur + master, ESTIN 2026."),
            out("rétro-ingénierie · DFIR · red teaming d'IA · produits web."),
            accent("cherche : poste en sécurité de l'information / SOC / réponse à incident."),
          ]
        : [
            out("samy debaili, cybersecurity engineer, Algiers."),
            out("engineer + master's, ESTIN 2026."),
            out("reverse engineering · DFIR · AI red teaming · web products."),
            accent("looking for: infosec / SOC / incident response role."),
          ];
    case "ls": {
      if (arg === "pages") return data.pages.map((p) => out(`${p.id}/`));
      if (arg === "projects" || arg === "")
        return [
          ...(arg === "" ? [dim("projects/  pages/  notebook  resume.pdf"), dim("")] : []),
          ...data.projects.map((p) => out(<span><span className="text-accent">{p.slug}</span>  <span className="text-muted">{p.name}</span></span>)),
        ];
      return [err(`ls: ${arg}: No such file or directory`)];
    }
    case "cat": {
      if (!arg) return [err(fr ? "usage : cat <projet>  (essayez ls projects)" : "usage: cat <project>  (try ls projects)")];
      const p = project(arg);
      if (!p) return [err(`cat: ${arg}: No such file or directory`)];
      return [
        accent(p.name),
        out(p.oneLiner),
        dim(p.stack.join(" · ")),
        ...(p.page ? [out(<span>→ <button className="underline underline-offset-2 hover:text-accent" onClick={() => ctx.navigate(p.page!)}>{data.labels.readCase}</button></span>)] : []),
        ...(p.repo ? [out(<span>→ {ext(p.repo)}</span>)] : []),
        ...(p.live ? [out(<span>→ {ext(p.live)}</span>)] : []),
      ];
    }
    case "open": {
      const target = arg.toLowerCase();
      const external: Record<string, string> = {
        github: data.links.github,
        linkedin: data.links.linkedin,
        tryhackme: data.links.tryhackme,
        rootme: data.links.rootme,
      };
      if (target === "cv") {
        window.open(data.cv, "_blank", "noopener");
        return [out(`opening ${data.cv}`)];
      }
      if (external[target]) {
        window.open(external[target], "_blank", "noopener");
        return [out(<span>opening {ext(external[target])}</span>)];
      }
      const page = data.pages.find((p) => p.id === target);
      if (page) {
        ctx.navigate(page.href);
        return [out(`cd ${page.href}`)];
      }
      const p = project(target);
      if (p) {
        const dest = p.page ?? p.live ?? p.repo;
        if (!dest) return [err(`open: ${target}: nothing to open yet`)];
        if (dest.startsWith("/")) ctx.navigate(dest);
        else window.open(dest, "_blank", "noopener");
        return [out(`opening ${dest}`)];
      }
      return [err(`open: ${arg || "?"}: unknown target`)];
    }
    case "strings": {
      if (arg === "resume" || arg === "resume.pdf")
        return [
          dim(".rodata"),
          out("Debaili Madani Samy"),
          out("Engineer + Master, Computer Science & Cybersecurity, ESTIN 2021-2026"),
          out("DFIR platform (thesis, Air Algerie internship): Velociraptor / Elastic / qwen25-dfir + RAG"),
          out("detection_rate=100% (8 ATT&CK techniques)  mttd=23.5s"),
          out("Cybersecurity audit, ESTIN ISD, 2024-2025"),
          out("Positive Hack Camp 2025: 2nd place"),
          out("HackFest finals (TN): 4th"),
          out("CEWH; C3SA"),
          out("ar=native fr=fluent en=C1 (IELTS 8.0)"),
          dim(fr ? `→ PDF : open cv` : `→ PDF: open cv`),
        ];
      if (arg === "notebook")
        return [
          dim(".rdata:00404a00"),
          out("GCC: (GNU) 13.2.0"),
          out("KERNEL32.dll"),
          out("IsDebuggerPresent"),
          out("coffee_level_critical"),
          out("TODO: sleep"),
          out("field note 03"),
          accent("FNZL{svryq_abgrf_arire_yvr}"),
          out("; caesar called. he wants his flag back."),
          out("; then: submit <flag>"),
          out("GetTickCount"),
        ];
      return [err(`strings: '${arg || "?"}': No such file`)];
    }
    case "file":
      if (arg === "samy" || arg === "me")
        return [out("samy: ELF 64-bit LSB human, Algiers build, dynamically linked (coffee), not stripped, with debug_info, curious")];
      return [err(`file: ${arg || "?"}: cannot open`)];
    case "nmap":
      if (arg !== "samy" && !arg.startsWith("samy"))
        return [err(fr ? "nmap : je ne scanne que moi-même ici. essayez nmap samy" : "nmap: I only scan myself here. try nmap samy")];
      return [
        dim("Starting Nmap 7.95 ( https://nmap.org )"),
        dim("Nmap scan report for samy (Algiers)"),
        out("PORT       STATE     SERVICE     VERSION"),
        out(<span>25/tcp     open      smtp        <a className="underline underline-offset-2 hover:text-accent" href={`mailto:${data.email}`}>{data.email}</a></span>),
        out(<span>443/tcp    open      github      {ext(data.links.github)}</span>),
        out(<span>8443/tcp   open      linkedin    {ext(data.links.linkedin)}</span>),
        out(<span>1337/tcp   open      tryhackme   {ext(data.links.tryhackme, "top 2%")}</span>),
        out("31337/tcp  filtered  ctf         (look harder)"),
        dim("Nmap done: 1 IP address (1 host up) scanned in 0.42 seconds"),
      ];
    case "sudo":
      if (arg === "hire-me" || arg === "hire me") {
        setTimeout(() => (window.location.href = `mailto:${data.email}?subject=${encodeURIComponent(fr ? "Opportunité" : "Opportunity")}`), 900);
        return [
          dim("[sudo] password for recruiter: ********"),
          accent(fr ? "Accès accordé. Ouverture de votre client mail…" : "Permission granted. Opening your mail client…"),
        ];
      }
      return [err(`sudo: ${arg || "?"}: command not found`)];
    case "theme": {
      const choice = arg as ThemeChoice;
      if (!["light", "dark", "system"].includes(choice)) return [err("usage: theme light|dark|system")];
      ctx.setTheme(choice);
      return [out(`theme → ${choice}`)];
    }
    case "lang":
      ctx.switchLanguage();
      return [out(fr ? "switching to English…" : "passage en français…")];
    case "submit": {
      if (!arg) return [err("usage: submit SAMY{...}")];
      if ((await sha256(arg.trim())) === FLAG_SHA256) {
        ctx.onFlag();
        return [accent(fr ? "✓ flag correct." : "✓ correct flag.")];
      }
      return [err(fr ? "✗ pas tout à fait. continuez." : "✗ not quite. keep going.")];
    }
    case "history":
      return history.map((h, i) => dim(`${String(i + 1).padStart(4)}  ${h}`));
    case "clear":
      ctx.clear();
      return [];
    case "exit":
    case "quit":
      ctx.close();
      return [];
    case "cd":
      return [dim(fr ? "cd : il n'y a qu'un seul dossier ici, et c'est moi." : "cd: there's only one directory here, and it's me.")];
    case "rm":
      return [err(fr ? "bien essayé." : "nice try.")];
    default:
      return [err(`${cmd}: command not found. ${fr ? "tapez help" : "type help"}`)];
  }
}
