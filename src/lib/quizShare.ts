import { SHARE_SQUARE_SIZE, escapeXml, wrapText } from "./share";

/** Питань у раунді квізу. Від цього числа залежить і набір пререндерених результатів. */
export const QUIZ_TOTAL = 5;

export interface QuizVerdict {
  title: string;
  sub: string;
}

const VERDICTS = {
  low: {
    title: "Роки плутаються в усіх",
    sub: "Відкриття від цього не зникли. Введи свій рік і подивись, що вже сталось.",
  },
  mid: {
    title: "Хронологія майже в кишені",
    sub: "Частину років ти тримаєш у голові. Решта чекає на сайті.",
  },
  high: {
    title: "Ти явно стежив за новинами",
    sub: "Роки відкриттів для тебе не загадка. Перевір друзів.",
  },
} satisfies Record<string, QuizVerdict>;

export function quizVerdict(score: number, total = QUIZ_TOTAL): QuizVerdict {
  const ratio = total > 0 ? score / total : 0;
  if (ratio < 0.4) return VERDICTS.low;
  if (ratio < 0.8) return VERDICTS.mid;
  return VERDICTS.high;
}

export function quizShareText(score: number, total = QUIZ_TOTAL): string {
  return `Я вгадав ${score} з ${total} років відкриттів. А ти?`;
}

export function quizResultPath(score: number): string {
  return `/quiz/result/${score}/`;
}

export function quizResultPngPath(score: number): string {
  return `/quiz/result/${score}.png`;
}

export function buildQuizResultSvg(score: number, total = QUIZ_TOTAL): string {
  const size = SHARE_SQUARE_SIZE;
  const { title, sub } = quizVerdict(score, total);
  const wrappedTitle = wrapText(title, 26, 2);
  const titleTop = wrappedTitle.length === 1 ? 720 : 690;
  const titleLines = wrappedTitle
    .map(
      (line, i) =>
        `<text x="540" y="${titleTop + i * 64}" fill="#16161a" font-family="Manrope, Inter, Arial, sans-serif" font-size="54" font-weight="800" text-anchor="middle">${escapeXml(line)}</text>`,
    )
    .join("");
  const subLines = wrapText(sub, 40, 2)
    .map(
      (line, i) =>
        `<text x="540" y="${840 + i * 46}" fill="#3a3a35" font-family="Inter, Arial, sans-serif" font-size="34" font-weight="500" text-anchor="middle">${escapeXml(line)}</text>`,
    )
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="#f7f7f5"/>
  <rect x="60" y="60" width="${size - 120}" height="${size - 120}" rx="48" fill="#ffffff" stroke="#d6d6d2" stroke-width="3"/>
  <text x="540" y="150" fill="#1e3a8a" font-family="Inter, Arial, sans-serif" font-size="32" font-weight="700" letter-spacing="10" text-anchor="middle">BACK_FUTURE</text>
  <text x="540" y="220" fill="#67675f" font-family="Inter, Arial, sans-serif" font-size="32" font-weight="500" letter-spacing="4" text-anchor="middle">${escapeXml("Квіз «Вгадай рік відкриття»")}</text>
  <text x="540" y="520" fill="#1e3a8a" font-family="Manrope, Inter, Arial, sans-serif" font-size="280" font-weight="800" text-anchor="middle">${score}/${total}</text>
  <path d="M100 590h880" stroke="#d6d6d2" stroke-width="2"/>
  ${titleLines}
  ${subLines}
  <text x="540" y="990" fill="#67675f" font-family="Inter, Arial, sans-serif" font-size="28" font-weight="500" letter-spacing="5" text-anchor="middle">${escapeXml("А ти? back-future.com/quiz")}</text>
</svg>`;
}
