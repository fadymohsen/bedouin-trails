import { getRequestConfig } from "next-intl/server";
import { IntlErrorCode } from "next-intl";
import { routing } from "./routing";
import { isLocale, type Locale } from "@/lib/i18n/config";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !isLocale(locale)) {
    locale = routing.defaultLocale;
  }

  const messages = (await import(`../messages/${locale}.json`)).default;

  return {
    locale: locale as Locale,
    messages,
    timeZone: "Africa/Cairo",
    onError(error) {
      if (error.code !== IntlErrorCode.MISSING_MESSAGE) {
        console.error(error);
      }
    },
    getMessageFallback({ key }) {
      return key;
    },
  };
});
