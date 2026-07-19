export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { locales, defaultLocale } from "@/lib/i18n/config";

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.bedouintrails.com"
).replace(/\/+$/, "");

const STATIC_PATHS = [
  "/",
  "/about",
  "/journeys",
  "/blogs",
  "/faq",
  "/contact",
  "/desert-yoga-retreat",
  "/djara-cave",
  "/camel-trek",
  "/white-desert-tour-from-cairo",
  "/black-desert-egypt",
  "/western-desert-egypt-guide",
  "/how-to-get-to-white-desert",
  "/what-to-pack-white-desert",
  "/best-time-to-visit-white-desert",
  "/white-desert-tour-cost",
  "/white-desert-vs-wadi-rum",
  "/stargazing-western-desert",
  "/crystal-mountain-egypt",
  "/desert-safety-guide",
];

interface SitemapEntry {
  path: string;
  lastModified: Date;
}

function buildEntry(locale: string, entry: SitemapEntry): string {
  const isHome = entry.path === "/";
  const url = `${SITE_URL}/${locale}${isHome ? "" : entry.path}`;
  const priority = isHome ? "1.0" : "0.9";
  const lastmod = entry.lastModified.toISOString();

  const alternates = locales
    .map(
      (l) =>
        `      <xhtml:link rel="alternate" hreflang="${l}" href="${SITE_URL}/${l}${isHome ? "" : entry.path}" />`
    )
    .join("\n");

  const xDefault = `      <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/${defaultLocale}${isHome ? "" : entry.path}" />`;

  return `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>${priority}</priority>
${alternates}
${xDefault}
  </url>`;
}

export async function GET() {
  const [traps, blogs] = await Promise.all([
    prisma.trap.findMany({
      where: { status: "active" },
      select: { slug: true, updatedAt: true },
    }),
    prisma.blog.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    }),
  ]);

  const now = new Date();

  const staticEntries: SitemapEntry[] = STATIC_PATHS.map((path) => ({
    path,
    lastModified: now,
  }));

  const tripEntries: SitemapEntry[] = traps.map((trap) => ({
    path: `/journeys/${trap.slug}`,
    lastModified: trap.updatedAt,
  }));

  const blogEntries: SitemapEntry[] = blogs.map((blog) => ({
    path: `/blogs/${blog.slug}`,
    lastModified: blog.updatedAt,
  }));

  const allEntries = [...staticEntries, ...tripEntries, ...blogEntries];

  const urls = allEntries
    .flatMap((entry) => locales.map((locale) => buildEntry(locale, entry)))
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
