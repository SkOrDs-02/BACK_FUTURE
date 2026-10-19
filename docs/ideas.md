# Ідеї та покращення

> Список можливих покращень для BACK_FUTURE. Це **сирі ідеї** — частина з них ще не пройшла через спільне обговорення. Робочий план PR-ів — у [`roadmap.md`](./roadmap.md).
> 24 пункти, погоджені з власником, — у `project-memory.md`, секція 6.
> Останнє оновлення: жовтень 2026 (після перезапуску, PR #161-#180). Ідеї, які вже зроблено, перенесено в розділ «Зроблено» внизу — щоб новий контриб'ютор бачив, що залишилось, але міг звіритися з історією.

---

## Що ще можна зробити

### Контент: збагатити модель факту

- **`authors`** — frontmatter список авторів (для `/contributors`).
- **Міграція `image` на `astro:assets`** — поки `image` поле опційне; коли заповниться — оптимізувати pipeline (5.3 у roadmap).

### UX і навігація

- **Збережені факти** (bookmark): невелика сторінка `/saved` (4.4 у roadmap). PR #149 закрито без мержу, ідея без дедлайну.

### SEO і шеринг

<!-- Лишилось: усе наявне зроблено. Нові ідеї додавати тут. -->

### PWA

- **Service-worker** для офлайн-перегляду (5.1 у roadmap). PR #144 закрито без мержу, ідея без дедлайну. PNG-іконки manifest уже є.

### Залучення / community

- **GitHub Action**: issue зі шаблону `new-fact.yml` → draft PR з готовим `.md`-фактом (7.1 у roadmap). PR #145 закрито без мержу.
- **`/contributors`**: список авторів фактів (потребує `authors` поля у frontmatter; 7.2 у roadmap). PR #150 закрито без мержу.
- **Email-дайджест** — раз на місяць нові факти, Buttondown або self-hosted (7.4 у roadmap).

### Бренд і дизайн-система

- **Theme Laboratory як справжній перемикач** теми, cookie-стійкий (8.3 у roadmap). Зараз `/themes` redirect → 404 у проді (PR #116) — лишається лабораторією тільки в dev.

### i18n

- **Astro routing**: `/uk/`, `/en/`, структурно, без перекладів спочатку (9.1 у roadmap). PR #146 закрито без мержу.
- **ICU plurals** у форматерах кількості (9.2 у roadmap) — ✅ зроблено: `src/lib/plurals.ts` із `Intl.PluralRules` + helpers (`factsCount` / `updatesCount` / `yearsAgo`), приймає `locale` → готово до 9.1 i18n routing.
- **Англомовний UI** — діаспора + органіка (9.3 у roadmap).

### Інфра / тех-борг

- **Запуск `back-future.com`** (#18 у memory): дії власника: DNS, перепідвʼязка Vercel до `SkOrDs-02`, Search Console, `PUBLIC_SITE_URL`.
- **Sveltia / Decap CMS production auth** (#20 у memory) — конфіг є, налаштування авторизації для прода — pending.
- **Renovate замість/поверх Dependabot** — кращий контроль над групуваннями оновлень (поки Dependabot з груповими правилами достатній).
- **`monobankJarUrl` / `buyMeACoffeeUrl` / `twitter`** у `site.ts`: порожні рядки приховують відповідні UI-блоки; `/support` готова і лишається `noindex`, поки URL порожній.

---

## Зроблено

> Перенесено сюди з основного списку ідей — лишаємо як референс, що було колись «ідеєю», а тепер уже у проді. Деталі — в `project-memory.md` (секція 7) і `roadmap.md` (таблиця «Нещодавно виконано»).

### Контент-схема (зроблено)

- **`before` / `after`** — Done у [#28](https://github.com/Skords-01/BACK_FUTURE/pull/28).
- **`region` (`world` / `ukraine`)** — Done у [#36](https://github.com/Skords-01/BACK_FUTURE/pull/36).
- **`region: country:<iso2>`** — Done у поточному PR (Zod union + `parseRegion` helper у `src/content.config.ts`, `REGIONS`/`getRegionLabel`/`getFlag` у `src/lib/regions.ts`, flag-chip у `FactCard`, `RegionFilter.astro` з multi-country URL (`?region=cz,pl`), валідація unknown country code у `validate-content`, SEO-сторінка `/region/<iso2>/`).
- **`updatedAt`** — Done у [#37](https://github.com/Skords-01/BACK_FUTURE/pull/37).
- **`impact` (low / medium / high)** — Done у [#38](https://github.com/Skords-01/BACK_FUTURE/pull/38).
- **Розширити `SUBJECTS`** (tech, medicine, economy, culture, sport, ecology) — Done у [#51](https://github.com/Skords-01/BACK_FUTURE/pull/51) (схема/CMS/UI; контент додається окремо).
- **CI-перевірка для `sources[].url`** — Done у [#49](https://github.com/Skords-01/BACK_FUTURE/pull/49) + [#51](https://github.com/Skords-01/BACK_FUTURE/pull/51) (warning-only Lychee).

### UX і навігація (зроблено)

- **Глобальний хедер з лічильником «N фактів»** — Done у [#22](https://github.com/Skords-01/BACK_FUTURE/pull/22).
- **Мобільне меню в `Header.astro`** — Done у [#22](https://github.com/Skords-01/BACK_FUTURE/pull/22) + [#83](https://github.com/Skords-01/BACK_FUTURE/pull/83) (повноцінне burger-меню з a11y).
- **Хлібні крихти** — Done у [#22](https://github.com/Skords-01/BACK_FUTURE/pull/22).
- **Sticky-summary з якорями-чіпами на предмети** — Done у [#32](https://github.com/Skords-01/BACK_FUTURE/pull/32).
- **Кастомний 404** — Done у [#29](https://github.com/Skords-01/BACK_FUTURE/pull/29).
- **Темна тема (auto-prefers + перемикач)** — Done у [#33](https://github.com/Skords-01/BACK_FUTURE/pull/33).
- **Кнопка «Сюрприз» / випадковий рік** — Done у [#30](https://github.com/Skords-01/BACK_FUTURE/pull/30) + [#119](https://github.com/Skords-01/BACK_FUTURE/pull/119) («Випадковий рік» у Hero).
- **«Мій рік» (persist last-visited у localStorage)** — Done у [#116](https://github.com/Skords-01/BACK_FUTURE/pull/116) (`src/lib/userState.ts`) + [#119](https://github.com/Skords-01/BACK_FUTURE/pull/119) («Повернутись до N» pill).
- **Анімовані тізери і design-effects** — Done у [#107](https://github.com/Skords-01/BACK_FUTURE/pull/107) (5 ефектів: staggered entrance, magnetic 3D tilt, slot-machine GO, glitch reveal, DensityStrip tooltip; `prefers-reduced-motion`-safe) + [#115](https://github.com/Skords-01/BACK_FUTURE/pull/115).
- **Reading progress bar + back-to-year pill** — Done у [#94](https://github.com/Skords-01/BACK_FUTURE/pull/94)/[#95](https://github.com/Skords-01/BACK_FUTURE/pull/95).
- **BackToTop button + keyboard nav `←`/`→`** — Done у [#119](https://github.com/Skords-01/BACK_FUTURE/pull/119)/[#121](https://github.com/Skords-01/BACK_FUTURE/pull/121).
- **`ScrollRestore` стійкий на iOS Safari + bfcache** — Done у [#126](https://github.com/Skords-01/BACK_FUTURE/pull/126)/[#127](https://github.com/Skords-01/BACK_FUTURE/pull/127)/[#128](https://github.com/Skords-01/BACK_FUTURE/pull/128).

### Нові сторінки (частково)

- **`/subject/[id]` — стрічка по предмету** — Done у [#39](https://github.com/Skords-01/BACK_FUTURE/pull/39).
- **`/era/[slug]` — стрічка по ері** — Done у [#51](https://github.com/Skords-01/BACK_FUTURE/pull/51).
- **`/fact/[slug]` — окрема сторінка факту** — Done у [#51](https://github.com/Skords-01/BACK_FUTURE/pull/51); hero polish у [#129](https://github.com/Skords-01/BACK_FUTURE/pull/129)/[#130](https://github.com/Skords-01/BACK_FUTURE/pull/130).
- **`/timeline` — лінія часу всіх фактів** — Done у [#93](https://github.com/Skords-01/BACK_FUTURE/pull/93)/[#97](https://github.com/Skords-01/BACK_FUTURE/pull/97) (Variant A: вертикальна вісь, era jump-strip, JSON-LD `ItemList`); mobile collapsed cards у [#123](https://github.com/Skords-01/BACK_FUTURE/pull/123).
- **`/quiz` — «вгадай рік відкриття»** — Done у [#109](https://github.com/Skords-01/BACK_FUTURE/pull/109) (5 питань, логіка клієнтська) + [#111](https://github.com/Skords-01/BACK_FUTURE/pull/111) (маска року у question card).
- **`/all` — список усіх фактів** — lazy fade-in у [#116](https://github.com/Skords-01/BACK_FUTURE/pull/116) (`IntersectionObserver`).
- **`/compare?a=…&b=…` — два роки поруч** — Done (6.3 у roadmap): side-by-side колонки з era badge, лічильником фактів, топ-3 high-impact, спільними предметами та epoch снепшотом з nearest fallback; форма-пікер + кнопки `Поміняти місцями`/`Випадкова пара`; friendly error при `a === b`; динамічні OG/canonical.

### SEO і шеринг (зроблено)

- **OG як PNG** — Done у [#43](https://github.com/Skords-01/BACK_FUTURE/pull/43) (через `@resvg/resvg-js`).
- **JSON-LD `Article` + `BreadcrumbList`** — Done у [#31](https://github.com/Skords-01/BACK_FUTURE/pull/31).
- **Шер-кнопки (Telegram, X, copy, native share)** — Done у [#21](https://github.com/Skords-01/BACK_FUTURE/pull/21).
- **JSON-LD `FAQPage` на /about** + **перевірка мета-тегів для `/era/[slug]` і `/fact/[slug]`** — Done у [#137](https://github.com/Skords-01/BACK_FUTURE/pull/137): `src/lib/faq.ts` як SSOT для FAQ, видима `<details>`-секція + інлайн `FAQPage` JSON-LD; `Base.astro` тепер бере `ogType` (`website` / `article`) і додає `link rel="sitemap"`; era/fact сторінки виставляють `og:type=article`; era-сторінки отримали власні `/og/era-<slug>.{png,svg}` ендпоінти + опис у 70–160 символів.

### Пошук і персоналізація (зроблено)

- **Фільтри на сторінці року** (subject / era / region / impact) — Done у [#51](https://github.com/Skords-01/BACK_FUTURE/pull/51).
- **Pagefind — build-time повнотекстовий пошук** — Done у [#109](https://github.com/Skords-01/BACK_FUTURE/pull/109) (`SearchDialog` з lazy-load, native `<dialog>`, Cmd/Ctrl+K) + [#111](https://github.com/Skords-01/BACK_FUTURE/pull/111) (терміни в quotes).
- **Read-tracking відвіданих фактів** — Done у [#116](https://github.com/Skords-01/BACK_FUTURE/pull/116) (IntersectionObserver → `localStorage` через `userState.ts`).

### Тех-борг (зроблено)

- **Юніт-тести для `src/lib/`** — Done у [#27](https://github.com/Skords-01/BACK_FUTURE/pull/27) (Vitest, покриття `src/lib/` ≥ 80%).
- **`docs/proposed-ci/` видалено** — Done у [#26](https://github.com/Skords-01/BACK_FUTURE/pull/26).
- **pre-commit (Husky + lint-staged)** — Done у [#42](https://github.com/Skords-01/BACK_FUTURE/pull/42).
- **Розширене групування Dependabot** — Done у [#41](https://github.com/Skords-01/BACK_FUTURE/pull/41).
- **Аналітика (Plausible / Umami / PostHog через env)** — Done у [#44](https://github.com/Skords-01/BACK_FUTURE/pull/44) (Plausible/Umami) і [#117](https://github.com/Skords-01/BACK_FUTURE/pull/117) (PostHog + Sentry + GSC). PostHog інструментація євентів + фунелів + dashboard-as-code у [#131](https://github.com/Skords-01/BACK_FUTURE/pull/131)/[#132](https://github.com/Skords-01/BACK_FUTURE/pull/132). Sentry v10 config у [#122](https://github.com/Skords-01/BACK_FUTURE/pull/122). Доки у [`analytics.md`](./analytics.md).
- **axe-аудит у CI** — Done: `tests/e2e/a11y.spec.ts` використовує `@axe-core/playwright`; запускається в стандартному e2e-флоу.
- **JetBrains Mono замінив IBM Plex Mono** — Done у [#106](https://github.com/Skords-01/BACK_FUTURE/pull/106) (cyrillic + latin); деактивовані шрифти (Fraunces/Lora/IBM Plex Mono) прибрані у [#133](https://github.com/Skords-01/BACK_FUTURE/pull/133).
- **SVG-іконки предметів** — Done: `src/lib/subjectIcons.ts` + `<SubjectIcon>` компонент (як описано в 8.1 roadmap); `emoji` у `SUBJECTS` лишається для OG.
- **Окремий markdownlint для `content/facts/`** — Done у [#50](https://github.com/Skords-01/BACK_FUTURE/pull/50).

### Перезапуск 2026-10 (зроблено)

- **Квадратний постер і сторіз `/share/[year]`**: Done у [#180](https://github.com/SkOrDs-02/BACK_FUTURE/pull/180).
- **`/support`**: Done у [#178](https://github.com/SkOrDs-02/BACK_FUTURE/pull/178) (noindex, поки URL банки порожній).
- **`llms.txt`, `llms-full.txt`, правила для AI-краулерів, PNG-іконки manifest**: Done у [#179](https://github.com/SkOrDs-02/BACK_FUTURE/pull/179).
- **Порівняння років з різницею, OG-картка кожного факту**: Done у [#175](https://github.com/SkOrDs-02/BACK_FUTURE/pull/175).
- **Антислоп-перевірка у `validate-content`**: Done у [#176](https://github.com/SkOrDs-02/BACK_FUTURE/pull/176).
- **Spec Kit і `AGENTS.md`**: Done у [#174](https://github.com/SkOrDs-02/BACK_FUTURE/pull/174).
- **Факти 2025-2026 (43)**: Done у [#162-#173](https://github.com/SkOrDs-02/BACK_FUTURE/pull/173).

---

## Принципи добору ідей

- **Український акцент** — кожна нова фіча має або підсилювати український контент, або бути нейтральною.
- **Static-first** — ніяких раннтайм-беків без явної потреби.
- **Контент окремо від коду** — нові фічі не зливаються з контентом.
- **Template-readiness** — будь-яка зміна повинна залишатися форкабельною (single-source-of-truth у `site.ts` + `tailwind.config.mjs` + `content/`).
