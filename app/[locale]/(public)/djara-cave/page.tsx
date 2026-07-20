import { Link } from "@/lib/i18n/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Breadcrumbs from "@/components/breadcrumbs/breadcrumbs";
import styles from "@/components/guides/guides.module.scss";

import { SITE_URL, buildAlternates } from "@/lib/seo";
const PATH = "/djara-cave";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  const url = `${SITE_URL}${PATH}`;
  return {
    title: t("guide_djara_title"),
    description: t("guide_djara_meta_desc"),
    keywords: t("guide_djara_meta_keywords"),
    alternates: buildAlternates(PATH),
    openGraph: {
      title: t("guide_djara_og_title"),
      description: t("guide_djara_og_desc"),
      url,
      images: [`${SITE_URL}/og-image.jpg`],
    },
    twitter: {
      card: "summary_large_image",
      title: t("guide_djara_twitter_title"),
      description: t("guide_djara_twitter_desc"),
      images: [`${SITE_URL}/og-image.jpg`],
    },
  };
}

export default async function DjaraCavePage() {
  const t = await getTranslations();
  const url = `${SITE_URL}${PATH}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: "Djara Cave",
    alternateName: "كهف الجارة",
    description:
      "Djara Cave is a prehistoric cave in Egypt's Western Desert containing Neolithic rock art and murals dating back to 7700–5300 BC, depicting humans, animals, and hunting scenes from when the Sahara was green.",
    url,
    geo: { "@type": "GeoCoordinates", latitude: "27.55", longitude: "28.65" },
    touristType: ["History enthusiasts", "Adventure seekers", "Archaeologists"],
  };

  return (
    <div className={styles["guide-page"]}>
      <Breadcrumbs
        items={[
          { name: t("breadcrumb_home"), url: `${SITE_URL}/` },
          { name: t("guide_djara_breadcrumb"), url },
        ]}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className={styles["guide-hero"]} style={{ backgroundImage: "url('/img/adventure1.webp')" }}>
        <h1>{t("guide_djara_h1")}</h1>
      </div>

      <div className={styles["guide-content"]}>
        <p>{t("guide_djara_intro_p")}</p>

        <h2>{t("guide_djara_what_h2")}</h2>
        <p>{t("guide_djara_what_p1")}</p>
        <p>{t("guide_djara_what_p2")}</p>

        <h2>{t("guide_djara_see_h2")}</h2>
        <ul>
          {[1, 2, 3, 4, 5].map((i) => (
            <li key={i}>
              <strong>{t(`guide_djara_see_li${i}_bold`)}</strong> — {t(`guide_djara_see_li${i}_text`)}
            </li>
          ))}
        </ul>

        <div className={styles["highlight-box"]}>
          <p>{t("guide_djara_highlight")}</p>
        </div>

        <h2>{t("guide_djara_howto_h2")}</h2>
        <p>{t("guide_djara_howto_p")}</p>

        <h3>{t("guide_djara_itinerary_h3")}</h3>
        <ol>
          {[1, 2, 3, 4].map((i) => (
            <li key={i}>
              <strong>{t(`guide_djara_itinerary_li${i}_bold`)}</strong> {t(`guide_djara_itinerary_li${i}_text`)}
            </li>
          ))}
        </ol>

        <h2>{t("guide_djara_besttime_h2")}</h2>
        <p>{t("guide_djara_besttime_p")}</p>

        <h2>{t("guide_djara_why_h2")}</h2>
        <p>{t("guide_djara_why_p")}</p>

        <div className={styles["faq-section"]}>
          <h2>{t("guide_djara_faq_h2")}</h2>
          {[1, 2, 3].map((i) => (
            <div className={styles["faq-item"]} key={i}>
              <h3>{t(`guide_djara_faq${i}_q`)}</h3>
              <p>{t(`guide_djara_faq${i}_a`)}</p>
            </div>
          ))}
        </div>

        <div className={styles["cta-section"]}>
          <p>{t("guide_djara_cta")}</p>
          <Link href="/journeys" className={styles["cta-button"]}>
            {t("guide_browse_tours")}
          </Link>
        </div>
      </div>
    </div>
  );
}
