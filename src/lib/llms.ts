import type { CollectionEntry } from "astro:content";
import { SITE, SUBJECTS } from "../config/site";
import { factUrl } from "./url";

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
