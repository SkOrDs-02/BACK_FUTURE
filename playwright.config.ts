import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  use: {
    baseURL: "http://127.0.0.1:4321",
    trace: "on-first-retry",
  },
  webServer: {
    // У CI крок «Build» уже зібрав dist, тож тут лише preview. Друга повна
    // збірка (сотні OG-картинок) не вкладалась у таймаут webServer.
    command: process.env.CI
      ? "npm run preview -- --host 127.0.0.1"
      : "npm run build && npm run preview -- --host 127.0.0.1",
    url: "http://127.0.0.1:4321",
    reuseExistingServer: !process.env.CI,
    timeout: 300_000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-chrome",
      // Pixel 7 виділено навмисно: 412×915 з devicePixelRatio=2.625 близько до
      // реальних Android-флагманів і ширше за 375px iPhone, тому сценарії, що
      // ламаються на 412px, гарантовано впадуть і на 375px. Ширина 375px
      // окремо перевіряється у `mobile.spec.ts` через `page.setViewportSize`.
      use: { ...devices["Pixel 7"] },
      testMatch: /mobile\.spec\.ts/,
    },
  ],
});
