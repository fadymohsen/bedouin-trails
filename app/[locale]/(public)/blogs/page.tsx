import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { listPublishedBlogs } from "@/lib/services/blogs";
import type { Locale } from "@/lib/i18n/config";
import { localize } from "@/lib/i18n/localized";
import { getLocalFallbackImage } from "@/lib/image-fallback";
import { Link } from "@/lib/i18n/navigation";
import SafeImage from "@/components/safe-image/safe-image";
import Breadcrumbs from "@/components/breadcrumbs/breadcrumbs";
import PageHero from "@/components/page-hero/page-hero";
import styles from "@/components/blogs/blogs.module.scss";

import { SITE_URL, buildAlternates } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  const title = t("meta_title_blogs");
  const description = t("meta_desc_blogs");
  const url = `${SITE_URL}/blogs`;
  return {
    title,
    description,
    alternates: buildAlternates("/blogs"),
    openGraph: { title, description, url, images: [`${SITE_URL}/og-image.jpg`] },
    twitter: { card: "summary_large_image", title, description, images: [`${SITE_URL}/og-image.jpg`] },
  };
}

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

  return (
    <div style={{ background: "var(--surface-1)" }}>
      <Breadcrumbs
        items={[
          { name: "Home", url: `${SITE_URL}/` },
          { name: "Blogs", url: `${SITE_URL}/blogs` },
        ]}
      />

      <PageHero
        title={t("blogs_hero_title") || t("blogs")}
        image="/img/western-desert-hero.webp"
        eyebrow={t("blogs")}
      />

      <div className={styles["blogs-grid-container"]}>
        <div className={styles["blogs-grid"]}>
          {blogs.map((blog, i) => {
            const title = localize(blog.titleEn, blog.titleAr, locale, blog.titleI18n as Record<string, string> | null);
            const excerpt =
              localize(blog.excerptEn ?? "", blog.excerptAr, locale, blog.excerptI18n as Record<string, string> | null) ||
              localize(blog.contentEn ?? "", blog.contentAr, locale, blog.contentI18n as Record<string, string> | null);
            const cleanExcerpt = excerpt.replace(/<[^>]*>/g, "").slice(0, 140) + "...";

            return (
              <Link href={`/blogs/${blog.slug}`} key={blog.id} className={styles["blog-card"]}>
                <div className={styles["card-image-wrapper"]}>
                  <SafeImage
                    src={blog.image ? getLocalFallbackImage(blog.image) : `/img/adventure${i % 3 === 0 ? "" : i % 3 === 1 ? "1" : "3"}.webp`}
                    alt={title}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className={styles["card-content"]}>
                  <span className={styles.eyebrow}>{t("blogs")}</span>
                  <h3>{title}</h3>
                  <p>{cleanExcerpt}</p>
                  <span className={styles["read-more-link"]}>
                    {t("read_story") || "Read Story"} →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
