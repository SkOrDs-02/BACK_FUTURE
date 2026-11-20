import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import { SITE } from "../config/site";
import { ERAS } from "../lib/eras";
import { buildLlmsIndex } from "../lib/llms";

export async function GET(context: APIContext) {
  const facts = await getCollection("facts");
  const site = (context.site ?? new URL(SITE.defaultUrl)).toString();
  return new Response(buildLlmsIndex(facts, ERAS, site), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
