import { Link } from "@/lib/i18n/navigation";
import { localize } from "@/lib/i18n/localized";
import type { Locale } from "@/lib/i18n/config";
import Breadcrumbs from "@/components/breadcrumbs/breadcrumbs";
import styles from "./blogs.module.scss";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://bedouintrails.com";

type BlogListItem = { id: number; slug: string; titleEn: string; titleAr: string };
type BlogFaqItem = { id: number; questionEn: string; questionAr: string; answerEn: string; answerAr: string };
type BlogDetail = {
  slug: string;
  titleEn: string;
  titleAr: string;
  contentEn: string;
  contentAr: string;
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
  const currentTitle = localize(current.titleEn, current.titleAr, locale);
  const currentContent = localize(current.contentEn, current.contentAr, locale);
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
              <span className={styles.title}>{localize(blog.titleEn, blog.titleAr, locale)}</span>
              <span className={styles.arrow} />
            </Link>
          ))}
        </nav>
      </aside>

      <main className={styles["content-section"]}>
        <article>
          <div className={styles["image-container"]}>
            {current.image && <img src={current.image} alt={currentTitle} className={styles["header-image"]} />}
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
                  <h3 style={{ margin: "0 0 8px" }}>{localize(faq.questionEn, faq.questionAr, locale)}</h3>
                  <p>{localize(faq.answerEn, faq.answerAr, locale)}</p>
                </div>
              ))}
            </div>
          )}
        </article>
      </main>
    </div>
  );
}
