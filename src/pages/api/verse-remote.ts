import type { APIRoute } from "astro";
import type { Lang, Mood } from "@/lib/domain/types";

export const prerender = false;

const DEFAULT_BASE = "https://api.scripture.api.bible/v1";
const ALLOWED_MOODS: Mood[] = [
  "all",
  "comfort",
  "wisdom",
  "hope",
  "love",
  "repentance",
];

const KEYWORDS: Record<Lang, Record<Mood, string[]>> = {
  es: {
    all: ["Dios", "Jesus", "fe", "esperanza"],
    comfort: ["consuelo", "paz", "refugio", "ansiedad", "descanso"],
    wisdom: ["sabiduria", "entendimiento", "prudencia", "consejo"],
    hope: ["esperanza", "promesa", "confianza", "futuro"],
    love: ["amor", "compasion", "caridad", "misericordia"],
    repentance: ["arrepentimiento", "perdon", "confesar", "convertios"],
  },
  en: {
    all: ["God", "Jesus", "faith", "hope"],
    comfort: ["comfort", "peace", "rest", "fear not"],
    wisdom: ["wisdom", "understanding", "knowledge", "counsel"],
    hope: ["hope", "promise", "trust", "future"],
    love: ["love", "charity", "compassion", "mercy"],
    repentance: ["repent", "forgive", "confess", "forgiveness"],
  },
};

type ApiBibleCandidate = {
  ref: string;
  text: string;
};
type AttemptDebug = {
  query: string;
  status?: number;
  error?: string;
  candidateCount?: number;
};

function sanitizeText(value: string): string {
  return value
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function scoreCandidate(
  candidate: ApiBibleCandidate,
  keywords: string[],
): number {
  const haystack = `${candidate.ref} ${candidate.text}`.toLowerCase();
  let score = 0;
  for (const kw of keywords) {
    const hit = kw.toLowerCase();
    if (haystack.includes(hit)) score += 4;
  }
  if (candidate.text.length >= 40 && candidate.text.length <= 320) score += 2;
  return score;
}

function extractCandidates(payload: unknown): ApiBibleCandidate[] {
  const out: ApiBibleCandidate[] = [];
  const stack: unknown[] = [payload];

  while (stack.length > 0) {
    const node = stack.pop();
    if (!node || typeof node !== "object") continue;

    if (Array.isArray(node)) {
      for (const item of node) stack.push(item);
      continue;
    }

    const rec = node as Record<string, unknown>;
    const ref = typeof rec.reference === "string" ? rec.reference.trim() : "";
    const textRaw =
      typeof rec.text === "string"
        ? rec.text
        : typeof rec.content === "string"
          ? rec.content
          : "";
    const text = sanitizeText(textRaw);
    if (ref && text) out.push({ ref, text });

    for (const value of Object.values(rec)) stack.push(value);
  }

  const seen = new Set<string>();
  return out.filter((c) => {
    const key = `${c.ref}::${c.text}`.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function toCategoryKey(lang: Lang, mood: Mood): string {
  if (mood === "all") return "all";
  if (lang === "es") {
    const esMap: Record<Exclude<Mood, "all">, string> = {
      comfort: "consuelo",
      wisdom: "sabiduria",
      hope: "esperanza",
      love: "amor",
      repentance: "perdon",
    };
    return esMap[mood];
  }
  return mood;
}

function pickBibleId(lang: Lang): string {
  return lang === "es"
    ? (import.meta.env.PUBLIC_API_BIBLE_BID_ES ?? "")
    : (import.meta.env.PUBLIC_API_BIBLE_BID_EN ?? "");
}

export const GET: APIRoute = async ({ url }) => {
  const key = import.meta.env.API_BIBLE_KEY;
  if (!key) {
    return new Response(JSON.stringify({ verse: null, reason: "missing-key" }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }

  const lang: Lang = url.searchParams.get("lang") === "en" ? "en" : "es";
  const rawMood = url.searchParams.get("mood") ?? "all";
  const mood: Mood = ALLOWED_MOODS.includes(rawMood as Mood)
    ? (rawMood as Mood)
    : "all";
  const avoid = new Set(
    (url.searchParams.get("avoid") ?? "")
      .split("||")
      .map((x) => x.trim().toLowerCase())
      .filter(Boolean),
  );

  const bibleId = pickBibleId(lang);
  if (!bibleId) {
    return new Response(
      JSON.stringify({ verse: null, reason: "missing-bible-id" }),
      {
        status: 200,
        headers: { "content-type": "application/json" },
      },
    );
  }

  const base = (import.meta.env.PUBLIC_API_BIBLE_BASE ?? DEFAULT_BASE).replace(
    /\/$/,
    "",
  );
  const debugMode = url.searchParams.get("debug") === "1";
  const keywords = KEYWORDS[lang][mood];
  const rotated = [...keywords].sort(() => Math.random() - 0.5);
  const timeoutMs = 6000;
  const debugAttempts: AttemptDebug[] = [];

  for (const query of rotated) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const u = `${base}/bibles/${encodeURIComponent(bibleId)}/search?query=${encodeURIComponent(query)}&limit=15&sort=relevance`;
      const res = await fetch(u, {
        headers: {
          "api-key": key,
          accept: "application/json",
        },
        signal: ctrl.signal,
      });
      if (!res.ok) {
        debugAttempts.push({ query, status: res.status, error: "search-not-ok" });
        continue;
      }

      const payload = (await res.json()) as unknown;
      const candidates = extractCandidates(payload)
        .filter((c) => !avoid.has(c.ref.toLowerCase()))
        .map((c) => ({ c, score: scoreCandidate(c, keywords) }))
        .filter((x) => x.score >= 4)
        .sort((a, b) => b.score - a.score);
      debugAttempts.push({
        query,
        status: res.status,
        candidateCount: candidates.length,
      });

      const best = candidates[0]?.c;
      if (!best) continue;

      return new Response(
        JSON.stringify({
          verse: {
            text: best.text,
            ref: best.ref,
            source: "api-bible",
            language: lang,
            categories: [toCategoryKey(lang, mood)],
          },
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      );
    } catch {
      debugAttempts.push({ query, error: "request-failed" });
    } finally {
      clearTimeout(timer);
    }
  }

  // Backup query with very common terms in case category terms are too strict.
  const backupQueries = lang === "es" ? ["Dios", "Jesús", "Señor"] : ["God", "Jesus", "Lord"];
  for (const query of backupQueries) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const u = `${base}/bibles/${encodeURIComponent(bibleId)}/search?query=${encodeURIComponent(query)}&limit=10`;
      const res = await fetch(u, {
        headers: {
          "api-key": key,
          accept: "application/json",
        },
        signal: ctrl.signal,
      });
      if (!res.ok) {
        debugAttempts.push({ query, status: res.status, error: "backup-not-ok" });
        continue;
      }
      const payload = (await res.json()) as unknown;
      const candidates = extractCandidates(payload).filter(
        (c) => !avoid.has(c.ref.toLowerCase()),
      );
      debugAttempts.push({
        query,
        status: res.status,
        candidateCount: candidates.length,
      });
      const best = candidates[0];
      if (!best) continue;

      return new Response(
        JSON.stringify({
          verse: {
            text: best.text,
            ref: best.ref,
            source: "api-bible",
            language: lang,
            categories: [toCategoryKey(lang, mood)],
          },
          ...(debugMode ? { debug: debugAttempts } : {}),
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      );
    } catch {
      debugAttempts.push({ query, error: "backup-request-failed" });
    } finally {
      clearTimeout(timer);
    }
  }

  return new Response(
    JSON.stringify({
      verse: null,
      reason: "no-candidate",
      ...(debugMode ? { debug: debugAttempts } : {}),
    }),
    {
      status: 200,
      headers: { "content-type": "application/json" },
    },
  );
};
