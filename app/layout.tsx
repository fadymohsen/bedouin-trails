import type { Metadata } from "next";
import { headers } from "next/headers";
import "@fontsource/el-messiri";
import "@fontsource/el-messiri/400.css";
import "@fontsource/el-messiri/500.css";
import "@fontsource/el-messiri/600.css";
import "@fontsource/el-messiri/700.css";
import "./globals.css";
import { isRtl, type Locale } from "@/lib/i18n/config";

export const metadata: Metadata = {
  metadataBase: new URL(
    (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.bedouintrails.com").replace(/\/+$/, "")
  ),
  title: {
    default: "Bedouin Trails | Egyptian Western Desert Safari Tours",
    template: "%s | Bedouin Trails",
  },
  description:
    "Desert safari and tour experiences in Egypt's Western Desert and White Desert National Park.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    siteName: "Bedouin Trails",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Bedouin Trails — Desert Safari Tours in Egypt",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.jpg"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerList = await headers();
  const locale = (headerList.get("x-next-intl-locale") ?? "ar") as Locale;
  const dir = isRtl(locale) ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir}>
      <body>{children}</body>
    </html>
  );
}
