import { expect, test } from "@playwright/test";

test("finishing the quiz shows the share button", async ({ page }) => {
  await page.goto("/quiz/");
  await page.getByRole("button", { name: /Почати квіз/ }).click();
  for (let i = 0; i < 5; i++) {
    await page.locator(".quiz-choice:not(:disabled)").first().click();
  }
  const share = page.getByRole("button", { name: "Поділитись результатом" });
  await expect(share).toBeVisible({ timeout: 15_000 });
  const box = await share.boundingBox();
  expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
});

test("/quiz/result/3/ has its own og:image and is noindex", async ({ page, request }) => {
  const res = await page.goto("/quiz/result/3/");
  expect(res?.status()).toBe(200);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    /\/quiz\/result\/3\.png$/,
  );
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.getByRole("link", { name: /Пройти квіз/ })).toHaveAttribute("href", "/quiz/");
  const png = await request.get("/quiz/result/3.png");
  expect(png.status()).toBe(200);
  expect(png.headers()["content-type"]).toContain("image/png");
});
