// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import sentry from "@sentry/astro";
import tailwindcss from "@tailwindcss/vite";
import { existsSync, readFileSync } from "node:fs";

// Source of truth for the canonical production URL. `site.ts`
// re-uses this via Astro's injected `import.meta.env.SITE` —
// keep that chain in mind before adding another fallback.
// Override per deploy by setting the `PUBLIC_SITE_URL` env var.
const PLACEHOLDER_SITE_URL = "https://back-future.example.com";
const site = process.env.PUBLIC_SITE_URL ?? PLACEHOLDER_SITE_URL;

if (site === PLACEHOLDER_SITE_URL && process.env.NODE_ENV === "production") {
  // Loud-but-non-fatal warning: production canonical / og:url / sitemap
  // will all bake in the placeholder unless the env var is set.
  // eslint-disable-next-line no-console
  console.warn(
    `[astro.config] PUBLIC_SITE_URL is not set; falling back to ${PLACEHOLDER_SITE_URL}. ` +
      `Production canonical URLs and sitemap will use the placeholder.`,
  );
}

// Опціональний Sentry: без DSN — інтеграція не підключається взагалі.
// Runtime SDK-опції (dsn, sampleRate тощо) винесено у `sentry.client.config.ts`
// та `sentry.server.config.ts` — це рекомендований шлях у @sentry/astro v10
// (передавати `dsn` напряму в інтеграцію deprecated).
const sentryDsn = process.env.PUBLIC_SENTRY_DSN ?? process.env.SENTRY_DSN;
const sentryAuthToken = process.env.SENTRY_AUTH_TOKEN;
const sentryProject = process.env.SENTRY_PROJECT ?? "back-future";
const sentryOrg = process.env.SENTRY_ORG;

const sentryIntegration = sentryDsn
  ? [
      sentry({
        // Source-maps upload (build-time) — тільки якщо є auth token + org.
        ...(sentryAuthToken && sentryOrg
          ? {
              org: sentryOrg,
              project: sentryProject,
              authToken: sentryAuthToken,
            }
          : {}),
        // Явний glob — Astro в static-only режимі не завжди коректно
        // підставляє дефолтну директорію для першого проходу плагіна.
        sourcemaps: {
          assets: ["./dist/**/*.js", "./dist/**/*.mjs"],
        },
      }),
    ]
  : [];

// Sitemap бере лише сторінки, які можна індексувати. Фільтр читає вже
// зібраний HTML (sitemap запускається після запису dist), тож будь-яка
// сторінка з `noindex` (404, /share/*, /themes, порожні роки) випадає сама.
const NOINDEX_RE = /<meta name="robots" content="noindex/;
const CANONICAL_RE = /<link rel="canonical" href="([^"]+)"/;
/** @param {string} page */
function isIndexable(page) {
  const file = new URL(`./dist${new URL(page).pathname}index.html`, import.meta.url);
  if (!existsSync(file)) return true;
  const html = readFileSync(file, "utf8");
  if (NOINDEX_RE.test(html)) return false;
  // Сторінка з canonical на іншу адресу (рік → ера) не належить у sitemap.
  const canonical = CANONICAL_RE.exec(html)?.[1];
  return !canonical || new URL(canonical).pathname === new URL(page).pathname;
}

export default defineConfig({
  site,
  integrations: [sitemap({ filter: isIndexable }), ...sentryIntegration],
  output: "static",
  build: {
    inlineStylesheets: "auto",
    format: "directory",
  },
  trailingSlash: "ignore",
  vite: {
    plugins: [tailwindcss()],
  },
});
