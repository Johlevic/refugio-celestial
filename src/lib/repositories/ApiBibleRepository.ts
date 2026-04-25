import type { IRemoteBibleSource } from "./IBibleRepository";
import type { Lang, Mood, Verse } from "../domain/types";
import { formatVerseId } from "../domain/types";

type ProxyResponse = {
  verse?: {
    text: string;
    ref: string;
    source: "api-bible";
    language: Lang;
    categories?: string[];
  } | null;
};

export class ApiBibleRepository implements IRemoteBibleSource {
  constructor(private readonly endpoint = "/api/verse-remote") {}

  supportsLanguage(lang: Lang): boolean {
    return lang === "es" && Boolean(import.meta.env.PUBLIC_API_BIBLE_BID_ES);
  }

  async fetchVerse(
    lang: Lang,
    mood: Mood,
    avoidRefs: ReadonlySet<string>
  ): Promise<Verse | null> {
    if (!this.supportsLanguage(lang)) return null;
    const params = new URLSearchParams({
      lang,
      mood,
    });
    if (avoidRefs.size > 0) {
      params.set("avoid", Array.from(avoidRefs).slice(0, 80).join("||"));
    }

    const res = await fetch(`${this.endpoint}?${params.toString()}`);
    if (!res.ok) return null;
    const data = (await res.json()) as ProxyResponse;
    const v = data.verse;
    if (!v?.text || !v?.ref) return null;

    return {
      id: formatVerseId(v.ref, lang, "api-bible"),
      text: v.text.trim().replace(/\s+/g, " "),
      ref: v.ref.trim(),
      source: "api-bible",
      categories: Array.isArray(v.categories) ? [...v.categories] : [],
      language: lang,
    };
  }
}
