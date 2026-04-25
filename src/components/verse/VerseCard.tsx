import type { Verse, Lang, Mood } from "@/lib/domain/types";
import { getClientVerseService, getSsgInitialVerse } from "@/lib/providers/verseServiceFactory";
import { displayCategory } from "@/lib/i18n/categories";
import { UI } from "@/lib/i18n/labels";
import { showToast } from "@/lib/ui/toast";
import { useCallback, useEffect, useState } from "react";
import { VerseCardView } from "./VerseCardView";
import { DownloadButton } from "./DownloadButton";
import { VerseActionsMenu } from "./VerseActionsMenu";

const MOODS: Mood[] = [
  "all",
  "comfort",
  "wisdom",
  "hope",
  "love",
  "repentance",
];
const MOOD_SET = new Set<string>(MOODS);
const CAPTURE = "refugio-verse-capture";

type Props = {
  initialFromBuild: Verse;
};

function parseMood(s: string | null): Mood {
  if (s && MOOD_SET.has(s) && s !== "all") return s as Mood;
  return s === "all" || !s ? "all" : (s as Mood) || "all";
}

function readUrl(): { lang: Lang; mood: Mood; hasQuery: boolean } {
  if (typeof window === "undefined") {
    return { lang: "es", mood: "all", hasQuery: false };
  }
  const q = new URLSearchParams(window.location.search);
  const lang: Lang = q.get("lang") === "en" ? "en" : "es";
  const mRaw = q.get("mood");
  const mood = mRaw && MOOD_SET.has(mRaw) ? parseMood(mRaw) : "all";
  return {
    lang,
    mood,
    hasQuery: window.location.search.length > 1,
  };
}

/**
 * Client island: composes `VerseCard` (view) and `DownloadButton` with services + API.
 */
export function VerseCard({ initialFromBuild }: Props) {
  // Keep initial client render equal to server-rendered HTML to avoid hydration mismatch.
  const [verse, setVerse] = useState<Verse>(initialFromBuild);
  const [lang, setLang] = useState<Lang>(initialFromBuild.language ?? "es");
  const [mood, setMood] = useState<Mood>("all");
  const [loading, setLoading] = useState(false);
  const [urlDone, setUrlDone] = useState(true);

  const refresh = useCallback(async (L: Lang, M: Mood) => {
    setLoading(true);
    try {
      const s = getClientVerseService();
      const v = await s.getNextVerse(L, M);
      setVerse(v);
    } catch {
      setVerse(getSsgInitialVerse(L, M));
      showToast(
        L === "es"
          ? "No se pudo consultar la API. Mostrando respaldo local."
          : "API request failed. Showing local fallback.",
        "warning"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const { lang: L, mood: M, hasQuery } = readUrl();
    if (!hasQuery) return;
    setLang(L);
    setMood(M);
    setUrlDone(false);
    void (async () => {
      setLoading(true);
      try {
        const s = getClientVerseService();
        const v = await s.getNextVerse(L, M);
        setVerse(v);
      } catch {
        setVerse(getSsgInitialVerse(L, M));
        showToast(
          L === "es"
            ? "No se pudo consultar la API al cargar. Usando datos locales."
            : "API failed on load. Using local data.",
          "warning"
        );
      } finally {
        setLoading(false);
        setUrlDone(true);
      }
    })();
  }, []);

  const onNew = useCallback(() => {
    if (!urlDone) return;
    void refresh(lang, mood);
  }, [lang, mood, refresh, urlDone]);

  const t = UI[lang];
  const tag = displayCategory(verse, lang, mood);

  return (
    <div className="w-full max-w-2xl px-2 sm:px-0">
      <VerseCardView
        verse={verse}
        lang={lang}
        categoryLabel={tag}
        onNewVerse={onNew}
        isLoading={loading || !urlDone}
        captureId={CAPTURE}
        titleLine={t.title}
        footerText={t.footer}
        actionSlot={
          <VerseActionsMenu
            captureElementId={CAPTURE}
            lang={lang}
            verseText={verse.text}
            verseRef={verse.ref}
            disabled={loading}
          />
        }
        actionSlotDesktop={
          <DownloadButton
            captureElementId={CAPTURE}
            lang={lang}
            disabled={loading}
          />
        }
      />
    </div>
  );
}
