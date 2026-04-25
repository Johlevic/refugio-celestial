export type Lang = "es" | "en";

export type Mood =
  | "all"
  | "comfort"
  | "wisdom"
  | "hope"
  | "love"
  | "repentance";

export interface Verse {
  id: string;
  text: string;
  ref: string;
  source: "bible-api" | "local";
  categories: string[];
  language: Lang;
}

export interface LocalVerseFile {
  metadata: {
    language: string;
    total_verses: number;
  };
  verses: Array<{
    id: number;
    book: string;
    chapter: number;
    verse: number;
    text: string;
    ref: string;
    categories: string[];
  }>;
}

export const MOOD_TO_ES: Record<Exclude<Mood, "all">, string> = {
  comfort: "consuelo",
  wisdom: "sabiduria",
  hope: "esperanza",
  love: "amor",
  repentance: "perdon",
};

export const MOOD_TO_EN: Record<Exclude<Mood, "all">, string> = {
  comfort: "comfort",
  wisdom: "wisdom",
  hope: "hope",
  love: "love",
  repentance: "repentance",
};

export function moodToStorageKey(mood: Mood, lang: Lang): string {
  if (mood === "all") return "all";
  return lang === "es" ? MOOD_TO_ES[mood] : MOOD_TO_EN[mood];
}

export function formatVerseId(
  ref: string,
  lang: Lang,
  source: Verse["source"]
): string {
  return `${lang}::${source}::${ref}`;
}
