import { Link } from "@/lib/i18n/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Breadcrumbs from "@/components/breadcrumbs/breadcrumbs";
import styles from "@/components/guides/guides.module.scss";

import { SITE_URL, buildAlternates } from "@/lib/seo";
const PATH = "/what-to-pack-white-desert";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  const url = `${SITE_URL}${PATH}`;
  return {
    title: t("guide_packing_title"),
    description: t("guide_packing_meta_desc"),
    keywords: t("guide_packing_meta_keywords"),
    alternates: buildAlternates(PATH),
    openGraph: {
      title: t("guide_packing_og_title"),
      description: t("guide_packing_og_desc"),
      url,
      images: [`${SITE_URL}/og-image.jpg`],
    },
    twitter: {
      card: "summary_large_image",
      title: t("guide_packing_twitter_title"),
      description: t("guide_packing_twitter_desc"),
      images: [`${SITE_URL}/og-image.jpg`],
    },
  };
}

export default async function PackingGuidePage() {
  const t = await getTranslations();
  const url = `${SITE_URL}${PATH}`;

  return (
    <div className={styles["guide-page"]}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "Article",
        headline: t("guide_packing_h1"), description: t("guide_packing_meta_desc"),
        url, image: `${SITE_URL}/og-image.jpg`,
        publisher: { "@type": "Organization", name: "Bedouin Trails", logo: { "@type": "ImageObject", url: `${SITE_URL}/img/logo.png` } },
        mainEntityOfPage: url,
      }) }} />
      <Breadcrumbs
        items={[
          { name: t("breadcrumb_home"), url: `${SITE_URL}/` },
          { name: t("guide_packing_breadcrumb"), url },
        ]}
      />

      <div className={styles["guide-hero"]} style={{ backgroundImage: "url('/img/adventure.webp')" }}>
        <h1>{t("guide_packing_h1")}</h1>
      </div>

      <div className={styles["guide-content"]}>
        <p>{t("guide_packing_intro_p")}</p>

        <h2>{t("guide_packing_provided_h2")}</h2>
        <p>{t("guide_packing_provided_intro")}</p>
        <ul>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <li key={i}>{t(`guide_packing_provided_li${i}`)}</li>
          ))}
        </ul>

        <h2>{t("guide_packing_essential_h2")}</h2>

        <h3>{t("guide_packing_clothing_h3")}</h3>
        <ul>
          <li>
            <strong>{t("guide_packing_clothing_li1_bold")}</strong> {t("guide_packing_clothing_li1_text")}
          </li>
          <li>
            <strong>{t("guide_packing_clothing_li2_bold")}</strong> {t("guide_packing_clothing_li2_text")}
          </li>
          <li>
            <strong>{t("guide_packing_clothing_li3_bold")}</strong> — {t("guide_packing_clothing_li3_text")}
          </li>
          <li>
            <strong>{t("guide_packing_clothing_li4_bold")}</strong> — {t("guide_packing_clothing_li4_text")}
          </li>
          <li>
            <strong>{t("guide_packing_clothing_li5_bold")}</strong> — {t("guide_packing_clothing_li5_text")}
          </li>
          <li>
            <strong>{t("guide_packing_clothing_li6_bold")}</strong> — {t("guide_packing_clothing_li6_text")}
          </li>
          <li>
            <strong>{t("guide_packing_clothing_li7_bold")}</strong> — {t("guide_packing_clothing_li7_text")}
          </li>
        </ul>

        <h3>{t("guide_packing_footwear_h3")}</h3>
        <ul>
          {[1, 2].map((i) => (
            <li key={i}>
              <strong>{t(`guide_packing_footwear_li${i}_bold`)}</strong> — {t(`guide_packing_footwear_li${i}_text`)}
            </li>
          ))}
        </ul>

        <h3>{t("guide_packing_sun_h3")}</h3>
        <ul>
          {[1, 2, 3, 4].map((i) => (
            <li key={i}>
              <strong>{t(`guide_packing_sun_li${i}_bold`)}</strong> — {t(`guide_packing_sun_li${i}_text`)}
            </li>
          ))}
        </ul>

        <h3>{t("guide_packing_wind_h3")}</h3>
        <ul>
          <li>
            <strong>{t("guide_packing_wind_li1_bold")}</strong> — {t("guide_packing_wind_li1_text")}
          </li>
        </ul>

        <h3>{t("guide_packing_personal_h3")}</h3>
        <ul>
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <li key={i}>
              <strong>{t(`guide_packing_personal_li${i}_bold`)}</strong> — {t(`guide_packing_personal_li${i}_text`)}
            </li>
          ))}
        </ul>

        <h2>{t("guide_packing_notpack_h2")}</h2>
        <ul>
          {[1, 2, 3, 4, 5].map((i) => (
            <li key={i}>
              <strong>{t(`guide_packing_notpack_li${i}_bold`)}</strong> — {t(`guide_packing_notpack_li${i}_text`)}
            </li>
          ))}
        </ul>

        <div className={styles["highlight-box"]}>
          <p>{t("guide_packing_highlight")}</p>
        </div>

        <h2>{t("guide_packing_seasonal_h2")}</h2>

        <h3>{t("guide_packing_autumn_h3")}</h3>
        <p>{t("guide_packing_autumn_p")}</p>

        <h3>{t("guide_packing_winter_h3")}</h3>
        <p>{t("guide_packing_winter_p")}</p>

        <h3>{t("guide_packing_spring_h3")}</h3>
        <p>{t("guide_packing_spring_p")}</p>

        <div className={styles["cta-section"]}>
          <p>{t("guide_packing_cta")}</p>
          <Link href="/journeys" className={styles["cta-button"]}>
            {t("guide_browse_tours")}
          </Link>
        </div>
      </div>
    </div>
  );
}
