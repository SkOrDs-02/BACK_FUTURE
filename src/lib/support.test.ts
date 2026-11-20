import { describe, expect, it, vi } from "vitest";

describe("hasSupportJar", () => {
  it("is false while SITE.monobankJarUrl is empty", async () => {
    vi.resetModules();
    vi.doMock("../config/site", () => ({ SITE: { monobankJarUrl: "" } }));
    const { hasSupportJar } = await import("./support");
    expect(hasSupportJar()).toBe(false);
    expect(hasSupportJar("   ")).toBe(false);
  });

  it("is true once SITE.monobankJarUrl is set", async () => {
    vi.resetModules();
    vi.doMock("../config/site", () => ({
      SITE: { monobankJarUrl: "https://send.monobank.ua/jar/example" },
    }));
    const { hasSupportJar } = await import("./support");
    expect(hasSupportJar()).toBe(true);
  });
});

describe("hasSupport", () => {
  it("is true when either the jar or the coffee link is set", async () => {
    vi.resetModules();
    vi.doMock("../config/site", () => ({
      SITE: { monobankJarUrl: "", buyMeACoffeeUrl: "" },
    }));
    const { hasSupport } = await import("./support");
    expect(hasSupport()).toBe(false);
    expect(hasSupport("", "https://buymeacoffee.com/example")).toBe(true);
    expect(hasSupport("https://send.monobank.ua/jar/example", "")).toBe(true);
  });
});
