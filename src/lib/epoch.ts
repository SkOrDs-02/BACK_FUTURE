/**
 * Pick the epoch snapshot (`content/epoch/*.json`) for a graduation year.
 * The closest snapshot not later than `year` wins: a 1993 graduate never saw
 * 1995. Years before the earliest snapshot fall back to the earliest one.
 */
export function pickEpoch<T extends { year: number }>(
  snapshots: readonly T[],
  year: number,
): T | undefined {
  let before: T | undefined;
  let earliest: T | undefined;
  for (const s of snapshots) {
    if (s.year <= year && (!before || s.year > before.year)) before = s;
    if (!earliest || s.year < earliest.year) earliest = s;
  }
  return before ?? earliest;
}

/** Honest caption: «2024-й» for an exact match, «зріз 2000-го» otherwise. */
export function epochLabel(snapshotYear: number, year: number): string {
  return snapshotYear === year ? `${year}-й` : `зріз ${snapshotYear}-го`;
}
