import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { isLocale, isRtl, type Locale } from "@/lib/i18n/config";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://bedouintrails.com";

  const alternates: Record<string, string> = {};
  for (const loc of routing.locales) {
    alternates[loc] = `${baseUrl}/${loc}`;
  }

  return {
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: alternates,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const messages = await getMessages();
  const dir = isRtl(locale as Locale) ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
