import { SITE } from "../config/site";

/**
 * Чи налаштована банка monobank.
 */
export function hasSupportJar(jarUrl: string = SITE.monobankJarUrl): boolean {
  return jarUrl.trim().length > 0;
}

/** Чи є хоч один спосіб підтримати (банка або «пригости кавою»). */
export function hasSupport(
  jarUrl: string = SITE.monobankJarUrl,
  coffeeUrl: string = SITE.buyMeACoffeeUrl,
): boolean {
  return jarUrl.trim().length > 0 || coffeeUrl.trim().length > 0;
}

export const SUPPORT_PATH = "/support/";
