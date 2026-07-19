import { Link } from "@/lib/i18n/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Breadcrumbs from "@/components/breadcrumbs/breadcrumbs";
import styles from "@/components/guides/guides.module.scss";

import { SITE_URL, buildAlternates } from "@/lib/seo";
const PATH = "/white-desert-tour-from-cairo";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  const url = `${SITE_URL}${PATH}`;
  return {
    title: t("guide_whitetour_title"),
    description: t("guide_whitetour_meta_desc"),
    keywords: t("guide_whitetour_meta_keywords"),
    alternates: buildAlternates(PATH),
    openGraph: {
      title: t("guide_whitetour_og_title"),
      description: t("guide_whitetour_og_desc"),
      url,
      images: [`${SITE_URL}/og-image.jpg`],
    },
    twitter: {
      card: "summary_large_image",
      title: t("guide_whitetour_twitter_title"),
      description: t("guide_whitetour_twitter_desc"),
      images: [`${SITE_URL}/og-image.jpg`],
    },
  };
}

export default async function WhiteDesertTourPage() {
  const t = await getTranslations();
  const url = `${SITE_URL}${PATH}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: "2 Day White Desert Tour from Cairo",
    description:
      "A 2-day White Desert safari tour from Cairo including Bahariya Oasis, Black Desert, Crystal Mountain, and overnight camping in the White Desert under the stars.",
    touristType: ["Adventure seekers", "Nature lovers", "Photographers"],
    url,
    itinerary: { "@type": "ItemList", numberOfItems: 2, description: "2 days from Cairo to White Desert via Bahariya Oasis" },
    provider: { "@type": "TravelAgency", name: "Bedouin Trails", url: SITE_URL },
  };

  return (
    <div className={styles["guide-page"]}>
      <Breadcrumbs
        items={[
          { name: t("breadcrumb_home"), url: `${SITE_URL}/` },
          { name: t("guide_whitetour_breadcrumb"), url },
        ]}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className={styles["guide-hero"]} style={{ backgroundImage: "url('/img/bg.webp')" }}>
        <h1>{t("guide_whitetour_h1")}</h1>
      </div>

      <div className={styles["guide-content"]}>
        <p>{t("guide_whitetour_intro_p")}</p>

        <h2>{t("guide_whitetour_itinerary_h2")}</h2>

        <h3>{t("guide_whitetour_day1_h3")}</h3>
        <ol>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <li key={i}>
              <strong>{t(`guide_whitetour_day1_li${i}_bold`)}</strong> — {t(`guide_whitetour_day1_li${i}_text`)}
            </li>
          ))}
        </ol>

        <h3>{t("guide_whitetour_day2_h3")}</h3>
        <ol>
          {[1, 2, 3, 4, 5].map((i) => (
            <li key={i}>
              <strong>{t(`guide_whitetour_day2_li${i}_bold`)}</strong> — {t(`guide_whitetour_day2_li${i}_text`)}
            </li>
          ))}
        </ol>

        <div className={styles["highlight-box"]}>
          <p>{t("guide_whitetour_highlight")}</p>
        </div>

        <h2>{t("guide_whitetour_included_h2")}</h2>
        <ul>
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <li key={i}>{t(`guide_whitetour_included_li${i}`)}</li>
          ))}
        </ul>

        <h2>{t("guide_whitetour_notincluded_h2")}</h2>
        <ul>
          {[1, 2, 3].map((i) => (
            <li key={i}>{t(`guide_whitetour_notincluded_li${i}`)}</li>
          ))}
        </ul>

        <h2>{t("guide_whitetour_howto_h2")}</h2>
        <p>{t("guide_whitetour_howto_p")}</p>

        <h2>{t("guide_whitetour_besttime_h2")}</h2>
        <p>
          {t("guide_whitetour_besttime_p1")} <strong>{t("guide_whitetour_besttime_p1_bold")}</strong>
          {t("guide_whitetour_besttime_p1_cont")}
        </p>

        <div className={styles["faq-section"]}>
          <h2>{t("guide_whitetour_faq_h2")}</h2>
          {[1, 2, 3, 4].map((i) => (
            <div className={styles["faq-item"]} key={i}>
              <h3>{t(`guide_whitetour_faq${i}_q`)}</h3>
              <p>{t(`guide_whitetour_faq${i}_a`)}</p>
            </div>
          ))}
        </div>

        <div className={styles["cta-section"]}>
          <p>{t("guide_whitetour_cta")}</p>
          <Link href="/journeys" className={styles["cta-button"]}>
            {t("guide_whitetour_cta_button")}
          </Link>
        </div>
      </div>
    </div>
  );
}
