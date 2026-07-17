import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { listPublishedBlogs, getBlogBySlug } from "@/lib/services/blogs";
import { NotFoundError } from "@/lib/services/errors";
import { localize } from "@/lib/i18n/localized";
import type { Locale } from "@/lib/i18n/config";
import BlogLayout from "@/components/blogs/blog-layout";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://bedouintrails.com";

async function loadBlog(slug: string) {
  try {
    return await getBlogBySlug(slug);
  } catch (err) {
    if (err instanceof NotFoundError) return null;
    throw err;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const blog = await loadBlog(slug);
  if (!blog) return {};

  const locale = (await getLocale()) as Locale;
  const title = localize(blog.titleEn, blog.titleAr, locale, blog.titleI18n as Record<string, string> | null);
  const metaTitle = localize(blog.metaTitleEn ?? "", blog.metaTitleAr, locale, blog.metaTitleI18n as Record<string, string> | null) || title;
  const metaDescription = localize(blog.metaDescriptionEn ?? "", blog.metaDescriptionAr, locale, blog.metaDescriptionI18n as Record<string, string> | null) || title;
  const url = `${SITE_URL}/blogs/${slug}`;

  return {
    title: `${metaTitle} | Bedouin Trails`,
    description: metaDescription,
    alternates: { canonical: url,  },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      images: blog.image ? [blog.image] : [`${SITE_URL}/og-image.jpg`],
      url,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: blog.image ? [blog.image] : [`${SITE_URL}/og-image.jpg`],
    },
  };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [locale, t, blog, blogs] = await Promise.all([
    getLocale() as Promise<Locale>,
    getTranslations(),
    loadBlog(slug),
    listPublishedBlogs(),
  ]);

  if (!blog) notFound();

  return <BlogLayout blogs={blogs} current={blog} locale={locale} t={t} />;
}
