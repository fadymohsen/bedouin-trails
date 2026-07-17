export const locales = ["ar", "en", "pt", "zh", "es", "nl", "it", "de", "fr"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ar";

export const rtlLocales: Locale[] = ["ar"];

export function isRtl(locale: Locale): boolean {
  return rtlLocales.includes(locale);
}

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
