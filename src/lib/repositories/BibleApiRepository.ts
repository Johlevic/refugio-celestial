import type { IRemoteBibleSource } from "./IBibleRepository";
import type { Lang, Verse } from "../domain/types";
import { formatVerseId } from "../domain/types";

const DEFAULT_BASE = "https://bible-api.com";

type BibleApiRandomResponse = {
  random_verse: {
    book_id: string;
    book: string;
    chapter: number;
    verse: number;
    text: string;
  };
};

/**
 * Remote verses from bible-api.com (World English Bible by default). Only English.
 */
export class BibleApiRepository implements IRemoteBibleSource {
  constructor(
    private readonly baseUrl: string = import.meta.env.PUBLIC_BIBLE_API_BASE ??
      DEFAULT_BASE
  ) {}

  supportsLanguage(lang: Lang): boolean {
    return lang === "en";
  }

  async fetchRandomVerse(): Promise<Verse | null> {
    const res = await fetch(
      `${this.baseUrl}/data/web/random`.replace(/\/$/, "")
    );
    if (!res.ok) return null;
    const data = (await res.json()) as BibleApiRandomResponse;
    const rv = data?.random_verse;
    if (!rv?.text) return null;
    const ref = `${rv.book} ${rv.chapter}:${rv.verse}`.replace(/\n/g, " ");
    const v: Verse = {
      id: formatVerseId(ref, "en", "bible-api"),
      text: rv.text.trim().replace(/\n/g, " "),
      ref,
      source: "bible-api",
      categories: [],
      language: "en",
    };
    return v;
  }
}
