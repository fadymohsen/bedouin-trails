import { Link } from "@/lib/i18n/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Breadcrumbs from "@/components/breadcrumbs/breadcrumbs";
import styles from "@/components/guides/guides.module.scss";

import { SITE_URL, buildAlternates } from "@/lib/seo";
const PATH = "/multi-day-desert-trek";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  const url = `${SITE_URL}${PATH}`;
  return {
    title: t("guide_trek_title"),
    description: t("guide_trek_meta_desc"),
    keywords: t("guide_trek_meta_keywords"),
    alternates: buildAlternates(PATH),
    openGraph: {
      title: t("guide_trek_og_title"),
      description: t("guide_trek_og_desc"),
      url,
      images: [`${SITE_URL}/og-image.jpg`],
    },
    twitter: {
      card: "summary_large_image",
      title: t("guide_trek_twitter_title"),
      description: t("guide_trek_twitter_desc"),
      images: [`${SITE_URL}/og-image.jpg`],
    },
  };
}

export default async function MultiDayDesertTrekPage() {
  const t = await getTranslations();
  const url = `${SITE_URL}${PATH}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Multi-Day Desert Trek Egypt — Sahara Hiking & Trekking Guide",
    description: "Plan your multi-day desert trek in Egypt. From 2-day White Desert hikes to week-long Sahara expeditions with camel support, explore desert trekking options with Bedouin Trails.",
    url,
    image: `${SITE_URL}/og-image.jpg`,
    publisher: { "@type": "Organization", name: "Bedouin Trails", logo: { "@type": "ImageObject", url: `${SITE_URL}/img/logo.png` } },
    mainEntityOfPage: url,
  };

  return (
    <div className={styles["guide-page"]}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumbs
        items={[
          { name: t("breadcrumb_home"), url: `${SITE_URL}/` },
          { name: t("guide_trek_breadcrumb"), url },
        ]}
      />

      <div className={styles["guide-hero"]} style={{ backgroundImage: "url('/img/bg.webp')" }}>
        <h1>{t("guide_trek_h1")}</h1>
      </div>

      <div className={styles["guide-content"]}>
        <p>{t("guide_trek_intro_p")}</p>

        <h2>{t("guide_trek_routes_h2")}</h2>

        <h3>{t("guide_trek_route1_h3")}</h3>
        <p>{t("guide_trek_route1_p")}</p>

        <h3>{t("guide_trek_route2_h3")}</h3>
        <p>{t("guide_trek_route2_p")}</p>

        <h3>{t("guide_trek_route3_h3")}</h3>
        <p>{t("guide_trek_route3_p")}</p>

        <h3>{t("guide_trek_route4_h3")}</h3>
        <p>{t("guide_trek_route4_p")}</p>

        <h2>{t("guide_trek_prepare_h2")}</h2>
        <ul>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <li key={i}>{t(`guide_trek_prepare_li${i}`)}</li>
          ))}
        </ul>

        <h2>{t("guide_trek_fitness_h2")}</h2>
        <p>{t("guide_trek_fitness_p")}</p>

        <h2>{t("guide_trek_besttime_h2")}</h2>
        <p>{t("guide_trek_besttime_p")}</p>

        <div className={styles["faq-section"]}>
          <h2>{t("guide_trek_faq_h2")}</h2>
          {[1, 2, 3, 4].map((i) => (
            <div className={styles["faq-item"]} key={i}>
              <h3>{t(`guide_trek_faq${i}_q`)}</h3>
              <p>{t(`guide_trek_faq${i}_a`)}</p>
            </div>
          ))}
        </div>

        <div className={styles["cta-section"]}>
          <p>{t("guide_trek_cta")}</p>
          <Link href="/journeys" className={styles["cta-button"]}>
            {t("guide_trek_cta_button")}
          </Link>
        </div>
      </div>
    </div>
  );
}
