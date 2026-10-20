import { describe, expect, it } from "vitest";
import {
  QUIZ_TOTAL,
  buildQuizResultSvg,
  quizResultPath,
  quizResultPngPath,
  quizShareText,
  quizVerdict,
} from "./quizShare";

describe("quizVerdict", () => {
  it("gives a different caption for low, middle and high scores", () => {
    const low = quizVerdict(0);
    const mid = quizVerdict(3);
    const high = quizVerdict(5);
    expect(new Set([low.title, mid.title, high.title]).size).toBe(3);
    expect(quizVerdict(1)).toBe(low);
    expect(quizVerdict(2)).toBe(mid);
    expect(quizVerdict(4)).toBe(high);
  });

  it("treats an empty round as a low score", () => {
    expect(quizVerdict(0, 0)).toBe(quizVerdict(0));
  });

  it("never uses an em dash", () => {
    for (let s = 0; s <= QUIZ_TOTAL; s++) {
      const v = quizVerdict(s);
      expect(`${v.title}${v.sub}${quizShareText(s)}`).not.toContain("—");
    }
  });
});

describe("quiz share helpers", () => {
  it("builds the share text and paths", () => {
    expect(quizShareText(3)).toBe(`Я вгадав 3 з ${QUIZ_TOTAL} років відкриттів. А ти?`);
    expect(quizResultPath(3)).toBe("/quiz/result/3/");
    expect(quizResultPngPath(3)).toBe("/quiz/result/3.png");
  });

  it("renders a square SVG with the score and the verdict", () => {
    const svg = buildQuizResultSvg(4);
    expect(svg).toContain('width="1080" height="1080"');
    expect(svg).toContain(`>4/${QUIZ_TOTAL}<`);
    expect(svg).toContain(quizVerdict(4).title);
  });
});
