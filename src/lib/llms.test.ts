import { describe, expect, it } from "vitest";
import type { Fact } from "./filterFacts";
import { buildLlmsFull } from "./llms";

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
