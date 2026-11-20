import { describe, expect, it } from "vitest";
import { contactLinks, contactSentence } from "./contact";

describe("contactLinks", () => {
  it("returns nothing while both fields are empty", () => {
    expect(contactLinks({ email: "", telegram: " " })).toEqual([]);
  });

  it("builds mailto and t.me links from a URL or a bare handle", () => {
    const links = contactLinks({ email: "hi@example.com", telegram: "https://t.me/backfuture/" });
    expect(links.map((l) => l.href)).toEqual(["mailto:hi@example.com", "https://t.me/backfuture"]);
    expect(contactLinks({ email: "", telegram: "backfuture" })[0]?.text).toBe("@backfuture");
  });
});

describe("contactSentence", () => {
  it("joins channels in plain text", () => {
    const links = contactLinks({ email: "hi@example.com", telegram: "backfuture" });
    expect(contactSentence(links)).toBe("на пошту hi@example.com або у Telegram @backfuture");
  });
});
