import { describe, expect, it } from "vitest";
import type { SubjectId } from "../config/site";
import type { Fact } from "./filterFacts";
import { eraMilestones, relatedFacts } from "./related";

function makeFact(
  id: string,
  subject: SubjectId,
  yearOfEvent: number,
  draft = false,
  impact?: "low" | "medium" | "high",
): Fact {
  return {
    id,
    data: {
      title: `Title ${id}`,
      subject,
      short: "x".repeat(40),
      yearOfEvent,
      relevantForEras: [3],
      sources: [{ title: "src", url: "https://example.com" }],
      tags: [],
      draft,
      impact,
    },
  } as unknown as Fact;
}

const ids = (facts: Fact[]) => facts.map((f) => f.id);

describe("relatedFacts", () => {
  const current = makeFact("cur", "physics", 2010);

  it("takes closest same-subject facts and keeps one slot for the same year", () => {
    const facts = [
      current,
      makeFact("p-2000", "physics", 2000),
      makeFact("p-2011", "physics", 2011),
      makeFact("p-2009", "physics", 2009),
      makeFact("p-2012", "physics", 2012),
      makeFact("b-2010", "biology", 2010),
      makeFact("t-2010", "tech", 2010),
    ];
    expect(ids(relatedFacts(facts, current))).toEqual(["p-2011", "p-2009", "p-2012", "b-2010"]);
  });

  it("fills with same-subject facts when nothing else shares the year", () => {
    const facts = [
      current,
      makeFact("p-1", "physics", 2001),
      makeFact("p-2", "physics", 2002),
      makeFact("p-3", "physics", 2003),
      makeFact("p-4", "physics", 2004),
      makeFact("b-1999", "biology", 1999),
    ];
    expect(ids(relatedFacts(facts, current))).toEqual(["p-4", "p-3", "p-2", "p-1"]);
  });

  it("falls back to any subject by year proximity for small subjects", () => {
    const facts = [
      current,
      makeFact("p-2000", "physics", 2000),
      makeFact("b-2010", "biology", 2010),
      makeFact("t-2010", "tech", 2010),
      makeFact("c-2015", "culture", 2015),
      makeFact("c-2030", "culture", 2030),
    ];
    expect(ids(relatedFacts(facts, current))).toEqual(["p-2000", "b-2010", "t-2010", "c-2015"]);
  });

  it("never returns the current fact or drafts", () => {
    const facts = [
      current,
      makeFact("draft", "physics", 2010, true),
      makeFact("ok", "physics", 2010),
    ];
    expect(ids(relatedFacts(facts, current))).toEqual(["ok"]);
  });

  it("is deterministic regardless of input order", () => {
    const facts = [
      current,
      makeFact("a", "physics", 2011),
      makeFact("b", "physics", 2009),
      makeFact("c", "physics", 2011),
      makeFact("d", "tech", 2010),
    ];
    const reversed = [...facts].reverse();
    expect(ids(relatedFacts(reversed, current))).toEqual(ids(relatedFacts(facts, current)));
  });
});

describe("eraMilestones", () => {
  const era = { yearStart: 2004, yearEnd: 2010 };

  it("puts high-impact facts from the era's own years first, chronologically", () => {
    const facts = [
      makeFact("high-2020", "tech", 2020, false, "high"),
      makeFact("high-2008", "tech", 2008, false, "high"),
      makeFact("high-2006", "physics", 2006, false, "high"),
      makeFact("medium-2007", "tech", 2007),
      makeFact("low-2005", "tech", 2005, false, "low"),
    ];
    expect(ids(eraMilestones(facts, era))).toEqual(["high-2006", "high-2008", "high-2020"]);
  });

  it("tops up with lower impact when there are few high-impact facts", () => {
    const facts = [
      makeFact("low-2005", "tech", 2005, false, "low"),
      makeFact("medium-2012", "tech", 2012),
    ];
    expect(ids(eraMilestones(facts, era))).toEqual(["medium-2012", "low-2005"]);
  });
});
