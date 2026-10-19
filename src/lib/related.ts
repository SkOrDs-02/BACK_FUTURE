import type { Fact } from "./filterFacts";

/**
 * «Схожі факти» under a fact page. Same subject first, closest `yearOfEvent`
 * first; one slot is kept for a fact of another subject from the same year so
 * the block is not always a single-subject list. Remaining slots are filled
 * by year proximity. Ties break on newer year, then id: stable across builds.
 */
export function relatedFacts(facts: readonly Fact[], current: Fact, n = 4): Fact[] {
  if (n <= 0) return [];
  const year = current.data.yearOfEvent;
  const subject = current.data.subject;
  const pool = facts
    .filter((f) => !f.data.draft && f.id !== current.id)
    .sort(
      (a, b) =>
        Math.abs(a.data.yearOfEvent - year) - Math.abs(b.data.yearOfEvent - year) ||
        b.data.yearOfEvent - a.data.yearOfEvent ||
        a.id.localeCompare(b.id),
    );
  const sameSubject = pool.filter((f) => f.data.subject === subject);
  const sameYear = pool.filter((f) => f.data.subject !== subject && f.data.yearOfEvent === year);

  const picked = new Set([...sameSubject.slice(0, n - 1), ...sameYear.slice(0, 1)]);
  for (const f of [...sameSubject, ...sameYear, ...pool]) {
    if (picked.size >= n) break;
    picked.add(f);
  }
  return [...picked].slice(0, n);
}

const IMPACT_RANK = { high: 3, medium: 2, low: 1 } as const;

/**
 * Milestones for an era intro: high-impact facts first, and inside the same
 * impact those that happened during the era's own years, so neighbouring eras
 * do not lead with the same headlines. Then chronological, then id.
 */
export function eraMilestones(
  eraFacts: readonly Fact[],
  era: { yearStart: number; yearEnd: number },
  n = 3,
): Fact[] {
  const score = (f: Fact): number => {
    const y = f.data.yearOfEvent;
    const inEra = y >= era.yearStart && y <= era.yearEnd ? 1 : 0;
    return IMPACT_RANK[f.data.impact ?? "medium"] * 2 + inEra;
  };
  return eraFacts
    .filter((f) => !f.data.draft)
    .sort(
      (a, b) =>
        score(b) - score(a) || a.data.yearOfEvent - b.data.yearOfEvent || a.id.localeCompare(b.id),
    )
    .slice(0, Math.max(0, n));
}
