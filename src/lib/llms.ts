import type { CollectionEntry } from "astro:content";
import { SITE, SUBJECTS } from "../config/site";
import { factUrl } from "./url";
import { factsWord } from "./plurals";

type FactEntry = CollectionEntry<"facts">;

function subjectLabel(id: string): string {
  return SUBJECTS.find((s) => s.id === id)?.label ?? id;
}

/**
 * Усі опубліковані факти одним markdown-документом для LLM-краулерів
 * (`/llms-full.txt`). Порядок: рік події, потім id, щоб вивід був стабільним.
 */
export function buildLlmsFull(facts: readonly FactEntry[], siteUrl: string): string {
  const published = facts
    .filter((f) => !f.data.draft)
    .slice()
    .sort((a, b) => a.data.yearOfEvent - b.data.yearOfEvent || a.id.localeCompare(b.id));

  const header = [
    `# ${SITE.name}`,
    "",
    `> ${SITE.description}`,
    "",
    `Фактів: ${published.length}. Кожен факт має щонайменше одне першоджерело.`,
    "",
  ].join("\n");

  const sections = published.map((fact) => {
    const { title, subject, yearOfEvent, short, sources } = fact.data;
    const url = new URL(factUrl(fact.id), siteUrl).toString();
    const lines = [
      `## ${title}`,
      "",
      `- Предмет: ${subjectLabel(subject)}`,
      `- Рік: ${yearOfEvent}`,
      `- URL: ${url}`,
      "",
      short,
      "",
    ];
    // Заголовки тіла на рівень нижче, щоб не конкурували з `## <назва факту>`.
    const body = fact.body?.trim().replace(/^(#{1,5}) /gm, "#$1 ");
    if (body) lines.push(body, "");
    lines.push("Джерела:", "", ...sources.map((s) => `- [${s.title}](${s.url})`), "");
    return lines.join("\n");
  });

  return [header, ...sections].join("\n");
}

/**
 * Короткий індекс сайту для LLM (`/llms.txt`, формат llmstxt.org): що це за
 * сайт, ключові сторінки, ери й предмети. Будується з конфігу, тож домен і
 * лічильники не застарівають.
 */
export function buildLlmsIndex(
  facts: readonly FactEntry[],
  eras: readonly { slug: string; label: string; yearStart: number; yearEnd: number }[],
  siteUrl: string,
): string {
  const published = facts.filter((f) => !f.data.draft);
  const abs = (path: string) => new URL(path, siteUrl).toString();
  const countBy = (id: string) => published.filter((f) => f.data.subject === id).length;
  const lastYear = SITE.yearMax;

  return [
    `# ${SITE.name}`,
    "",
    `> ${SITE.description}`,
    "",
    `${SITE.name} це український просвітницький довідник: ${published.length} ${factsWord(published.length)} про зміни в науці, історії, технологіях і світі з ${SITE.yearMin} року. Кожен факт має щонайменше одне першоджерело, рік події, предмет шкільної програми і пояснення «було / стало». Контент українською, ліцензія CC BY-SA 4.0: цитуй із посиланням на сторінку факту.`,
    "",
    "## Основне",
    "",
    `- [Головна](${abs("/")}): введи рік випуску й отримай стрічку змін.`,
    `- [Усі факти](${abs("/all/")}): повний каталог з фільтрами.`,
    `- [Хронологія](${abs("/timeline/")}): факти на шкалі часу.`,
    `- [Порівняти роки](${abs("/compare/")}): що змінилось між двома роками випуску.`,
    `- [Методологія](${abs("/metodologia/")}): як відбираємо факти й перевіряємо джерела.`,
    `- [Про проєкт](${abs("/about/")}): опис і часті питання.`,
    "",
    "## Ери шкільних програм",
    "",
    ...eras.map((e) => {
      const end = e.yearEnd > lastYear ? "сьогодні" : String(e.yearEnd);
      return `- [${e.label}](${abs(`/era/${e.slug}/`)}): що пропустили випускники ${e.yearStart}–${end}.`;
    }),
    "",
    "## Предмети",
    "",
    ...SUBJECTS.map(
      (s) =>
        `- [${s.label}](${abs(`/subject/${s.id}/`)}): ${countBy(s.id)} ${factsWord(countBy(s.id))}.`,
    ),
    "",
    "## Для машин",
    "",
    `- [Усі факти одним файлом](${abs("/llms-full.txt")}): назва, предмет, рік, опис, повний текст і джерела кожного факту.`,
    `- [RSS](${abs("/rss.xml")})`,
    `- [Sitemap](${abs("/sitemap-index.xml")})`,
    "",
  ].join("\n");
}
