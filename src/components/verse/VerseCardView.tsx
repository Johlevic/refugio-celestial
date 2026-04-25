import type { ReactNode } from "react";
import type { Lang, Verse } from "@/lib/domain/types";
import { labelsFor } from "@/lib/i18n/labels";
import { VerseRefCache } from "@/lib/cache/VerseRefCache";

const NT_BOOKS = new Set([
  "mateo",
  "marcos",
  "lucas",
  "juan",
  "hechos",
  "romanos",
  "1 corintios",
  "2 corintios",
  "galatas",
  "efesios",
  "filipenses",
  "colosenses",
  "1 tesalonicenses",
  "2 tesalonicenses",
  "1 timoteo",
  "2 timoteo",
  "tito",
  "filemon",
  "hebreos",
  "santiago",
  "1 pedro",
  "2 pedro",
  "1 juan",
  "2 juan",
  "3 juan",
  "judas",
  "apocalipsis",
  "matthew",
  "mark",
  "luke",
  "john",
  "acts",
  "romans",
  "1 corinthians",
  "2 corinthians",
  "galatians",
  "ephesians",
  "philippians",
  "colossians",
  "1 thessalonians",
  "2 thessalonians",
  "1 timothy",
  "2 timothy",
  "titus",
  "philemon",
  "hebrews",
  "james",
  "1 peter",
  "2 peter",
  "1 john",
  "2 john",
  "3 john",
  "jude",
  "revelation",
]);

function normalizeBookName(raw: string): string {
  return raw
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function getBookFromRef(ref: string): string {
  const m = ref.match(/^(.*?)\s+\d+:\d+/);
  return normalizeBookName(m ? m[1] : ref);
}

function getTestamentLabel(ref: string, lang: Lang): string {
  const book = getBookFromRef(ref);
  const isNt = NT_BOOKS.has(book);
  if (lang === "es") return isNt ? "NT" : "AT";
  return isNt ? "NT" : "OT";
}

type Props = {
  verse: Verse;
  lang: Lang;
  categoryLabel: string;
  onNewVerse: () => void;
  isLoading: boolean;
  captureId: string;
  titleLine: string;
  footerText: string;
  /** Móvil: icono de descarga (esquina del card) */
  actionSlot?: ReactNode;
  /** PC/tablet: botón de descarga con texto en la fila con “Nuevo versículo” */
  actionSlotDesktop?: ReactNode;
};

export function VerseCardView({
  verse,
  lang,
  categoryLabel,
  onNewVerse,
  isLoading,
  captureId,
  titleLine,
  footerText,
  actionSlot,
  actionSlotDesktop,
}: Props) {
  const cache = new VerseRefCache();
  const n = cache.getRecentRefs().length;
  const L = labelsFor(lang);
  const isLongVerse = verse.text.length > 170 || /\n/.test(verse.text);
  const doveSizeClass = isLongVerse ? "h-[5.5rem] w-[5.5rem] md:h-32 md:w-32" : "h-[5.5rem] w-[5.5rem] md:h-24 md:w-24";
  const sourceLine =
    lang === "es"
      ? verse.source === "bible-api"
        ? "World English Bible (WEB)"
        : "Reina-Valera 1960 (RVR60)"
      : verse.source === "bible-api"
        ? "World English Bible (WEB)"
        : "Source: Reina-Valera 1960 (RVR60)";
  const testamentLabel = getTestamentLabel(verse.ref, lang);

  return (
    <article
      className="group relative z-10 mx-auto w-full max-w-2xl overflow-visible border px-2 py-8 max-md:min-h-0 max-md:rounded-2xl max-md:border-[0.5px] max-md:border-[#a6823a]/40 max-md:bg-slate-950/15 max-md:shadow-none md:rounded-2xl md:border-gold-500/10 md:bg-gradient-to-b md:from-[#12132a]/95 md:to-night/50 md:px-6 md:py-6 md:shadow-[0_0_24px_rgba(0,0,0,0.28)]"
    >
      {actionSlot ? <div className="absolute right-3 top-3 z-20">{actionSlot}</div> : null}

      <p className="mb-3 flex w-full justify-center sm:mb-3">
        <span className="inline-flex items-center justify-center gap-1.5 rounded-full border border-gold-500/40 bg-gold-500/10 px-3 py-1 text-center font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-400">
          <i className="fa-solid fa-book-bible me-1.5 opacity-80" aria-hidden />
          {categoryLabel}
        </span>
      </p>

      <div
        id={captureId}
        className="capture-root relative overflow-hidden bg-black/0 px-1 py-2 max-md:rounded-2xl max-md:border max-md:border-gold-500/20 max-md:bg-[#1f1634]/40 max-md:px-3 max-md:py-5 max-md:shadow-[0_0_10px_rgba(212,175,55,0.1)] md:rounded-lg md:border md:border-gold-500/5 md:bg-black/20 md:px-5 md:py-4"
      >
        <div className="relative z-10 grid grid-cols-1 items-center gap-2 md:grid-cols-[112px_minmax(0,1fr)] md:gap-2">
          <div className="mx-auto flex w-full justify-center md:justify-start">
            <img
              src="/img/paloma-perfil.png"
              alt=""
              aria-hidden="true"
              className={`${doveSizeClass} object-contain opacity-90`}
              loading="lazy"
            />
          </div>
          <div>
            <div className="mb-2 flex items-center justify-center gap-2 text-gold-400 sm:mb-3 sm:gap-3">
              <h2
                className="w-full text-center font-display text-sm font-semibold uppercase tracking-[0.2em] text-gold-200 sm:text-base md:text-lg max-md:text-[#f7d97e] max-md:[text-shadow:0_0_10px_rgba(212,175,55,0.35)]"
              >
                {titleLine}
              </h2>
            </div>
            <p
              className="min-h-0 text-center text-base font-normal leading-relaxed text-gold-100/95 sm:text-2xl md:leading-[1.45] max-md:px-1 max-md:py-2 max-md:text-[1.05rem] max-md:font-medium max-md:leading-8 max-md:text-[#f8e4ae]"
            >
              “{verse.text}”
            </p>
            <p
              className="mt-3 text-center font-display text-sm text-gold-500 sm:mt-4 sm:text-base max-md:text-[#f2cb5d] max-md:[text-shadow:0_0_8px_rgba(212,175,55,0.25)]"
            >
              {verse.ref} · {testamentLabel}
            </p>
          </div>
        </div>
        <div
          className="relative z-10 mt-3 flex w-full items-center justify-center gap-2 text-gold-500/50 sm:mt-4"
        >
          <span className="h-px max-w-[40%] flex-1 bg-gradient-to-r from-transparent to-gold-500/30" />
          <i className="fa-solid fa-feather-pointed text-sm" aria-hidden />
          <span className="h-px max-w-[40%] flex-1 bg-gradient-to-l from-transparent to-gold-500/30" />
        </div>
        <p
          className="relative z-10 mt-2 text-center font-sans text-xs text-gold-300/60 sm:mt-3 sm:text-sm"
        >
          {footerText}
        </p>
        <p className="relative z-10 mt-2 text-right font-sans text-[11px] text-gold-400/55 sm:text-xs">
          {sourceLine}
        </p>
      </div>

      <div
        className="mt-4 hidden w-full max-w-md flex-col items-stretch gap-3 sm:mt-5 sm:mx-auto sm:flex sm:max-w-none sm:flex-row sm:items-center sm:justify-center sm:gap-4"
      >
        <button
          type="button"
          onClick={onNewVerse}
          disabled={isLoading}
          className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full border border-gold-500/50 bg-gold-500/15 px-4 py-2.5 text-sm font-semibold text-gold-200 transition hover:border-gold-400 hover:bg-gold-500/25 sm:max-w-xs sm:flex-initial sm:px-6 disabled:cursor-wait disabled:opacity-60"
        >
          {isLoading ? (
            <i className="fa-solid fa-spinner fa-spin" aria-hidden />
          ) : (
            <i className="fa-solid fa-rotate" aria-hidden />
          )}
          {L.newVerse}
        </button>
        {actionSlotDesktop}
      </div>

      <div className="mt-4 flex w-full sm:hidden">
        <button
          type="button"
          onClick={onNewVerse}
          disabled={isLoading}
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-gold-500/50 bg-gold-500/15 px-4 py-2.5 text-sm font-semibold text-gold-200 transition hover:border-gold-400 hover:bg-gold-500/25 disabled:cursor-wait disabled:opacity-60"
        >
          {isLoading ? (
            <i className="fa-solid fa-spinner fa-spin" aria-hidden />
          ) : (
            <i className="fa-solid fa-rotate" aria-hidden />
          )}
          {L.newVerse}
        </button>
      </div>

      <p className="mt-3 text-center font-sans text-xs text-gold-300/50 sm:mt-4">
        <i className="fa-solid fa-clock-rotate-left me-1" aria-hidden />
        <span suppressHydrationWarning>{L.counter(n)}</span>
      </p>
    </article>
  );
}
