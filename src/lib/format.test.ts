import { describe, expect, it } from "vitest";

import { formatUkDate, formatUkShortDate, isoDate, metaDescription } from "./format";

describe("formatUkDate", () => {
  it("renders Ukrainian long date with named month", () => {
    const result = formatUkDate(new Date(Date.UTC(2024, 2, 15)));
    expect(result).toMatch(/15/);
    expect(result).toMatch(/березн/);
    expect(result).toMatch(/2024/);
  });
});

describe("formatUkShortDate", () => {
  it("renders DD.MM.YYYY", () => {
    expect(formatUkShortDate(new Date(Date.UTC(2024, 2, 15)))).toBe("15.03.2024");
  });

  it("zero-pads single-digit days and months", () => {
    expect(formatUkShortDate(new Date(Date.UTC(2024, 0, 5)))).toBe("05.01.2024");
  });
});

describe("isoDate", () => {
  it("returns YYYY-MM-DD in UTC", () => {
    expect(isoDate(new Date("2024-03-15T12:34:56Z"))).toBe("2024-03-15");
  });

  it("zero-pads month and day", () => {
    expect(isoDate(new Date("2024-01-05T00:00:00Z"))).toBe("2024-01-05");
  });
});

describe("metaDescription", () => {
  it("keeps short text as is, collapsing whitespace", () => {
    expect(metaDescription("  Короткий   опис.  ")).toBe("Короткий опис.");
  });

  it("cuts long text on a word boundary within the limit", () => {
    const long = "слово ".repeat(60).trim();
    const out = metaDescription(long);
    expect(out.length).toBeLessThanOrEqual(160);
    expect(out.endsWith("слово…")).toBe(true);
  });

  it("drops trailing punctuation before the ellipsis", () => {
    const out = metaDescription(`${"а".repeat(150)}, ${"б".repeat(30)}`);
    expect(out).toBe(`${"а".repeat(150)}…`);
  });
});
