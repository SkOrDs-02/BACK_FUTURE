/**
 * Pure helpers behind `/compare?a=…&b=…`. Build a deterministic per-year
 * stats payload that the page template can render in two columns without
 * pulling in `[year].astro` plumbing (YearHero, FactTimeline, etc.). Keeping
 * this here also makes the comparison behaviour unit-testable without an
 * Astro renderer.
 */
import type { SubjectId } from "../config/site";
import { eraOf, type Era } from "./eras";
import { factsForYear, type Fact } from "./filterFacts";

export interface CompareSubjectRef {
  subject: SubjectId;
  count: number;
}

export interface YearStats {
  year: number;
  era: Era;
  totalCount: number;
  topFacts: Fact[];
  subjects: CompareSubjectRef[];
}

/**
 * Rank everything a graduate of `year` missed, biased toward high-impact news.
 * Within an impact bucket we sort by `yearOfEvent` descending (newer first);
 * ties break on id for a stable build. Returns a fresh array.
 */
export function rankedFactsForYear(facts: readonly Fact[], year: number): Fact[] {
  const impactRank = (f: Fact): number => {
    switch (f.data.impact ?? "medium") {
      case "high":
        return 3;
      case "medium":
        return 2;
      case "low":
        return 1;
    }
  };

  return factsForYear(facts, year)
    .slice()
    .sort((a, b) => {
      const ra = impactRank(a);
      const rb = impactRank(b);
      if (ra !== rb) return rb - ra;
      if (a.data.yearOfEvent !== b.data.yearOfEvent) {
        return b.data.yearOfEvent - a.data.yearOfEvent;
      }
      return a.id.localeCompare(b.id);
    });
}

/** Top-N of `rankedFactsForYear`. */
export function topImpactFacts(facts: readonly Fact[], year: number, n = 3): Fact[] {
  return rankedFactsForYear(facts, year).slice(0, Math.max(0, n));
}

/**
 * Take the first `n` items of an already ranked list, putting the ones
 * `isShared` rejects first and only then topping up with shared ones. Order
 * inside each group follows `ranked`. Generic so the `/compare` client script
 * can run the same rule over its slug lists.
 */
export function pickUniqueFirst<T>(
  ranked: readonly T[],
  isShared: (item: T) => boolean,
  n: number,
): T[] {
  const limit = Math.max(0, n);
  const unique = ranked.filter((item) => !isShared(item));
  if (unique.length >= limit) return unique.slice(0, limit);
  const shared = ranked.filter((item) => isShared(item));
  return unique.concat(shared.slice(0, limit - unique.length));
}

/**
 * Top facts for `year` when it is shown next to `otherYear`. The earlier year
 * leads with what only it missed (facts the later graduate also missed are
 * pushed to the back), so the two columns differ. The later year, or the same
 * year, keeps the plain top-N.
 */
export function topFactsAgainst(
  facts: readonly Fact[],
  year: number,
  otherYear: number,
  n = 3,
): Fact[] {
  const ranked = rankedFactsForYear(facts, year);
  if (year >= otherYear) return ranked.slice(0, Math.max(0, n));
  const otherIds = new Set(factsForYear(facts, otherYear).map((f) => f.id));
  return pickUniqueFirst(ranked, (f) => otherIds.has(f.id), n);
}

/**
 * Group `facts` (already filtered for a given year via `factsForYear`) by
 * subject and return [{subject, count}], sorted by count descending then by
 * subject id ascending for determinism.
 */
export function subjectsForYear(facts: readonly Fact[]): CompareSubjectRef[] {
  const counts = new Map<SubjectId, number>();
  for (const f of facts) {
    counts.set(f.data.subject, (counts.get(f.data.subject) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([subject, count]) => ({ subject, count }))
    .sort((a, b) => {
      if (a.count !== b.count) return b.count - a.count;
      return a.subject.localeCompare(b.subject);
    });
}

/**
 * Collect everything `/compare` needs about a single year: matched fact count,
 * era metadata, top-impact picks, and subject breakdown. Pass `otherYear` to
 * get the pair-aware picks from `topFactsAgainst`. Returned shape is
 * intentionally small — anything heavier (FactCard renderer, FactTimeline)
 * stays in the page layer.
 */
export function collectYearStats(
  facts: readonly Fact[],
  year: number,
  topN = 3,
  otherYear?: number,
): YearStats {
  const matched = factsForYear(facts, year);
  return {
    year,
    era: eraOf(year),
    totalCount: matched.length,
    topFacts:
      otherYear === undefined
        ? topImpactFacts(facts, year, topN)
        : topFactsAgainst(facts, year, otherYear, topN),
    subjects: subjectsForYear(matched),
  };
}

/**
 * Intersect the subject lists of two year-stats objects, preserving the order
 * of the first argument so the output is stable regardless of which year is on
 * the left.
 */
export function commonSubjects(a: YearStats, b: YearStats): SubjectId[] {
  const bSet = new Set(b.subjects.map((s) => s.subject));
  return a.subjects.map((s) => s.subject).filter((s) => bSet.has(s));
}

/**
 * Pick a deterministic random pair of years in `[yearMin, yearMax]`, with the
 * caveat that `a !== b`. `rand` is injectable so tests can pin output without
 * monkey-patching `Math.random`.
 */
export function randomYearPair(
  yearMin: number,
  yearMax: number,
  rand: () => number = Math.random,
): { a: number; b: number } {
  const span = yearMax - yearMin + 1;
  if (span < 2) {
    // Degenerate range — only one valid year. Return it twice; callers should
    // guard against `a === b` themselves.
    return { a: yearMin, b: yearMin };
  }
  const a = yearMin + Math.floor(rand() * span);
  // Pick `b` from the remaining span so it can never collide with `a`.
  let b = yearMin + Math.floor(rand() * (span - 1));
  if (b >= a) b += 1;
  return { a, b };
}
