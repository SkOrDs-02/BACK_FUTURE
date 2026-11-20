import { SITE } from "../config/site";

export interface ContactLink {
  label: string;
  text: string;
  href: string;
}

interface ContactConfig {
  email: string;
  telegram: string;
}

/** Заповнені контакти з `SITE.contact` у порядку: пошта, Telegram. */
export function contactLinks(contact: ContactConfig = SITE.contact): ContactLink[] {
  const links: ContactLink[] = [];
  const email = contact.email.trim();
  if (email) links.push({ label: "Пошта", text: email, href: `mailto:${email}` });
  const telegram = contact.telegram.trim();
  if (telegram) {
    const handle = telegram.replace(/^https?:\/\/t\.me\//, "").replace(/\/$/, "");
    links.push({ label: "Telegram", text: `@${handle}`, href: `https://t.me/${handle}` });
  }
  return links;
}

/** Контакти одним рядком для простого тексту (FAQ, JSON-LD). */
export function contactSentence(links: readonly ContactLink[] = contactLinks()): string {
  return links
    .map((l) => (l.label === "Пошта" ? `на пошту ${l.text}` : `у Telegram ${l.text}`))
    .join(" або ");
}
