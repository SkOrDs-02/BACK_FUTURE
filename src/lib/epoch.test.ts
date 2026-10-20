import { describe, expect, it } from "vitest";
import { epochLabel, pickEpoch } from "./epoch";

const snaps = [2000, 1995, 2005, 2024].map((year) => ({ year }));

describe("pickEpoch", () => {
  it("returns the exact year when present", () => {
    expect(pickEpoch(snaps, 2005)?.year).toBe(2005);
  });

  it("prefers the closest snapshot not later than the year", () => {
    expect(pickEpoch(snaps, 2004)?.year).toBe(2000);
    expect(pickEpoch(snaps, 2023)?.year).toBe(2005);
  });

  it("falls back to the earliest snapshot for years before all of them", () => {
    expect(pickEpoch(snaps, 1991)?.year).toBe(1995);
  });

  it("returns undefined for an empty list", () => {
    expect(pickEpoch([], 2000)).toBeUndefined();
  });
});

describe("epochLabel", () => {
  it("names the year on an exact match", () => {
    expect(epochLabel(2024, 2024)).toBe("2024-й");
  });

  it("names the snapshot year when it differs", () => {
    expect(epochLabel(2000, 2003)).toBe("зріз 2000-го");
  });
});
