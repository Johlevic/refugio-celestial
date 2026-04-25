import type { Lang, Mood } from "../domain/types";

export const UI = {
  es: {
    title: "Alimento para el alma",
    newVerse: "Nuevo versículo",
    download: "Descargar imagen",
    counter: (n: number) => `Textos únicos en memoria: ${n}`,
    footer: "Medita · Ora · Reflexiona",
    mood: {
      all: "Todos",
      comfort: "Consuelo",
      wisdom: "Sabiduría",
      hope: "Esperanza",
      love: "Amor",
      repentance: "Perdón",
    } satisfies Record<Mood, string>,
  },
  en: {
    title: "Nourishment for the soul",
    newVerse: "New verse",
    download: "Download image",
    counter: (n: number) => `Unique texts in memory: ${n}`,
    footer: "Meditate · Pray · Reflect",
    mood: {
      all: "All",
      comfort: "Comfort",
      wisdom: "Wisdom",
      hope: "Hope",
      love: "Love",
      repentance: "Forgiveness",
    } satisfies Record<Mood, string>,
  },
} as const;

export function labelsFor(lang: Lang) {
  return UI[lang];
}
