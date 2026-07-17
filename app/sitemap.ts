import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { locales, defaultLocale } from "@/lib/i18n/config";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://bedouintrails.com";

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

function buildAlternates(path: string) {
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    languages[locale] = `${SITE_URL}/${locale}${path === "/" ? "" : path}`;
  }
  languages["x-default"] = `${SITE_URL}/${defaultLocale}${path === "/" ? "" : path}`;
  return { languages };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [traps, blogs] = await Promise.all([
    prisma.trap.findMany({ where: { status: "active" }, select: { slug: true, updatedAt: true } }),
    prisma.blog.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.flatMap((path) =>
    locales.map((locale) => ({
      url: `${SITE_URL}/${locale}${path === "/" ? "" : path}`,
      lastModified: new Date(),
      alternates: buildAlternates(path),
    }))
  );

  const tripEntries: MetadataRoute.Sitemap = traps.flatMap((trap) =>
    locales.map((locale) => ({
      url: `${SITE_URL}/${locale}/journeys/${trap.slug}`,
      lastModified: trap.updatedAt,
      alternates: buildAlternates(`/journeys/${trap.slug}`),
    }))
  );

  const blogEntries: MetadataRoute.Sitemap = blogs.flatMap((blog) =>
    locales.map((locale) => ({
      url: `${SITE_URL}/${locale}/blogs/${blog.slug}`,
      lastModified: blog.updatedAt,
      alternates: buildAlternates(`/blogs/${blog.slug}`),
    }))
  );

  return [...staticEntries, ...tripEntries, ...blogEntries];
}
