import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { listPublishedBlogs, getFirstPublishedBlog } from "@/lib/services/blogs";
import type { Locale } from "@/lib/i18n/config";
import BlogLayout from "@/components/blogs/blog-layout";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://bedouintrails.com";

export const metadata: Metadata = {
  title: "Blogs | Bedouin Trails",
  alternates: { canonical: `${SITE_URL}/blogs` },
};

export default async function BlogsIndexPage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations();
  const blogs = await listPublishedBlogs();

  if (blogs.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <p>{t("no_results_found")}</p>
      </div>
    );
  }

  const first = await getFirstPublishedBlog();

  return <BlogLayout blogs={blogs} current={first} locale={locale} t={t} />;
}
