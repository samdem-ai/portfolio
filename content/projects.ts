import type { L } from "@/lib/i18n";

/**
 * Smaller projects that don't have a write-up. Anything with a case study lives
 * in content/work/<slug>/ as a post instead (see content/work/README.md).
 */
export type Project = {
  slug: string;
  name: string;
  kind: "security" | "product";
  year: string;
  order?: number;
  status?: L;
  oneLiner: L;
  stack: string[];
  cover?: string;
  repo?: string;
  live?: string;
};

const gh = (repo: string) => `https://github.com/samdem-ai/${repo}`;

export const projects: Project[] = [
  {
    slug: "ab-auto",
    name: "AB Auto",
    kind: "product",
    year: "2026",
    order: 13,
    status: { en: "Client work, live", fr: "Client, en ligne" },
    oneLiner: {
      en: "Website and booking flow for a car-rental business at Algiers airport. Trilingual with automatic RTL; bookings land in WhatsApp, pre-filled.",
      fr: "Site et réservation pour un loueur de voitures à l'aéroport d'Alger. Trilingue avec RTL automatique ; les réservations arrivent pré-remplies sur WhatsApp.",
    },
    stack: ["React", "Vite", "TypeScript", "react-i18next"],
    cover: "/work/ab-auto/cover.webp",
    repo: gh("ab_auto"),
    live: "https://ab-auto.tech",
  },
  {
    slug: "laya-agent",
    name: "Laya Browser Agent",
    kind: "product",
    year: "2026",
    order: 14,
    status: { en: "Work in progress", fr: "En cours" },
    oneLiner: {
      en: "Browser automation where code stays in charge: a small model ranks visible controls, a resolver supplies values, a verifier checks the goal. Credentials never reach the model.",
      fr: "Automatisation web où le code garde la main : un petit modèle classe les contrôles visibles, un résolveur fournit les valeurs, un vérificateur contrôle l'objectif. Les identifiants n'atteignent jamais le modèle.",
    },
    stack: ["Node", "TypeScript", "Python", "Next.js"],
    repo: gh("browser-agent-laya-fast"),
  },
  {
    slug: "real-time-chat",
    name: "Real-time chat",
    kind: "product",
    year: "2024",
    order: 15,
    oneLiner: {
      en: "Rooms, typing indicators and read receipts over Socket.io, with JWT auth and MongoDB.",
      fr: "Salons, indicateurs de frappe et accusés de lecture via Socket.io, avec authentification JWT et MongoDB.",
    },
    stack: ["React", "Express", "Socket.io", "MongoDB"],
    cover: "/work/real-time-chat/cover.webp",
    repo: gh("real-time-chat"),
    live: "https://real-time-chat-omega.vercel.app",
  },
  {
    slug: "dhyafa",
    name: "Dhyafa",
    kind: "product",
    year: "2026",
    order: 16,
    oneLiner: {
      en: "A Booking.com-style marketplace for Algeria: hotels and hosts list stays, travellers search, book, pay with Edahabia or CIB through Chargily, and review. Arabic-first with RTL, plus French and English; prices in DZD.",
      fr: "Une plateforme de réservation type Booking.com pour l'Algérie : hôtels et hôtes publient leurs logements, les voyageurs recherchent, réservent, paient par Edahabia ou CIB via Chargily, et laissent un avis. Arabe d'abord avec RTL, plus français et anglais ; prix en DZD.",
    },
    stack: ["Supabase (Postgres, Auth, RLS)", "Expo", "Next.js", "Chargily Pay", "Turborepo"],
    repo: gh("dhyafa"),
  },
];

export const archive: { name: string; desc: L; href: string }[] = [
  { name: "anime-sekai", desc: { en: "ad-free anime streaming", fr: "streaming d'anime sans pub" }, href: "https://anime-sekai-five.vercel.app" },
  { name: "shortly", desc: { en: "URL shortener", fr: "raccourcisseur d'URL" }, href: "https://shortly-brown-pi.vercel.app" },
  { name: "Hoo-Bank", desc: { en: "landing page", fr: "page d'accueil" }, href: "https://hoobanksiteio.netlify.app" },
  { name: "Frontend Mentor", desc: { en: "early CSS challenges", fr: "premiers défis CSS" }, href: "https://github.com/samdem-ai?tab=repositories" },
];
