import type { L } from "@/lib/i18n";

export const site = {
  // TODO(Samy): replace with your real domain once you buy one.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://samy-debaili.vercel.app",
  name: "Samy Debaili",
};

export const profile = {
  name: "Samy Debaili",
  fullName: "Debaili Madani Samy",
  email: "m_debaili@estin.dz",
  location: { en: "Algiers, Algeria", fr: "Alger, Algérie" } satisfies L,
  role: {
    en: "Cybersecurity engineer",
    fr: "Ingénieur en cybersécurité",
  } satisfies L,
  links: {
    github: "https://github.com/samdem-ai",
    linkedin: "https://linkedin.com/in/samy-debaili",
    tryhackme: "https://tryhackme.com/p/samdem",
    rootme: "https://www.root-me.org/samdem",
    grayswan: "https://app.grayswan.ai/arena/user/68921c18f2f6e6cdecf70030",
  },
  cv: {
    en: "/Samy-Debaili-CV-EN.pdf",
    fr: "/Samy-Debaili-CV-FR.pdf",
  },
};

/** The 30-second version, for people who skim. */
export const quickFacts: { label: L; value: L }[] = [
  {
    label: { en: "Degree", fr: "Diplôme" },
    value: {
      en: "Engineer + Master's, CS & Cybersecurity, ESTIN 2026",
      fr: "Ingénieur + Master, informatique et cybersécurité, ESTIN 2026",
    },
  },
  {
    label: { en: "Thesis", fr: "Thèse" },
    value: {
      en: "DFIR platform built at Air Algérie: 100% detection on 8 ATT&CK techniques, 23.5 s MTTD",
      fr: "Plateforme DFIR réalisée chez Air Algérie : 100 % de détection sur 8 techniques ATT&CK, MTTD de 23,5 s",
    },
  },
  {
    label: { en: "Experience", fr: "Expérience" },
    value: {
      en: "Thesis internship at Air Algérie; security audits & pentesting at ESTIN",
      fr: "Stage de fin d'études chez Air Algérie ; audits de sécurité et tests d'intrusion à l'ESTIN",
    },
  },
  {
    label: { en: "Certifications", fr: "Certifications" },
    value: { en: "CEWH (CyberED) · C3SA (CyberWarfareLabs)", fr: "CEWH (CyberED) · C3SA (CyberWarfareLabs)" },
  },
  {
    label: { en: "Languages", fr: "Langues" },
    value: {
      en: "Arabic (native) · French (fluent) · English (IELTS 8.0, C1)",
      fr: "Arabe (maternelle) · Français (courant) · Anglais (IELTS 8.0, C1)",
    },
  },
];

export const strengths: { strong: L[]; learning: L[] } = {
  strong: [
    {
      en: "Malware analysis and reverse engineering: Ghidra, IDA Pro, x86/x64",
      fr: "Analyse de malwares et rétro-ingénierie : Ghidra, IDA Pro, x86/x64",
    },
    {
      en: "Detection and DFIR: Velociraptor, Elastic, MITRE ATT&CK",
      fr: "Détection et DFIR : Velociraptor, Elastic, MITRE ATT&CK",
    },
    {
      en: "Auditing and pentesting Linux infrastructure, then writing it up",
      fr: "Audit et tests d'intrusion d'infrastructures Linux, puis la rédaction qui va avec",
    },
    {
      en: "Explaining technical topics to very different audiences",
      fr: "Expliquer des sujets techniques à des publics très différents",
    },
  ],
  learning: [
    { en: "Identity and access management", fr: "Gestion des identités et des accès" },
    {
      en: "Dashboard-driven security reporting",
      fr: "Le pilotage de la sécurité par tableaux de bord",
    },
    {
      en: "Applying frameworks like NIST CSF formally, not just knowing them",
      fr: "Appliquer formellement des référentiels comme le NIST CSF, pas seulement les connaître",
    },
    { en: "HTB CPTS (in progress)", fr: "HTB CPTS (en cours)" },
  ],
};

export const workNotes: { title: L; body: L }[] = [
  {
    title: { en: "I write things down.", fr: "J'écris tout." },
    body: {
      en: "Every sample I analyse ends up as a report, every audit as a remediation list. If it isn't written down, the next person has to rediscover it.",
      fr: "Chaque échantillon analysé finit en rapport, chaque audit en liste de remédiations. Ce qui n'est pas écrit, quelqu'un devra le redécouvrir.",
    },
  },
  {
    title: { en: "I'd rather measure than claim.", fr: "Je préfère mesurer qu'affirmer." },
    body: {
      en: "My thesis didn't stop at \"it works\". We ran Caldera against it, timed every detection and put it next to Wazuh and Splunk.",
      fr: "Ma thèse ne s'est pas arrêtée à « ça marche ». On l'a confrontée à Caldera, chronométré chaque détection et comparée à Wazuh et Splunk.",
    },
  },
  {
    title: { en: "I teach what I learn.", fr: "J'enseigne ce que j'apprends." },
    body: {
      en: "I've run reverse-engineering and malware workshops since 2022. Preparing an exercise for beginners is the fastest way I know to find the gaps in my own understanding.",
      fr: "J'anime des ateliers de rétro-ingénierie et d'analyse de malwares depuis 2022. Préparer un exercice pour débutants est le meilleur moyen que je connaisse pour trouver mes propres lacunes.",
    },
  },
];

/** A skill is either a proper noun (same in every language) or a translated phrase. */
export type Skill = string | L;
export const skillText = (s: Skill, locale: keyof L) => (typeof s === "string" ? s : s[locale]);

export const skills: { group: L; items: Skill[] }[] = [
  {
    group: { en: "Incidents & threats", fr: "Incidents et menaces" },
    items: [
      { en: "Log analysis", fr: "Analyse de logs" },
      { en: "Incident response", fr: "Réponse à incident" },
      "Elastic Stack (SIEM)",
      "MITRE ATT&CK",
      "Velociraptor",
    ],
  },
  {
    group: { en: "Vulnerabilities & audit", fr: "Vulnérabilités et audit" },
    items: [
      { en: "Vulnerability assessment", fr: "Évaluation de vulnérabilités" },
      { en: "Pentesting", fr: "Tests d'intrusion" },
      { en: "Linux hardening", fr: "Durcissement Linux" },
      "Nmap",
      "Burp Suite",
      "Metasploit",
      "Wireshark",
    ],
  },
  {
    group: { en: "Malware analysis", fr: "Analyse de malwares" },
    items: ["Ghidra", "IDA Pro", { en: "x86/x64 assembly", fr: "Assembleur x86/x64" }, "YARA", { en: "Static & dynamic analysis", fr: "Analyse statique et dynamique" }],
  },
  {
    group: { en: "Networks & systems", fr: "Réseaux et systèmes" },
    items: ["Linux", { en: "Firewalls", fr: "Pare-feu" }, "IDS/IPS", { en: "Traffic analysis", fr: "Analyse de trafic" }, "Docker", "VMware", "VirtualBox"],
  },
  {
    group: { en: "Code", fr: "Code" },
    items: ["Python", "C/C++", "Bash", "TypeScript", "Java", "Next.js", "React Native", "Node", "Spring Boot", "FastAPI", "PostgreSQL", "MongoDB"],
  },
];
