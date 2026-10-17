import type { L } from "@/lib/i18n";

export type LogEntry = {
  when: L;
  title: L;
  where: L;
  points: L[];
};

export const experience: LogEntry[] = [
  {
    when: { en: "Feb – Jul 2026", fr: "févr. – juil. 2026" },
    title: { en: "Cybersecurity engineering intern (6-month thesis internship)", fr: "Stagiaire ingénieur en cybersécurité (stage PFE de 6 mois)" },
    where: { en: "Air Algérie · with ESTIN, co-authored with Salim Abdoune", fr: "Air Algérie · avec l'ESTIN, en binôme avec Salim Abdoune" },
    points: [
      {
        en: "Built a DFIR platform: Velociraptor + Elastic + a fine-tuned LLM behind a four-stage prompt-injection filter.",
        fr: "Conception d'une plateforme DFIR : Velociraptor + Elastic + un LLM affiné derrière un filtre d'injection de prompt en quatre étapes.",
      },
      {
        en: "100% detection on 8 Caldera-emulated ATT&CK techniques, 23.5 s mean time to detect; every tested injection blocked.",
        fr: "100 % de détection sur 8 techniques ATT&CK émulées par Caldera, 23,5 s de temps moyen de détection ; toutes les injections testées bloquées.",
      },
    ],
  },
  {
    when: { en: "Jul – Aug 2025", fr: "juil. – août 2025" },
    title: { en: "White Hat Hacker program", fr: "Programme White Hat Hacker" },
    where: { en: "Positive Hack Camp, Moscow", fr: "Positive Hack Camp, Moscou" },
    points: [
      { en: "Placed 2nd in the internal competition.", fr: "2ᵉ place au concours interne." },
    ],
  },
  {
    when: { en: "Nov 2024 – Jun 2025", fr: "nov. 2024 – juin 2025" },
    title: { en: "Cybersecurity auditor", fr: "Auditeur en cybersécurité" },
    where: { en: "ESTIN, Information Security Department", fr: "ESTIN, Département Sécurité de l'Information" },
    points: [
      {
        en: "Audited Linux servers and computer-lab machines; vulnerability assessments and penetration tests.",
        fr: "Audit des serveurs Linux et des machines des salles informatiques ; évaluations de vulnérabilités et tests d'intrusion.",
      },
      {
        en: "Wrote up findings, hardening measures and remediation plans.",
        fr: "Rédaction des constats, des mesures de durcissement et des plans de remédiation.",
      },
    ],
  },
  {
    when: { en: "Jul – Aug 2024", fr: "juil. – août 2024" },
    title: { en: "Network engineering intern", fr: "Stagiaire en ingénierie réseaux" },
    where: { en: "Algérie Télécom", fr: "Algérie Télécom" },
    points: [
      {
        en: "Configured routers, switches and transmission equipment; fibre deployment in the field.",
        fr: "Configuration de routeurs, switches et équipements de transmission ; déploiement de fibre sur le terrain.",
      },
    ],
  },
  {
    when: { en: "2022 – now", fr: "2022 – aujourd'hui" },
    title: { en: "Workshop lead & CTF challenge author", fr: "Animateur d'ateliers et auteur de challenges CTF" },
    where: { en: "Nexus security club, ESTIN", fr: "Club de sécurité Nexus, ESTIN" },
    points: [
      {
        en: "Regular reverse-engineering and malware-analysis sessions; materials, exercises and mentoring.",
        fr: "Sessions régulières de rétro-ingénierie et d'analyse de malwares ; supports, exercices et accompagnement.",
      },
      {
        en: "Wrote challenges for the Nexus and NexZero CTFs.",
        fr: "Création de challenges pour les CTF Nexus et NexZero.",
      },
    ],
  },
];

export const podiums: { place: string; event: L }[] = [
  { place: "1st & 2nd", event: { en: "National CTFs: shellmates HACK.INI, pwnycup", fr: "CTF nationaux : shellmates HACK.INI, pwnycup" } },
  { place: "2nd", event: { en: "Positive Hack Camp internal competition, Moscow", fr: "Concours interne du Positive Hack Camp, Moscou" } },
  { place: "4th", event: { en: "HackFest international finals, Tunisia", fr: "Finale internationale HackFest, Tunisie" } },
  { place: "9th", event: { en: "TryHackMe CTF", fr: "CTF TryHackMe" } },
  { place: "Top 14", event: { en: "Gray Swan AI red-teaming arena: Machine in the Middle (2025)", fr: "Arène de red teaming IA Gray Swan : Machine in the Middle (2025)" } },
];

export const certifications: { name: string; issuer: string; year?: string }[] = [
  { name: "Certified Ethical White Hacker (CEWH)", issuer: "CyberED", year: "2025" },
  // TODO(Samy): add the C3SA year and verification links for both certs.
  { name: "Cyber Security and Adversarial Analysis (C3SA)", issuer: "CyberWarfareLabs" },
];
