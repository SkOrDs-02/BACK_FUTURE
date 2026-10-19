/**
 * Детектор AI-слопу в українському тексті: довге тире і шаблонні конструкції
 * зі списку docs/content-guidelines.md. Використовується в
 * scripts/validate-content.ts; повертає назви знайдених правил.
 */

// ponytail: евристика за закінченнями; великі літери в 2-му і 3-му слові
// відсікають переліки власних назв («Києві, Львові, Одесі»).
const MASC = String.raw`\p{L}{2,}(?:ий|ій)`;
const PLURAL = String.raw`\p{L}{2,}(?:ні|ві|кі|ті)`;
const lower = (adj: string) => String.raw`(?=\p{Ll})${adj}`;
const SEP = String.raw`(?:,\s+|,?\s+(?:і|й|та)\s+)`;
const triple = (adj: string) => new RegExp(`${adj},\\s+${lower(adj)}${SEP}${lower(adj)}`, "u");

export const SLOP_RULES: ReadonlyArray<{ id: string; re: RegExp }> = [
  { id: "довге тире «—»", re: /—/u },
  { id: "«не просто X, а Y»", re: /не\s+просто\s[^.!?]{0,80}?,\s*а\s/iu },
  { id: "«це не про X, це про Y»", re: /це\s+не\s+про\s[^.!?]{0,80}?,\s*(?:це|а)\s+про\s/iu },
  {
    id: "риторичне питання з самовідповіддю",
    re: /\?\s+(?:Так|Ні|Звісно|Авжеж|Звичайно|Відповідь проста)[.!,:]/u,
  },
  { id: "потрійні прикметники", re: triple(MASC) },
  { id: "потрійні прикметники", re: triple(PLURAL) },
  { id: "«варто зазначити»", re: /варто\s+(?:зазначити|відзначити|наголосити)/iu },
  { id: "«у сучасному світі»", re: /(?:^|\s)[ув]\s+сучасному\s+світі/iu },
  { id: "канцелярит «здійснюється/забезпечується»", re: /(?:здійсню|забезпечу)[єю]ть?ся/iu },
];

export function findSlop(text: string): string[] {
  return [...new Set(SLOP_RULES.filter((rule) => rule.re.test(text)).map((rule) => rule.id))];
}
