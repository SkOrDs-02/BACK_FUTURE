import { SITE } from "../config/site";

/**
 * Посилання на /support/ показуємо лише тоді, коли є куди донатити.
 * Без банки сторінка існує, але віддає «скоро» і noindex.
 */
export function hasSupportJar(jarUrl: string = SITE.monobankJarUrl): boolean {
  return jarUrl.trim().length > 0;
}

export const SUPPORT_PATH = "/support/";
