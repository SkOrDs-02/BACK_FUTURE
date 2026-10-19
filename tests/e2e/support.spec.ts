import { expect, test } from "@playwright/test";

// Поки SITE.monobankJarUrl порожній: /support/ рендериться з «скоро» і noindex,
// а лінків на неї в меню й футері немає. Стан із банкою покриває
// src/lib/support.test.ts (hasSupportJar з мокнутим SITE).
test("support page without a jar shows a placeholder and is noindex", async ({ page }) => {
  await page.goto("/support/");
  await expect(page.getByRole("heading", { name: "Підтримати проєкт", level: 1 })).toBeVisible();
  await expect(page.getByText("Банка скоро зʼявиться")).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.locator('a[href="/support/"]')).toHaveCount(0);
});
