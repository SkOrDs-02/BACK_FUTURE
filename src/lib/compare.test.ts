import { describe, expect, it } from "vitest";
import type { SubjectId } from "../config/site";
import {
  collectYearStats,
  commonSubjects,
  pickUniqueFirst,
  randomYearPair,
  subjectsForYear,
  topFactsAgainst,
  topImpactFacts,
} from "./compare";
import type { Fact, Impact } from "./filterFacts";

interface FactStub {
  id: string;
  subject: SubjectId;
  yearOfEvent: number;
  relevantForEras: ReadonlyArray<1 | 2 | 3 | 4 | 5>;
  impact?: Impact;
  draft?: boolean;
}

/**
 * Same shape as `filterFacts.test.ts` — only the fields the lib functions
 * actually read are populated.
 */
function makeFact(stub: FactStub): Fact {
  return {
    id: stub.id,
    data: {
      title: `Title ${stub.id}`,
      subject: stub.subject,
      short: "x".repeat(40),
      yearOfEvent: stub.yearOfEvent,
      relevantForEras: [...stub.relevantForEras],
      impact: stub.impact,
      sources: [{ title: "src", url: "https://example.com" }],
      tags: [],
      draft: stub.draft ?? false,
    },
  } as unknown as Fact;
}

describe("topImpactFacts", () => {
  it("prefers high-impact then newer events, sliced to N", () => {
    const facts = [
      makeFact({
        id: "low-2020",
        subject: "physics",
        yearOfEvent: 2020,
        relevantForEras: [3, 4, 5],
        impact: "low",
      }),
      makeFact({
        id: "high-2010",
        subject: "physics",
        yearOfEvent: 2010,
        relevantForEras: [3, 4, 5],
        impact: "high",
      }),
      makeFact({
        id: "high-2015",
        subject: "biology",
        yearOfEvent: 2015,
        relevantForEras: [3, 4, 5],
        impact: "high",
      }),
      makeFact({
        id: "medium-2018",
        subject: "history",
        yearOfEvent: 2018,
        relevantForEras: [3, 4, 5],
        impact: "medium",
      }),
    ];

    // 2003 → era 2. Era 2 isn't in any of these `relevantForEras`, so use 2010 (era 3).
    expect(topImpactFacts(facts, 2010, 3).map((f) => f.id)).toEqual([
      "high-2015",
      "high-2010",
      "medium-2018",
    ]);
  });

  it("treats facts with no impact field as medium", () => {
    const facts = [
      makeFact({
        id: "no-impact",
        subject: "physics",
        yearOfEvent: 2020,
        relevantForEras: [3, 4, 5],
      }),
      makeFact({
        id: "low",
        subject: "physics",
        yearOfEvent: 2021,
        relevantForEras: [3, 4, 5],
        impact: "low",
      }),
    ];

    expect(topImpactFacts(facts, 2010, 2).map((f) => f.id)).toEqual(["no-impact", "low"]);
  });

  it("never returns drafts or pre-graduation events", () => {
    const facts = [
      makeFact({
        id: "draft-high",
        subject: "physics",
        yearOfEvent: 2020,
        relevantForEras: [3, 4, 5],
        impact: "high",
        draft: true,
      }),
      makeFact({
        id: "before-grad",
        subject: "physics",
        yearOfEvent: 1999,
        relevantForEras: [3, 4, 5],
        impact: "high",
      }),
      makeFact({
        id: "ok",
        subject: "physics",
        yearOfEvent: 2020,
        relevantForEras: [3, 4, 5],
        impact: "high",
      }),
    ];

    expect(topImpactFacts(facts, 2010, 5).map((f) => f.id)).toEqual(["ok"]);
  });
});

describe("subjectsForYear", () => {
  it("groups by subject and sorts by count desc then subject asc", () => {
    const facts = [
      makeFact({ id: "p1", subject: "physics", yearOfEvent: 2020, relevantForEras: [3] }),
      makeFact({ id: "p2", subject: "physics", yearOfEvent: 2021, relevantForEras: [3] }),
      makeFact({ id: "b1", subject: "biology", yearOfEvent: 2020, relevantForEras: [3] }),
      makeFact({ id: "h1", subject: "history", yearOfEvent: 2020, relevantForEras: [3] }),
    ];

    expect(subjectsForYear(facts)).toEqual([
      { subject: "physics", count: 2 },
      { subject: "biology", count: 1 },
      { subject: "history", count: 1 },
    ]);
  });

  it("returns an empty array when nothing matches", () => {
    expect(subjectsForYear([])).toEqual([]);
  });
});

describe("collectYearStats", () => {
  it("bundles era, total count, top facts, and subject breakdown", () => {
    const facts = [
      makeFact({
        id: "h-2015",
        subject: "physics",
        yearOfEvent: 2015,
        relevantForEras: [3, 4, 5],
        impact: "high",
      }),
      makeFact({
        id: "m-2018",
        subject: "biology",
        yearOfEvent: 2018,
        relevantForEras: [3, 4, 5],
        impact: "medium",
      }),
      makeFact({
        id: "draft",
        subject: "history",
        yearOfEvent: 2020,
        relevantForEras: [3, 4, 5],
        impact: "high",
        draft: true,
      }),
    ];

    const stats = collectYearStats(facts, 2010, 3);
    expect(stats.year).toBe(2010);
    expect(stats.era.id).toBe(3);
    expect(stats.totalCount).toBe(2);
    expect(stats.topFacts.map((f) => f.id)).toEqual(["h-2015", "m-2018"]);
    expect(stats.subjects.map((s) => s.subject)).toEqual(["biology", "physics"]);
  });
});

describe("pickUniqueFirst", () => {
  it("puts unshared items first and tops up with shared ones in rank order", () => {
    const shared = new Set(["b", "d"]);
    expect(pickUniqueFirst(["a", "b", "c", "d", "e"], (x) => shared.has(x), 3)).toEqual([
      "a",
      "c",
      "e",
    ]);
    expect(pickUniqueFirst(["b", "a", "d"], (x) => shared.has(x), 3)).toEqual(["a", "b", "d"]);
    expect(pickUniqueFirst(["a"], () => false, 0)).toEqual([]);
  });
});

describe("topFactsAgainst", () => {
  const all = [1, 2, 3, 4, 5] as const;
  // Newest high-impact facts are missed by both 1991 and 2024, so the plain
  // top-N gives both columns the same list.
  const facts = [
    makeFact({
      id: "new-1",
      subject: "tech",
      yearOfEvent: 2025,
      relevantForEras: all,
      impact: "high",
    }),
    makeFact({
      id: "new-2",
      subject: "tech",
      yearOfEvent: 2024,
      relevantForEras: all,
      impact: "high",
    }),
    makeFact({
      id: "new-3",
      subject: "tech",
      yearOfEvent: 2024,
      relevantForEras: all,
      impact: "high",
    }),
    makeFact({
      id: "old-1",
      subject: "history",
      yearOfEvent: 2001,
      relevantForEras: all,
      impact: "high",
    }),
    makeFact({
      id: "old-2",
      subject: "history",
      yearOfEvent: 1998,
      relevantForEras: all,
      impact: "medium",
    }),
  ];

  it("gives 1991 and 2024 different lists, unique facts first", () => {
    const a = topFactsAgainst(facts, 1991, 2024, 3).map((f) => f.id);
    const b = topFactsAgainst(facts, 2024, 1991, 3).map((f) => f.id);
    expect(b).toEqual(["new-1", "new-2", "new-3"]);
    expect(a).toEqual(["old-1", "old-2", "new-1"]);
    expect(a).not.toEqual(b);
  });

  it("is symmetric: the earlier year gets the unique picks on either side", () => {
    expect(topFactsAgainst(facts, 1991, 2024, 3)).toEqual(
      collectYearStats(facts, 1991, 3, 2024).topFacts,
    );
    expect(collectYearStats(facts, 2024, 3, 1991).topFacts.map((f) => f.id)).toEqual([
      "new-1",
      "new-2",
      "new-3",
    ]);
  });

  it("falls back to the plain top-N when both years are the same", () => {
    expect(topFactsAgainst(facts, 2010, 2010, 3)).toEqual(topImpactFacts(facts, 2010, 3));
  });
});

describe("commonSubjects", () => {
  it("preserves the left side's order and intersects with the right", () => {
    const facts = [
      makeFact({ id: "p1", subject: "physics", yearOfEvent: 2015, relevantForEras: [3, 4, 5] }),
      makeFact({ id: "p2", subject: "physics", yearOfEvent: 2016, relevantForEras: [3, 4, 5] }),
      makeFact({ id: "b1", subject: "biology", yearOfEvent: 2017, relevantForEras: [3, 4, 5] }),
      makeFact({ id: "h1", subject: "history", yearOfEvent: 2018, relevantForEras: [3, 4, 5] }),
      makeFact({ id: "t1", subject: "tech", yearOfEvent: 2020, relevantForEras: [3, 4, 5] }),
    ];
    const left = collectYearStats(facts, 2010); // physics(2), biology, history, tech
    // Right covers the same facts but starts at 2017 → biology, history, tech.
    const right = collectYearStats(facts, 2017);
    expect(commonSubjects(left, right)).toEqual(["biology", "history", "tech"]);
  });
});

describe("randomYearPair", () => {
  it("returns a !== b when the range is large enough", () => {
    // rand() = 0 → a=yearMin, b=yearMin (raw) → shifted to yearMin+1
    expect(randomYearPair(1991, 2026, () => 0)).toEqual({ a: 1991, b: 1992 });
    // rand() = 0.9999 → a=2026, b=2025 (no shift since 2025 < 2026)
    expect(randomYearPair(1991, 2026, () => 0.9999)).toEqual({ a: 2026, b: 2025 });
  });

  it("degenerates safely when the range collapses to one year", () => {
    expect(randomYearPair(2003, 2003)).toEqual({ a: 2003, b: 2003 });
  });
});
