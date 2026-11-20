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
