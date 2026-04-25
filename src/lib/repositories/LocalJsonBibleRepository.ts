import type { IBibleRepository } from "./IBibleRepository";
import {
  type Lang,
  type LocalVerseFile,
  type Mood,
  type Verse,
  MOOD_TO_EN,
  MOOD_TO_ES,
} from "../domain/types";
import { formatVerseId } from "../domain/types";

/**
 * Local JSON fallbacks: Spanish RVR dataset + English curated.
 */
export class LocalJsonBibleRepository implements IBibleRepository {
  constructor(
    private readonly byLang: { es: LocalVerseFile; en: LocalVerseFile }
  ) {}

  getRandomFromLocal(
    lang: Lang,
    mood: Mood,
    avoidRefs: ReadonlySet<string>
  ): Verse | null {
    const data = this.byLang[lang];
    let pool = data.verses;

    if (mood !== "all") {
      const key = lang === "es" ? MOOD_TO_ES[mood] : MOOD_TO_EN[mood];
      const filtered = pool.filter((p) => p.categories.includes(key));
      if (filtered.length > 0) pool = filtered;
    }

    if (pool.length === 0) return null;

    const candidates = pool.filter((p) => !avoidRefs.has(p.ref));
    const use = candidates.length > 0 ? candidates : pool;
    const pick = use[Math.floor(Math.random() * use.length)];
    if (!pick) return null;

    return {
      id: formatVerseId(
        pick.ref,
        lang,
        "local"
      ),
      text: pick.text,
      ref: pick.ref,
      source: "local",
      categories: [...pick.categories],
      language: lang,
    };
  }
}
