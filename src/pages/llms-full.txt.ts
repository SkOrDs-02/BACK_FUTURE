import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import { SITE } from "../config/site";
import { buildLlmsFull } from "../lib/llms";

export async function GET(context: APIContext) {
  const facts = await getCollection("facts");
  const site = (context.site ?? new URL(SITE.defaultUrl)).toString();
  return new Response(buildLlmsFull(facts, site), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
