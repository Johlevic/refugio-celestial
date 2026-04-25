import type { IRemoteBibleSource } from "../repositories/IBibleRepository";
import type { LocalJsonBibleRepository } from "../repositories/LocalJsonBibleRepository";
import { VerseRefCache } from "../cache/VerseRefCache";
import type { Lang, Mood, Verse } from "../domain/types";

const MAX_ATTEMPTS = 45;

/**
 * Application service: coordinates remote + local sources and the anti-repetition cache.
 */
export class VerseService {
  constructor(
    private readonly local: LocalJsonBibleRepository,
    private readonly remotes: IRemoteBibleSource[],
    private readonly cache: VerseRefCache
  ) {}

  async getNextVerse(lang: Lang, mood: Mood): Promise<Verse> {
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      const avoid = this.cache.asSet();
      for (const remote of this.remotes) {
        if (!remote.supportsLanguage(lang)) continue;
        const fromRemote = await remote.fetchVerse(lang, mood, avoid);
        if (fromRemote && !avoid.has(fromRemote.ref)) {
          this.cache.rememberRef(fromRemote.ref);
          return fromRemote;
        }
      }

      const fromLocal = this.local.getRandomFromLocal(lang, mood, avoid);
      if (fromLocal && !avoid.has(fromLocal.ref)) {
        this.cache.rememberRef(fromLocal.ref);
        return fromLocal;
      }

      if (fromLocal) {
        this.cache.rememberRef(fromLocal.ref);
        return fromLocal;
      }
    }

    const last = this.local.getRandomFromLocal(
      lang,
      mood,
      new Set()
    );
    if (last) {
      this.cache.rememberRef(last.ref);
      return last;
    }

    return {
      id: "fallback",
      text: "In the beginning God created the heaven and the earth.",
      ref: "Genesis 1:1",
      source: "local",
      categories: [],
      language: "en",
    };
  }
}
