import { Link } from "@/lib/i18n/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Breadcrumbs from "@/components/breadcrumbs/breadcrumbs";
import styles from "@/components/guides/guides.module.scss";

import { SITE_URL, buildAlternates } from "@/lib/seo";
const PATH = "/desert-yoga-retreat";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  const url = `${SITE_URL}${PATH}`;
  return {
    title: t("guide_yoga_title"),
    description: t("guide_yoga_meta_desc"),
    keywords: t("guide_yoga_meta_keywords"),
    alternates: buildAlternates(PATH),
    openGraph: {
      title: t("guide_yoga_og_title"),
      description: t("guide_yoga_og_desc"),
      url,
      images: [`${SITE_URL}/og-image.jpg`],
    },
    twitter: {
      card: "summary_large_image",
      title: t("guide_yoga_twitter_title"),
      description: t("guide_yoga_twitter_desc"),
      images: [`${SITE_URL}/og-image.jpg`],
    },
  };
}

export default async function DesertYogaRetreatPage() {
  const t = await getTranslations();
  const url = `${SITE_URL}${PATH}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: "Desert Yoga Retreat in Egypt's White Desert",
    description:
      "A unique yoga and meditation retreat experience in the heart of Egypt's Western Desert, combining desert camping with mindfulness practices under the Saharan sky.",
    touristType: ["Yoga practitioners", "Meditation seekers", "Wellness travelers"],
    url,
    provider: { "@type": "TravelAgency", name: "Bedouin Trails", url: SITE_URL },
  };

  return (
    <div className={styles["guide-page"]}>
      <Breadcrumbs
        items={[
          { name: t("breadcrumb_home"), url: `${SITE_URL}/` },
          { name: t("guide_yoga_breadcrumb"), url },
        ]}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className={styles["guide-hero"]} style={{ backgroundImage: "url('/img/western-desert-hero.webp')" }}>
        <h1>{t("guide_yoga_h1")}</h1>
      </div>

      <div className={styles["guide-content"]}>
        <p>{t("guide_yoga_intro_p")}</p>

        <h2>{t("guide_yoga_why_h2")}</h2>
        <p>{t("guide_yoga_why_p")}</p>

        <div className={styles["highlight-box"]}>
          <p>{t("guide_yoga_highlight")}</p>
        </div>

        <h2>{t("guide_yoga_includes_h2")}</h2>
        <ul>
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <li key={i}>
              <strong>{t(`guide_yoga_includes_li${i}_bold`)}</strong> — {t(`guide_yoga_includes_li${i}_text`)}
            </li>
          ))}
        </ul>

        <h2>{t("guide_yoga_who_h2")}</h2>
        <p>{t("guide_yoga_who_p")}</p>

        <h2>{t("guide_yoga_duration_h2")}</h2>
        <h3>{t("guide_yoga_duration_2day_h3")}</h3>
        <p>{t("guide_yoga_duration_2day_p")}</p>

        <h3>{t("guide_yoga_duration_3day_h3")}</h3>
        <p>{t("guide_yoga_duration_3day_p")}</p>

        <h3>{t("guide_yoga_duration_5day_h3")}</h3>
        <p>{t("guide_yoga_duration_5day_p")}</p>

        <h2>{t("guide_yoga_getting_h2")}</h2>
        <p>{t("guide_yoga_getting_p")}</p>

        <h2>{t("guide_yoga_besttime_h2")}</h2>
        <p>{t("guide_yoga_besttime_p")}</p>

        <div className={styles["faq-section"]}>
          <h2>{t("guide_yoga_faq_h2")}</h2>
          {[1, 2, 3, 4].map((i) => (
            <div className={styles["faq-item"]} key={i}>
              <h3>{t(`guide_yoga_faq${i}_q`)}</h3>
              <p>{t(`guide_yoga_faq${i}_a`)}</p>
            </div>
          ))}
        </div>

        <div className={styles["cta-section"]}>
          <p>{t("guide_yoga_cta")}</p>
          <Link href="/journeys" className={styles["cta-button"]}>
            {t("guide_yoga_cta_button")}
          </Link>
        </div>
      </div>
    </div>
  );
}
