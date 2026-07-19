import { Link } from "@/lib/i18n/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Breadcrumbs from "@/components/breadcrumbs/breadcrumbs";
import styles from "@/components/guides/guides.module.scss";

import { SITE_URL, buildAlternates } from "@/lib/seo";
const PATH = "/camel-trek";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  const url = `${SITE_URL}${PATH}`;
  return {
    title: t("guide_camel_title"),
    description: t("guide_camel_meta_desc"),
    keywords: t("guide_camel_meta_keywords"),
    alternates: buildAlternates(PATH),
    openGraph: {
      title: t("guide_camel_og_title"),
      description: t("guide_camel_og_desc"),
      url,
      images: [`${SITE_URL}/og-image.jpg`],
    },
    twitter: {
      card: "summary_large_image",
      title: t("guide_camel_twitter_title"),
      description: t("guide_camel_twitter_desc"),
      images: [`${SITE_URL}/og-image.jpg`],
    },
  };
}

export default async function CamelTrekPage() {
  const t = await getTranslations();
  const url = `${SITE_URL}${PATH}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: "Camel Trek in Egypt's Western Desert",
    description:
      "Multi-day camel trekking adventure through the White Desert, Black Desert, and Sahara landscapes with experienced Bedouin guides and traditional camping.",
    touristType: ["Adventure seekers", "Nature lovers", "Culture enthusiasts"],
    url,
    provider: { "@type": "TravelAgency", name: "Bedouin Trails", url: SITE_URL },
  };

  return (
    <div className={styles["guide-page"]}>
      <Breadcrumbs
        items={[
          { name: t("breadcrumb_home"), url: `${SITE_URL}/` },
          { name: t("guide_camel_breadcrumb"), url },
        ]}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className={styles["guide-hero"]} style={{ backgroundImage: "url('/img/camel-ride.webp')" }}>
        <h1>{t("guide_camel_h1")}</h1>
      </div>

      <div className={styles["guide-content"]}>
        <p>{t("guide_camel_intro_p")}</p>

        <h2>{t("guide_camel_why_h2")}</h2>
        <p>{t("guide_camel_why_p")}</p>

        <div className={styles["highlight-box"]}>
          <p>{t("guide_camel_highlight")}</p>
        </div>

        <h2>{t("guide_camel_options_h2")}</h2>

        <h3>{t("guide_camel_options_2day_h3")}</h3>
        <p>{t("guide_camel_options_2day_p")}</p>

        <h3>{t("guide_camel_options_3day_h3")}</h3>
        <p>{t("guide_camel_options_3day_p")}</p>

        <h3>{t("guide_camel_options_5day_h3")}</h3>
        <p>{t("guide_camel_options_5day_p")}</p>

        <h2>{t("guide_camel_expect_h2")}</h2>
        <ul>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <li key={i}>
              <strong>{t(`guide_camel_expect_li${i}_bold`)}</strong> — {t(`guide_camel_expect_li${i}_text`)}
            </li>
          ))}
        </ul>

        <h2>{t("guide_camel_packing_h2")}</h2>
        <ul>
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <li key={i}>{t(`guide_camel_packing_li${i}`)}</li>
          ))}
        </ul>

        <h2>{t("guide_camel_bestseason_h2")}</h2>
        <p>{t("guide_camel_bestseason_p")}</p>

        <div className={styles["faq-section"]}>
          <h2>{t("guide_camel_faq_h2")}</h2>
          {[1, 2, 3].map((i) => (
            <div className={styles["faq-item"]} key={i}>
              <h3>{t(`guide_camel_faq${i}_q`)}</h3>
              <p>{t(`guide_camel_faq${i}_a`)}</p>
            </div>
          ))}
        </div>

        <div className={styles["cta-section"]}>
          <p>{t("guide_camel_cta")}</p>
          <Link href="/journeys" className={styles["cta-button"]}>
            {t("guide_camel_cta_button")}
          </Link>
        </div>
      </div>
    </div>
  );
}
