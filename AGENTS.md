# AGENTS.md

Інструкції для AI-агентів (Claude Code, Codex та інших), які працюють у цьому репо. Правила проєкту живуть у конституції [`.specify/memory/constitution.md`](./.specify/memory/constitution.md); цей файл їх коротко нагадує і не замінює.

## Стек

- Astro 6 (static output) + TypeScript strict, Tailwind CSS 4.
- Контент: Markdown з frontmatter у `content/facts/<subject>/*.md`, схема Zod у `src/content.config.ts`.
- Пошук: Pagefind (індекс будується після `astro build`).
- Тести: Vitest (unit), Playwright + axe (e2e).
- Хостинг: Vercel з Git-інтеграцією від `main`.
- Node 22.13+ (`.nvmrc`), npm.

## Команди

```bash
npm ci                     # залежності з lockfile
npm run dev                # http://localhost:4321
npm run ci                 # lint + typecheck + unit + validate:content
npm run build              # astro check + astro build + pagefind
npm run test:e2e           # Playwright (потрібен npx playwright install chromium)
npm run coverage:content   # покриття предмет × ера
```

## Правила

- Мова: українська в UI-копі, доках, спеках, комітах і PR.
- Довге тире (U+2014) заборонене всюди. AI-конструкції («не просто X, а Y», риторичні питання з самовідповіддю, потрійні прикметники, «варто зазначити») теж.
- Факт без першоджерела не додається; тон і чутливі формулювання за [`docs/content-guidelines.md`](./docs/content-guidelines.md).
- Перед PR: `npm run ci` і `npm run build` зелені локально. PR мерджиться лише із зеленим CI.
- Conventional Commits (`feat(seo): ...`, `content(physics): ...`, `chore(deps): ...`).
- PR відкривається як draft за `.github/PULL_REQUEST_TEMPLATE.md`; ready і merge вирішує власник.
- Секрети не комітяться: ключі лише в env Vercel або локальному `.env`.
- Pre-commit хук (Husky + lint-staged) не обходиться.

## Spec Kit

- Конституція: [`.specify/memory/constitution.md`](./.specify/memory/constitution.md).
- Спеки: [`specs/`](./specs/), поточна: [`specs/001-relaunch/spec.md`](./specs/001-relaunch/spec.md) (перезапуск і вихід на back-future.com).
- Шаблони і скрипти: `.specify/templates/`, `.specify/scripts/bash/`.
- Скіли Claude Code: `.claude/skills/speckit-*` (`/speckit-specify`, `/speckit-plan`, `/speckit-tasks`, `/speckit-implement`).

Нова фіча, більша за дрібний фікс, починається зі спеки в `specs/NNN-<тема>/spec.md`.
