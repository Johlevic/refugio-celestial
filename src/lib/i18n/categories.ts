import type { Lang, Mood, Verse } from "../domain/types";
import versesEs from "@/data/verses-es.json";
import versesEn from "@/data/verses-en.json";
import { UI } from "./labels";

const metaEs = versesEs.metadata
  .categories as unknown as Record<string, string>;
const metaEn = versesEn.metadata
  .categories as unknown as Record<string, string>;

const EN_MOOD_KEY = new Set([
  "comfort",
  "wisdom",
  "hope",
  "love",
  "repentance",
]);

/**
 * Line shown in the card tag: mood filter label, or first verse category.
 */
export function displayCategory(verse: Verse, lang: Lang, mood: Mood): string {
  if (mood !== "all") {
    return UI[lang].mood[mood];
  }
  const c0 = verse.categories[0];
  if (!c0) return UI[lang].mood.all;
  if (lang === "en" && EN_MOOD_KEY.has(c0)) {
    return UI[lang].mood[c0 as Mood];
  }
  const table = lang === "es" ? metaEs : metaEn;
  return table[c0] ?? c0;
}
