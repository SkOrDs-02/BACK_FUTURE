import type { APIContext } from "astro";
import { SITE } from "../config/site";

// Просвітницький сайт: трафік з AI-відповідей бажаний, тому AI-краулерам
// дозволяємо все явно, а не лише через загальне правило `*`.
export const AI_CRAWLERS = [
  // OpenAI: навчання, пошук ChatGPT і переходи за посиланням користувача.
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  // Anthropic.
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "Claude-Web",
  // Perplexity.
  "PerplexityBot",
  "Perplexity-User",
  // Gemini / AI Overviews і Apple Intelligence.
  "Google-Extended",
  "Applebot-Extended",
] as const;

export function GET(context: APIContext) {
  const site = context.site ?? new URL(SITE.defaultUrl);
  const sitemapUrl = new URL("/sitemap-index.xml", site).toString();
  const groups = ["*", ...AI_CRAWLERS].map((agent) => `User-agent: ${agent}\nAllow: /\n`);

  return new Response(`${groups.join("\n")}\nSitemap: ${sitemapUrl}\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
