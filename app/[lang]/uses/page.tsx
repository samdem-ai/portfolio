import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { getDictionary } from "@/lib/dictionary";
import { hasLocale, t, type L } from "@/lib/i18n";
import { alternates } from "@/lib/seo";

// TODO(Samy): add your editor, hardware and anything else you actually use.
const groups: { title: L; items: { name: string; note: L }[] }[] = [
  {
    title: { en: "Daily driver", fr: "Au quotidien" },
    items: [
      { name: "CachyOS", note: { en: "Arch-based, fast, gets out of the way.", fr: "Basé sur Arch, rapide, discret." } },
      { name: "fish", note: { en: "Autosuggestions without a plugin zoo.", fr: "Des suggestions sans zoo de plugins." } },
      { name: "Obsidian", note: { en: "Where my HTB and CPTS notes live.", fr: "Là où vivent mes notes HTB et CPTS." } },
      { name: "Git", note: { en: "Including for the notes.", fr: "Y compris pour les notes." } },
    ],
  },
  {
    title: { en: "Reverse engineering", fr: "Rétro-ingénierie" },
    items: [
      { name: "Ghidra", note: { en: "Decompiler, scripting, free.", fr: "Décompilateur, scripts, gratuit." } },
      { name: "IDA Pro", note: { en: "When Ghidra's output gets confusing.", fr: "Quand la sortie de Ghidra devient confuse." } },
      { name: "YARA", note: { en: "Turning observations into detections.", fr: "Transformer des observations en détections." } },
      { name: "VMware / VirtualBox", note: { en: "Isolated, snapshotted, disposable labs.", fr: "Labos isolés, avec snapshots, jetables." } },
    ],
  },
  {
    title: { en: "Network & offensive", fr: "Réseau et offensif" },
    items: [
      { name: "Wireshark", note: { en: "The truth is in the packets.", fr: "La vérité est dans les paquets." } },
      { name: "Burp Suite", note: { en: "Web testing.", fr: "Tests web." } },
      { name: "Nmap", note: { en: "First command on every box.", fr: "Première commande sur chaque machine." } },
      { name: "Metasploit", note: { en: "For when the exploit already exists.", fr: "Quand l'exploit existe déjà." } },
    ],
  },
  {
    title: { en: "Detection & DFIR", fr: "Détection et DFIR" },
    items: [
      { name: "Velociraptor", note: { en: "Endpoint collection at scale.", fr: "Collecte sur les postes, à grande échelle." } },
      { name: "Elastic Stack", note: { en: "Ingest, correlate, hunt.", fr: "Ingérer, corréler, chasser." } },
      { name: "Docker Compose", note: { en: "Every lab is reproducible.", fr: "Chaque labo est reproductible." } },
    ],
  },
];

export async function generateMetadata({ params }: PageProps<"/[lang]/uses">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = getDictionary(lang);
  return { title: dict.uses.title, description: dict.uses.lede, alternates: alternates(lang, "/uses") };
}

export default async function UsesPage({ params }: PageProps<"/[lang]/uses">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <>
      <PageHero title={dict.uses.title}>
        <p data-fade="0.3" className="mt-10 max-w-[50ch] text-lg text-on-dark-muted">
          {dict.uses.lede}
        </p>
      </PageHero>
      <section className="wrap space-y-24 pb-36 pt-24">
        {groups.map((g) => (
          <div key={g.title.en} data-fade className="grid gap-x-16 gap-y-6 lg:grid-cols-12">
            <h2 className="text-[clamp(1.6rem,2.6vw,2.3rem)] font-medium tracking-[-0.03em] lg:col-span-4">{t(g.title, lang)}</h2>
            <dl className="border-t border-rule lg:col-span-8">
              {g.items.map((i) => (
                <div key={i.name} className="grid gap-x-8 gap-y-1 border-b border-rule py-5 sm:grid-cols-[13rem_1fr]">
                  <dt className="font-medium">{i.name}</dt>
                  <dd className="text-ink-2">{t(i.note, lang)}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </section>
    </>
  );
}
