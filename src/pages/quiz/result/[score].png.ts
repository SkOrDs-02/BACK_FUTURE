import type { APIContext, GetStaticPaths } from "astro";
import { svgToPng } from "../../../lib/og";
import { QUIZ_TOTAL, buildQuizResultSvg } from "../../../lib/quizShare";
import { SHARE_SQUARE_SIZE } from "../../../lib/share";

export const getStaticPaths: GetStaticPaths = () =>
  Array.from({ length: QUIZ_TOTAL + 1 }, (_, score) => ({ params: { score: String(score) } }));

export async function GET({ params }: APIContext) {
  const svg = buildQuizResultSvg(Number(params.score));
  const png = await svgToPng(svg, { width: SHARE_SQUARE_SIZE, defaultFontFamily: "DejaVu Sans" });

  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
