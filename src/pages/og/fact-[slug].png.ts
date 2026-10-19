import type { APIContext, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import { factSlug } from "../../lib/url";
import { buildFactOgSvg, svgToPng } from "../../lib/og";

export const getStaticPaths: GetStaticPaths = async () => {
  const facts = await getCollection("facts", ({ data }) => !data.draft);
  return facts.map((fact) => ({ params: { slug: factSlug(fact.id) }, props: { fact } }));
};

export async function GET({ props }: APIContext) {
  const png = await svgToPng(buildFactOgSvg(props.fact));
  return new Response(new Blob([png], { type: "image/png" }), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
