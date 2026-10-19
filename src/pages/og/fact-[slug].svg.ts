import type { APIContext, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import { factSlug } from "../../lib/url";
import { buildFactOgSvg } from "../../lib/og";

export const getStaticPaths: GetStaticPaths = async () => {
  const facts = await getCollection("facts", ({ data }) => !data.draft);
  return facts.map((fact) => ({ params: { slug: factSlug(fact.id) }, props: { fact } }));
};

export function GET({ props }: APIContext) {
  const svg = buildFactOgSvg(props.fact);
  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
