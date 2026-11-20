import { expect, test } from "@playwright/test";

// Банка задана в SITE.monobankJarUrl: /support/ індексується, веде на банку,
// а посилання на неї є в меню й футері. Стан без банки покриває
// src/lib/support.test.ts (hasSupportJar з мокнутим SITE).
test("support page links to the monobank jar and is indexable", async ({ page }) => {
  await page.goto("/support/");
  await expect(page.getByRole("heading", { name: "Підтримати проєкт", level: 1 })).toBeVisible();
  const jar = page.locator('#support-buttons a[data-support-provider="monobank"]');
  await expect(jar).toHaveAttribute("href", /^https:\/\/send\.monobank\.ua\/jar\//);
  await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
  expect(await page.locator('a[href="/support/"]').count()).toBeGreaterThan(0);
});

test("about page shows the Telegram contact", async ({ page }) => {
  await page.goto("/about/");
  await expect(page.locator('#contact a[href="https://t.me/SkOrDs1"]')).toBeVisible();
});
