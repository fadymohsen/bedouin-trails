import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";
import { localize } from "@/lib/i18n/localized";
import type { Locale } from "@/lib/i18n/config";
import Breadcrumbs from "@/components/breadcrumbs/breadcrumbs";
import styles from "./blogs.module.scss";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://bedouintrails.com";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type I18nJson = Record<string, string> | any;
type BlogListItem = { id: number; slug: string; titleEn: string; titleAr: string; titleI18n?: I18nJson };
type BlogFaqItem = {
  id: number;
  questionEn: string;
  questionAr: string;
  questionI18n?: I18nJson;
  answerEn: string;
  answerAr: string;
  answerI18n?: I18nJson;
};
type BlogDetail = {
  slug: string;
  titleEn: string;
  titleAr: string;
  titleI18n?: I18nJson;
  contentEn: string;
  contentAr: string;
  contentI18n?: I18nJson;
  image: string | null;
  faqs?: BlogFaqItem[];
};

export default function BlogLayout({
  blogs,
  current,
  locale,
  t,
}: {
  blogs: BlogListItem[];
  current: BlogDetail;
  locale: Locale;
  t: (key: string) => string;
}) {
  const currentTitle = localize(current.titleEn, current.titleAr, locale, current.titleI18n);
  const currentContent = localize(current.contentEn, current.contentAr, locale, current.contentI18n);
  const currentUrl = `${SITE_URL}/blogs/${current.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: currentTitle,
    description: currentTitle,
    image: current.image ?? `${SITE_URL}/og-image.jpg`,
    url: currentUrl,
    publisher: {
      "@type": "Organization",
      name: "Bedouin Trails",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/img/logo.png` },
    },
    mainEntityOfPage: currentUrl,
  };

  return (
    <div className={styles["blogs-page"]}>
      <Breadcrumbs
        items={[
          { name: "Home", url: `${SITE_URL}/` },
          { name: "Blogs", url: `${SITE_URL}/blogs` },
          { name: currentTitle, url: currentUrl },
        ]}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <aside className={styles.sidebar}>
        <h2>{t("latest_articles")}</h2>
        <nav className={styles["article-links"]}>
          {blogs.map((blog) => (
            <Link
              key={blog.id}
              href={`/blogs/${blog.slug}`}
              className={`${styles["link-item"]} ${current.slug === blog.slug ? styles.active : ""}`}
            >
              <span className={styles.bullet} />
              <span className={styles.title}>{localize(blog.titleEn, blog.titleAr, locale, blog.titleI18n)}</span>
              <span className={styles.arrow} />
            </Link>
          ))}
        </nav>
      </aside>

      <main className={styles["content-section"]}>
        <article>
          <div className={styles["image-container"]}>
            {current.image && <Image src={current.image} alt={currentTitle} className={styles["header-image"]} width={1200} height={420} style={{ objectFit: "cover" }} />}
          </div>
          <div className={styles["article-text"]}>
            <h1>{currentTitle}</h1>
            <div className={styles.description} dangerouslySetInnerHTML={{ __html: currentContent }} />
          </div>

          {current.faqs && current.faqs.length > 0 && (
            <div className={styles["article-text"]}>
              <h2>{t("faq")}</h2>
              {current.faqs.map((faq) => (
                <div key={faq.id} style={{ marginBottom: 20 }}>
                  <h3 style={{ margin: "0 0 8px" }}>{localize(faq.questionEn, faq.questionAr, locale, faq.questionI18n)}</h3>
                  <p>{localize(faq.answerEn, faq.answerAr, locale, faq.answerI18n)}</p>
                </div>
              ))}
            </div>
          )}
        </article>
      </main>
    </div>
  );
}
