import { Link } from "@/lib/i18n/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Breadcrumbs from "@/components/breadcrumbs/breadcrumbs";
import styles from "@/components/guides/guides.module.scss";

import { SITE_URL, buildAlternates } from "@/lib/seo";
const PATH = "/white-desert-camping";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  const url = `${SITE_URL}${PATH}`;
  return {
    title: t("guide_camping_title"),
    description: t("guide_camping_meta_desc"),
    keywords: t("guide_camping_meta_keywords"),
    alternates: buildAlternates(PATH),
    openGraph: {
      title: t("guide_camping_og_title"),
      description: t("guide_camping_og_desc"),
      url,
      images: [`${SITE_URL}/og-image.jpg`],
    },
    twitter: {
      card: "summary_large_image",
      title: t("guide_camping_twitter_title"),
      description: t("guide_camping_twitter_desc"),
      images: [`${SITE_URL}/og-image.jpg`],
    },
  };
}

export default async function WhiteDesertCampingPage() {
  const t = await getTranslations();
  const url = `${SITE_URL}${PATH}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "White Desert Camping — Overnight Desert Experience in Egypt",
    description: "Everything you need to know about camping in Egypt's White Desert — from what to expect, what's provided, best season, and how to book your overnight desert camping adventure.",
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
          { name: t("guide_camping_breadcrumb"), url },
        ]}
      />

      <div className={styles["guide-hero"]} style={{ backgroundImage: "url('/img/bg.webp')" }}>
        <h1>{t("guide_camping_h1")}</h1>
      </div>

      <div className={styles["guide-content"]}>
        <p>{t("guide_camping_intro_p")}</p>

        <h2>{t("guide_camping_experience_h2")}</h2>
        <p>{t("guide_camping_experience_p")}</p>

        <h2>{t("guide_camping_provided_h2")}</h2>
        <ul>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <li key={i}>{t(`guide_camping_provided_li${i}`)}</li>
          ))}
        </ul>

        <h2>{t("guide_camping_bring_h2")}</h2>
        <ul>
          {[1, 2, 3, 4, 5].map((i) => (
            <li key={i}>{t(`guide_camping_bring_li${i}`)}</li>
          ))}
        </ul>

        <h2>{t("guide_camping_besttime_h2")}</h2>
        <p>{t("guide_camping_besttime_p")}</p>

        <h2>{t("guide_camping_stargazing_h2")}</h2>
        <p>{t("guide_camping_stargazing_p")}</p>

        <h2>{t("guide_camping_safety_h2")}</h2>
        <p>{t("guide_camping_safety_p")}</p>

        <div className={styles["faq-section"]}>
          <h2>{t("guide_camping_faq_h2")}</h2>
          {[1, 2, 3, 4].map((i) => (
            <div className={styles["faq-item"]} key={i}>
              <h3>{t(`guide_camping_faq${i}_q`)}</h3>
              <p>{t(`guide_camping_faq${i}_a`)}</p>
            </div>
          ))}
        </div>

        <div className={styles["cta-section"]}>
          <p>{t("guide_camping_cta")}</p>
          <Link href="/journeys" className={styles["cta-button"]}>
            {t("guide_camping_cta_button")}
          </Link>
        </div>
      </div>
    </div>
  );
}
