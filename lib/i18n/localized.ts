import type { Locale } from "./config";

/**
 * Pick the best translation for the given locale.
 *
 * Priority: exact locale match in i18n JSON → Arabic column → English column.
 * The optional `i18n` parameter is a JSON object keyed by locale code,
 * e.g. `{ fr: "Bonjour", de: "Hallo" }`.
 */
export function localize(
  en: string,
  ar: string | null | undefined,
  locale: Locale,
  i18n?: Record<string, string> | null,
): string {
  if (locale === "en") return en;
  if (locale === "ar" && ar) return ar;
  if (i18n && i18n[locale]) return i18n[locale];
  return en;
}
