import versesEs from "@/data/verses-es.json";
import versesEn from "@/data/verses-en.json";
import { VerseService } from "../services/VerseService";
import { LocalJsonBibleRepository } from "../repositories/LocalJsonBibleRepository";
import { BibleApiRepository } from "../repositories/BibleApiRepository";
import { VerseRefCache } from "../cache/VerseRefCache";
import type { Verse, Lang, Mood } from "../domain/types";
import type { LocalVerseFile } from "../domain/types";

let clientService: VerseService | null = null;

/**
 * Provider (service locator) for the client-side VerseService singleton.
 */
export function getClientVerseService(): VerseService {
  if (typeof window === "undefined") {
    throw new Error("getClientVerseService is browser-only");
  }
  if (!clientService) {
    const local = new LocalJsonBibleRepository({
      es: versesEs as LocalVerseFile,
      en: versesEn as LocalVerseFile,
    });
    const remote = new BibleApiRepository();
    const cache = new VerseRefCache();
    clientService = new VerseService(local, remote, cache);
  }
  return clientService;
}

/**
 * Build-time / SSR-friendly first paint (no network, no localStorage).
 */
export function getSsgInitialVerse(
  lang: Lang = "es",
  mood: Mood = "all"
): Verse {
  const local = new LocalJsonBibleRepository({
    es: versesEs as LocalVerseFile,
    en: versesEn as LocalVerseFile,
  });
  const v = local.getRandomFromLocal(lang, mood, new Set());
  if (v) return v;
  const data = (lang === "es" ? versesEs : versesEn) as LocalVerseFile;
  const first = data.verses[0]!;
  return {
    id: `local::${first.ref}`,
    text: first.text,
    ref: first.ref,
    source: "local",
    categories: [...first.categories],
    language: lang,
  };
}
