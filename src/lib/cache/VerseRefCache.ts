const LS_KEY = "refugio-celestial:recent-refs";
const MAX = 20;

/**
 * Client-side cache of recently shown references to reduce repetition.
 */
export class VerseRefCache {
  getRecentRefs(): string[] {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as unknown;
      return Array.isArray(parsed) ? (parsed as string[]).filter((x) => typeof x === "string") : [];
    } catch {
      return [];
    }
  }

  rememberRef(ref: string): void {
    if (typeof window === "undefined") return;
    const list = this.getRecentRefs().filter((r) => r !== ref);
    list.unshift(ref);
    const next = list.slice(0, MAX);
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(next));
    } catch {
      /* quota */
    }
  }

  asSet(): Set<string> {
    return new Set(this.getRecentRefs());
  }
}
