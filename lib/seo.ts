import { locales } from "@/lib/i18n/config";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.bedouintrails.com"
).replace(/\/+$/, "");

export function buildAlternates(path: string) {
  const languages: Record<string, string> = {};
  for (const loc of locales) {
    languages[loc] = `${SITE_URL}/${loc}${path === "/" ? "" : path}`;
  }
  return {
    canonical: path === "/" ? SITE_URL : `${SITE_URL}${path}`,
    languages,
  };
}
