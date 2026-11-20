import { describe, expect, it } from "vitest";
import type { Fact } from "./filterFacts";
import { buildLlmsFull, buildLlmsIndex } from "./llms";

function makeFact(id: string, year: number, extra: Record<string, unknown> = {}): Fact {
  return {
    id,
    body: "## Деталі\n\nТіло факту.",
    data: {
      title: `Факт ${id}`,
      subject: "physics",
      short: `Коротко про ${id}, достатньо довго для схеми.`,
      yearOfEvent: year,
      relevantForEras: [1],
      sources: [{ title: `Джерело ${id}`, url: `https://example.org/${id}` }],
      tags: [],
      draft: false,
      ...extra,
    },
  } as unknown as Fact;
}

describe("buildLlmsFull", () => {
  const facts = [
    makeFact("physics/b", 2012),
    makeFact("physics/a", 1995),
    makeFact("physics/hidden", 2000, { draft: true }),
  ];
  const out = buildLlmsFull(facts, "https://back-future.com");

  it("contains every published fact with subject, year, short, body and sources", () => {
    for (const id of ["physics/a", "physics/b"]) {
      expect(out).toContain(`## Факт ${id}`);
      expect(out).toContain(`Коротко про ${id}`);
      expect(out).toContain(`[Джерело ${id}](https://example.org/${id})`);
    }
    expect(out).toContain("- Предмет: Фізика");
    expect(out).toContain("- Рік: 1995");
    expect(out).toContain("Тіло факту.");
    expect(out).toContain("https://back-future.com/fact/a/");
  });

  it("skips drafts and orders by year", () => {
    expect(out).not.toContain("hidden");
    expect(out.indexOf("Факт physics/a")).toBeLessThan(out.indexOf("Факт physics/b"));
  });

  it("demotes body headings below the fact heading", () => {
    expect(out).toContain("### Деталі");
  });
});

describe("buildLlmsIndex", () => {
  const eras = [
    { slug: "1991-1995", label: "Перехідна", yearStart: 1991, yearEnd: 1995 },
    { slug: "2018-2025", label: "НУШ", yearStart: 2018, yearEnd: 2099 },
  ];
  const out = buildLlmsIndex(
    [makeFact("physics/a", 1995), makeFact("physics/hidden", 2000, { draft: true })],
    eras,
    "https://www.back-future.com",
  );

  it("uses absolute URLs on the given site", () => {
    expect(out).toContain("(https://www.back-future.com/era/1991-1995/)");
    expect(out).toContain("(https://www.back-future.com/llms-full.txt)");
    expect(out).not.toMatch(/\]\(\//);
  });

  it("counts only published facts and caps open-ended eras at today", () => {
    expect(out).toContain("1 факт про зміни");
    expect(out).toContain("[Фізика](https://www.back-future.com/subject/physics/): 1 факт.");
    expect(out).toContain("2018–сьогодні");
  });
});
