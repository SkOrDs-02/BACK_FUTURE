# SPEC: Оживлення BACK_FUTURE і запуск на back-future.com

> **Status:** Active, погоджено з власником 2026-10-18. Перенесено з кореневого `SPEC.md` 2026-10-19 (Spec Kit, PR 2); далі спека ведеться тут.
> Мова спілкування і доків: українська. У всьому, що пишеться (код, коментарі, доки, коміти, UI-копі), довге тире «—» заборонене: крапка, кома, двокрапка, дужки або дефіс «-».

## Проблема

Проєкт `BACK_FUTURE` (Astro 6, static, 175 фактів, 347 комітів) не торкався з 24.05.2026. CI червоний на кроці Lint від червня; відкриті 5 фіча-PR від Devin (#144, #145, #146, #149, #150) і 6 Dependabot-PR; у `project-memory.md` і `roadmap.md` описано стан, який частково розійшовся з кодом (наприклад, `/share/[year]` уже існує як сторіз 1080×1920, хоча roadmap каже, що його бракує). Контент закінчується 2024 роком. Сайт живе на `back-future.vercel.app`, домен `back-future.com` підʼєднаний до Vercel, але заблокований Namecheap (NS = `failed-whois-verification.namecheap.com`). Search Console має property `https://www.back-future.com/`, не підтверджений.

## Мета

Сайт опубліковано на `https://back-future.com` (www → apex редирект), CI зелений, Search Console підтверджено і без помилок індексації, контент доповнено фактами 2025-2026 і дірками старих ер, UI-копі очищено від AI-слопу, додано квадратний постер для шерингу і сторінку `/support`, репо готове до подальшої роботи через GitHub Spec Kit. Після цього власник подає продукт на appmap.com.ua (платне розміщення, від 100 ₴, форма `https://appmap.com.ua/add`); це ручна дія власника, поза кодом.

## Рішення (з інтервʼю)

1. **Домен: `back-future.com`.** `appmap.com.ua` це сторонній каталог, куди продукт подається, а не хост. Канонічний URL без `www`: `https://back-future.com`; `www.back-future.com` редиректить на apex (налаштування домену у Vercel). `PUBLIC_SITE_URL=https://back-future.com` в env Vercel (Production).
2. **Деплой: лише Vercel з Git-інтеграцією** від `SkOrDs-02/BACK_FUTURE`, гілка `main`. `.github/workflows/deploy.yml` (GitHub Pages) видалити. Проєкт Vercel `back-future` (`prj_fyIvR46WvsHJoL1OYsFV08cFQaD5`, team `team_A96p26fl8eTxCK74fXAWybql`) після переносу репо з `Skords-01` треба перепідвʼязати до `SkOrDs-02/BACK_FUTURE` (Vercel API віддає 404 на проєкт, перевірити в дашборді).
3. **Старі фіча-PR #144, #145, #146, #149, #150 закрити** з коментарем «закрито при перезапуску 2026-10; ідея лишається в docs/ideas.md». Dependabot-PR (#154, #156-#160) не мерджити по одному: оновити залежності однією гілкою після зеленого CI, окремим PR `chore(deps)`.
4. **Spec Kit (GitHub `specify` CLI) ставимо в репо.** `specify init --here --integration claude` (у CLI 0.13 прапорець `--ai` замінено на `--integration`), конституція в `.specify/memory/constitution.md` на базі цієї спеки і `docs/content-guidelines.md`. Спеку перенесено в `specs/001-relaunch/spec.md` (цей файл); посилання на неї лежить у кореневому `AGENTS.md`.
5. **Аналітика: PostHog + Sentry**, код уже є і env-gated. Власник кладе в Vercel env: `PUBLIC_ANALYTICS_PROVIDER=posthog`, `PUBLIC_POSTHOG_KEY`, `PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com`, `PUBLIC_SENTRY_DSN`, `SENTRY_ORG`, `SENTRY_PROJECT=back-future`, `SENTRY_AUTH_TOKEN` (sensitive). Без ключів сайт працює без трекерів, це не блокер запуску.
6. **Search Console: верифікація файлом.** `public/google4081be111962d1d3.html` уже лежить у робочому дереві (вміст `google-site-verification: google4081be111962d1d3.html`). Property у GSC створено як URL-prefix `https://www.back-future.com/`; після запуску власник додає ще property `https://back-future.com/` (або Domain-property через DNS TXT), бо канон без `www`. Meta-тег не потрібен; якщо власник захоче другий спосіб, він уже підтримується через env `GOOGLE_SITE_VERIFICATION=NK0p0XcLFLE0eCs6HZP57nWx1AGP-M6-KCCtSx2qeoU`.
7. **Контент: факти 2025-2026, 3-4 на кожен з 11 предметів (~40), плюс дірки старих ер** за звітом `npm run coverage:content` (предмет × ера з найменшим покриттям, довести до мінімуму 2 факти на кожну клітинку, де це фізично можливо). Кожен факт за схемою `src/content.config.ts`, мінімум одне першоджерело (не Вікіпедія), тон за `docs/content-guidelines.md`, без довгого тире. Батчі по предметах, окремі PR `content(<subject>)`.
8. **Антислоп: UI-копі + `/about` + `/metodologia`.** 175 наявних фактів не переписуємо. У `src/**` (компоненти, сторінки, `src/lib/faq.ts`, `src/config/site.ts`) прибрати довге тире, конструкції «не просто X, а Y», «це не про X, це про Y», риторичні питання з самовідповіддю, потрійні прикметники, «варто зазначити», канцелярит. `content/eras.json`: поле `tone` зараз не збігається з роками ери (ера 1991-1995 має tone «1991—1999», ера 1996-2003 має «2000—2009» тощо), виправити на реальні діапазони і без тире. У `scripts/validate-content.ts` додати перевірку на довге тире і список AI-конструкцій, яка **падає лише для фактів з `yearOfEvent >= 2025`** і лише попереджає для старих (щоб не ламати 171 файл).
9. **Постер `/share/[year]`: додати квадрат 1080×1080** поруч із наявним сторіз 1080×1920. Вміст: рік випуску, лічильник «ти пропустив N відкриттів», три віхи (`impact: high`, різні предмети, найновіші). Ендпоінт `/share/[year]/square.png`, кнопки «Сторіз» / «Квадрат» на сторінці `/share/[year]`. Рендер через той самий `svgToPng` з `src/lib/og.ts` і шрифти, що вже використовуються в `src/lib/share.ts`.
10. **`/support`: нова сторінка** з текстом про підтримку проєкту і кнопкою на Monobank-банку. URL банки власник дасть пізніше; `SITE.monobankJarUrl` лишається порожнім, сторінка будується, в меню і футері лінк показується лише коли URL непорожній (так уже працюють `SupportBlock.astro` і `Footer.astro`). Коли URL порожній, `/support` віддає `noindex` і текст «скоро».
11. **SEO/GEO-аудит і правки** (усе в одному PR `feat(seo)`):
    - `PUBLIC_SITE_URL` у проді, canonical/og:url/sitemap без плейсхолдера `back-future.example.com`.
    - `src/config/site.ts`: `repoUrl` → `https://github.com/SkOrDs-02/BACK_FUTURE`.
    - `public/llms.txt` (опис сайту, структура, посилання на `/all`, `/timeline`, RSS, sitemap) і `public/llms-full.txt`, згенерований з колекції при білді (`src/pages/llms-full.txt.ts`): усі факти як markdown, щоб LLM-краулери брали контент цілком.
    - JSON-LD: на головній додати `WebSite` із `SearchAction` (пошук є, Pagefind) і `Organization`; перевірити, що `FAQPage` на `/about` валідний (Rich Results Test).
    - `robots.txt`: явно дозволити GPTBot, ClaudeBot, PerplexityBot, Google-Extended (це просвітницький сайт, трафік з AI-відповідей бажаний).
    - `manifest.webmanifest`: додати PNG-іконки 192 і 512 (зараз лише SVG), інакше Lighthouse PWA і Android install прапорці червоні.
    - Перевірити, що `/share/[year]`, `/og/*`, `/themes` не індексуються там, де не повинні, і що `sitemap-index.xml` не містить noindex-сторінок.
    - `vercel.json` CSP: звірити з PostHog/Sentry хостами (`connect-src` має пускати `eu.i.posthog.com` і `*.ingest.sentry.io`; зараз стоїть `https:` цілком, можна звузити, але не ламати).
12. **Порядок роботи: усе в гілках, запуск домену в кінці**, коли CI зелений, контент і фічі змерджені. До того прод лишається на `back-future.vercel.app`.

## Поверхня (файли, перевірені 2026-10-18)

- `astro.config.mjs` (`site`, інтеграції), `vercel.json` (хедери, CSP), `.github/workflows/{ci,deploy,link-check}.yml`.
- `src/config/site.ts` (`SITE`, `SUBJECTS`), `src/layouts/Base.astro` (head, JSON-LD, верифікація), `src/pages/robots.txt.ts`, `src/pages/rss.xml.ts`.
- `src/lib/share.ts` + `src/pages/share/[year].astro` + `src/pages/share/[year].png.ts` (наявний сторіз-постер), `src/lib/og.ts` (`svgToPng`).
- `src/components/SupportBlock.astro`, `src/components/Footer.astro`, `src/components/Header.astro` (меню).
- `src/pages/{index,about,metodologia}.astro`, `src/lib/faq.ts`.
- `content/facts/<subject>/*.md`, `content/eras.json`, `src/content.config.ts`, `scripts/validate-content.ts`, `scripts/content-coverage.ts`.
- `public/` (`google4081be111962d1d3.html`, `manifest.webmanifest`, нові `llms.txt`, іконки).
- `docs/{roadmap,project-memory,ideas}.md`: оновити під фактичний стан після кожного етапу (прибрати Devin-специфіку: гілки `devin/*`, PAT через secure channel, прев'ю на devinapps.com).

## Поза скоупом v1

- i18n (`/uk/`, `/en/`), `/contributors` і поле `authors`, `/saved`, PWA service-worker/офлайн, issue → draft PR Action (PR #144-#150 закриваються).
- Переписування наявних 175 фактів.
- Сам процес подачі на appmap.com.ua, оплата, Namecheap, Vercel env, створення property в GSC: ручні дії власника, перелічені нижче.
- CMS (Sveltia/Decap) у проді.

## Дії власника (агент не може)

1. **Namecheap:** контактний email підтверджено 2026-10-18 21:33, Namecheap обіцяє реактивацію за 24-48 годин. Після реактивації звірити DNS (`Resolve-DnsName back-future.com -Type NS`): мають бути NS `ns1.vercel-dns.com` / `ns2.vercel-dns.com`, або A `76.76.21.21` для apex і CNAME `cname.vercel-dns.com` для `www`. Якщо після реактивації стоять дефолтні NS Namecheap, виставити вручну в Domain List → Nameservers.
2. **Vercel:** перевірити, що проєкт `back-future` підвʼязаний до `SkOrDs-02/BACK_FUTURE` (Settings → Git), виставити env з п. 5 і `PUBLIC_SITE_URL=https://back-future.com`, домени `back-future.com` (primary) і `www.back-future.com` (redirect на apex).
3. **Search Console:** після того, як домен резолвиться, натиснути «Підтвердити» у property `https://www.back-future.com/`, додати property `https://back-future.com/`, надіслати `https://back-future.com/sitemap-index.xml`.
4. **PostHog / Sentry:** створити проєкти, віддати ключі в Vercel env (не в чат і не в репо).
5. **Monobank:** дати URL банки, коли буде; він іде в `SITE.monobankJarUrl`.
6. **appmap.com.ua:** після запуску подати `https://back-future.com` через `https://appmap.com.ua/add`, обрати місто, категорію («освіта» або найближчу), оплатити розмір бульбашки (від 100 ₴).

## План PR (кожен окремо, від свіжого `main`)

| #    | Гілка                    | Що                                                                                                                                                  |
| ---- | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | `claude/ci-green`        | Полагодити Lint (останній CI впав саме там), оновити залежності, видалити `deploy.yml`, закрити старі PR, `repoUrl` на SkOrDs-02. CI зелений.       |
| 2    | `claude/spec-kit`        | `specify init`, конституція, перенести цю спеку в `specs/001-relaunch/spec.md`, `AGENTS.md` у корені зі звʼязкою до Spec Kit і правилами антислопу. |
| 3    | `claude/seo-geo`         | Пункт 11 цілком + верифікаційний файл GSC + PNG-іконки манифесту.                                                                                   |
| 4    | `claude/antislop-copy`   | Пункт 8: UI-копі, `/about`, `/metodologia`, `eras.json`, правило в `validate-content.ts`.                                                           |
| 5    | `claude/share-square`    | Пункт 9.                                                                                                                                            |
| 6    | `claude/support-page`    | Пункт 10.                                                                                                                                           |
| 7..N | `content/<subject>-2025` | Пункт 7, по предмету на PR; окремий PR на дірки старих ер.                                                                                          |
| last | `claude/docs-refresh`    | `roadmap.md`, `project-memory.md`, `ideas.md`, `README.md` під новий стан; прибрати Devin-специфіку.                                                |

Після merge усіх: власник виконує дії 1-3, агент перевіряє запуск за розділом «Верифікація».

## Верифікація

Кожен PR: `npm run ci` (lint + typecheck + unit + validate:content) і `npm run build` локально, CI зелений на GitHub. Перед merge PR з UI: скріншоти 375px і 1280px.

Кінцева перевірка запуску (усе має пройти):

```bash
# 1. Локальний повний цикл
npm ci
npm run ci            # exit 0
npm run build         # exit 0, без warning про PUBLIC_SITE_URL, бо PUBLIC_SITE_URL=https://back-future.com у .env
npm run test:e2e      # усі Playwright-тести зелені, включно з axe
npm run coverage:content   # жодна клітинка предмет × ера з 0 фактів; 2025-2026 присутні в усіх 11 предметах
```

```bash
# 2. Прод після підключення домену
curl -sI https://back-future.com/ | grep -i -E '^(HTTP|content-security-policy|x-frame-options)'   # 200, обидва хедери є
curl -sI https://www.back-future.com/ | grep -i -E '^(HTTP|location)'                              # 301/308 на https://back-future.com/
curl -s https://back-future.com/google4081be111962d1d3.html                                        # google-site-verification: google4081be111962d1d3.html
curl -s https://back-future.com/robots.txt                                                         # Sitemap: https://back-future.com/sitemap-index.xml, Allow для GPTBot/ClaudeBot
curl -s https://back-future.com/sitemap-index.xml | grep -c back-future.example.com                # 0
curl -s https://back-future.com/llms.txt | head -5                                                  # опис сайту
curl -sI https://back-future.com/share/2005/square.png | grep -i content-type                       # image/png
curl -sI https://back-future.com/support | grep HTTP                                                # 200
```

- **3.** Lighthouse на проді (`npx lighthouse https://back-future.com --preset=desktop` і мобільний): Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO = 100 на `/`, `/2005`, `/fact/<будь-який>`, `/about`.
- **4.** Google Rich Results Test на `/about` (FAQPage валідний) і `/` (WebSite + SearchAction без помилок).
- **5.** Search Console: обидва property підтверджені, sitemap прийнятий, через 48 годин у «Сторінки» немає помилок типу «Дублікат без канонічного» і «Заблоковано robots».
- **6.** Живий клік у браузері на `https://back-future.com`: ввести рік 2005 → стрічка фактів, фільтр по предмету, відкрити факт, `/timeline`, `/quiz`, `/share/2005` → завантажити обидва PNG (відкриваються, 1080×1920 і 1080×1080), `/support` (без банки показує «скоро» і noindex), пошук Cmd/K знаходить «CRISPR», темна тема перемикається, 375px без горизонтального скролу. Скріншоти прикласти до фінального звіту.
- **7.** PostHog: після заходу на сайт у проєкті зʼявляється `$pageview`; Sentry: тестова помилка з консолі (`Sentry.captureMessage("smoke")`) долітає.
