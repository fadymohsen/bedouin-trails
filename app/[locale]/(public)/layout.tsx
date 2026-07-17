import { DM_Sans, Courier_Prime, Cairo } from "next/font/google";
import { getLocale } from "next-intl/server";
import { isRtl, type Locale } from "@/lib/i18n/config";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer/footer";
import "./public-theme.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
});

const courierPrime = Courier_Prime({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-courier-prime",
});

// Tanker/DM Sans/Courier Prime have no Arabic glyphs, so RTL locales swap all
// three roles over to Cairo (see the --font-tanker/--font-dm-sans/--font-courier-prime
// overrides below) instead of silently falling back to whatever system font the browser picks.
const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cairo",
});

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const locale = (await getLocale()) as Locale;
  const rtl = isRtl(locale);

  const fontVars: React.CSSProperties = rtl
    ? {
        ["--font-tanker" as string]: "var(--font-cairo)",
        ["--font-dm-sans" as string]: "var(--font-cairo)",
        ["--font-courier-prime" as string]: "var(--font-cairo)",
      }
    : { ["--font-tanker" as string]: "Tanker" };

  return (
    <>
      {/* Tanker (headings) — Fontshare, itf_ffl free/commercial license */}
      <link
        rel="stylesheet"
        href="https://api.fontshare.com/v2/css?f[]=tanker@400&display=swap"
      />
      <div
        className={`site-public ${dmSans.variable} ${courierPrime.variable} ${cairo.variable}`}
        style={fontVars}
      >
        <Navbar />
        <div className="page-content">{children}</div>
        <Footer />
      </div>
    </>
  );
}
