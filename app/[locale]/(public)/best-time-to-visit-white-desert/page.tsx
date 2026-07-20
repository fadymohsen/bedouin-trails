import { Link } from "@/lib/i18n/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Breadcrumbs from "@/components/breadcrumbs/breadcrumbs";
import styles from "@/components/guides/guides.module.scss";

import { SITE_URL, buildAlternates } from "@/lib/seo";
const PATH = "/best-time-to-visit-white-desert";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  const url = `${SITE_URL}${PATH}`;
  return {
    title: t("guide_besttime_title"),
    description: t("guide_besttime_meta_desc"),
    keywords: t("guide_besttime_meta_keywords"),
    alternates: buildAlternates(PATH),
    openGraph: {
      title: t("guide_besttime_og_title"),
      description: t("guide_besttime_og_desc"),
      url,
      images: [`${SITE_URL}/og-image.jpg`],
    },
    twitter: {
      card: "summary_large_image",
      title: t("guide_besttime_twitter_title"),
      description: t("guide_besttime_twitter_desc"),
      images: [`${SITE_URL}/og-image.jpg`],
    },
  };
}

export default async function BestTimePage() {
  const t = await getTranslations();
  const url = `${SITE_URL}${PATH}`;

  return (
    <div className={styles["guide-page"]}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "Article",
        headline: t("guide_besttime_h1"), description: t("guide_besttime_meta_desc"),
        url, image: `${SITE_URL}/og-image.jpg`,
        publisher: { "@type": "Organization", name: "Bedouin Trails", logo: { "@type": "ImageObject", url: `${SITE_URL}/img/logo.png` } },
        mainEntityOfPage: url,
      }) }} />
      <Breadcrumbs
        items={[
          { name: t("breadcrumb_home"), url: `${SITE_URL}/` },
          { name: t("guide_besttime_breadcrumb"), url },
        ]}
      />

      <div className={styles["guide-hero"]} style={{ backgroundImage: "url('/img/western-desert-hero.webp')" }}>
        <h1>{t("guide_besttime_h1")}</h1>
      </div>

      <div className={styles["guide-content"]}>
        <p>{t("guide_besttime_intro_p")}</p>

        <div className={styles["highlight-box"]}>
          <p>
            <strong>{t("guide_besttime_highlight_bold")}</strong> {t("guide_besttime_highlight")}
          </p>
        </div>

        <h2>{t("guide_besttime_monthly_h2")}</h2>

        <h3>{t("guide_besttime_jan_h3")}</h3>
        <p>{t("guide_besttime_jan_temps")}</p>
        <p>{t("guide_besttime_jan_p")}</p>

        <h3>{t("guide_besttime_feb_h3")}</h3>
        <p>{t("guide_besttime_feb_temps")}</p>
        <p>{t("guide_besttime_feb_p")}</p>

        <h3>{t("guide_besttime_mar_h3")}</h3>
        <p>{t("guide_besttime_mar_temps")}</p>
        <p>{t("guide_besttime_mar_p")}</p>

        <h3>{t("guide_besttime_apr_h3")}</h3>
        <p>{t("guide_besttime_apr_temps")}</p>
        <p>{t("guide_besttime_apr_p")}</p>

        <h3>{t("guide_besttime_may_h3")}</h3>
        <p>{t("guide_besttime_may_temps")}</p>
        <p>{t("guide_besttime_may_p")}</p>

        <h3>{t("guide_besttime_summer_h3")}</h3>
        <p>{t("guide_besttime_summer_temps")}</p>
        <p>{t("guide_besttime_summer_p")}</p>

        <h3>{t("guide_besttime_sep_h3")}</h3>
        <p>{t("guide_besttime_sep_temps")}</p>
        <p>{t("guide_besttime_sep_p")}</p>

        <h3>{t("guide_besttime_oct_h3")}</h3>
        <p>{t("guide_besttime_oct_temps")}</p>
        <p>{t("guide_besttime_oct_p")}</p>

        <h3>{t("guide_besttime_nov_h3")}</h3>
        <p>{t("guide_besttime_nov_temps")}</p>
        <p>{t("guide_besttime_nov_p")}</p>

        <h3>{t("guide_besttime_dec_h3")}</h3>
        <p>{t("guide_besttime_dec_temps")}</p>
        <p>{t("guide_besttime_dec_p")}</p>

        <h2>{t("guide_besttime_activity_h2")}</h2>
        <ul>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <li key={i}>
              <strong>{t(`guide_besttime_activity_li${i}_bold`)}</strong> {t(`guide_besttime_activity_li${i}_text`)}
            </li>
          ))}
        </ul>

        <h2>{t("guide_besttime_rain_h2")}</h2>
        <p>{t("guide_besttime_rain_p")}</p>

        <div className={styles["cta-section"]}>
          <p>{t("guide_besttime_cta")}</p>
          <Link href="/journeys" className={styles["cta-button"]}>
            {t("guide_browse_tours")}
          </Link>
        </div>
      </div>
    </div>
  );
}
