import { Link } from "@/lib/i18n/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Breadcrumbs from "@/components/breadcrumbs/breadcrumbs";
import styles from "@/components/guides/guides.module.scss";

import { SITE_URL, buildAlternates } from "@/lib/seo";
const PATH = "/white-desert-tour-cost";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  const url = `${SITE_URL}${PATH}`;
  return {
    title: t("guide_cost_title"),
    description: t("guide_cost_meta_desc"),
    keywords:
      "White Desert tour cost, White Desert tour price, Egypt desert tour cost, how much White Desert safari, Egypt Safari Tours price, Bahariya Oasis tour cost, desert camping Egypt price, White Desert tour from Cairo cost",
    alternates: buildAlternates(PATH),
    openGraph: {
      title: t("guide_cost_og_title"),
      description: t("guide_cost_og_desc"),
      url,
      images: [`${SITE_URL}/og-image.jpg`],
    },
    twitter: {
      card: "summary_large_image",
      title: t("guide_cost_twitter_title"),
      description: t("guide_cost_twitter_desc"),
      images: [`${SITE_URL}/og-image.jpg`],
    },
  };
}

export default async function TourCostPage() {
  const t = await getTranslations();
  const url = `${SITE_URL}${PATH}`;

  return (
    <div className={styles["guide-page"]}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "Article",
        headline: t("guide_cost_h1"), description: t("guide_cost_meta_desc"),
        url, image: `${SITE_URL}/og-image.jpg`,
        publisher: { "@type": "Organization", name: "Bedouin Trails", logo: { "@type": "ImageObject", url: `${SITE_URL}/img/logo.png` } },
        mainEntityOfPage: url,
      }) }} />
      <Breadcrumbs
        items={[
          { name: t("breadcrumb_home"), url: `${SITE_URL}/` },
          { name: t("guide_cost_breadcrumb"), url },
        ]}
      />

      <div className={styles["guide-hero"]} style={{ backgroundImage: "url('/img/bg.webp')" }}>
        <h1>{t("guide_cost_h1")}</h1>
      </div>

      <div className={styles["guide-content"]}>
        <p>{t("guide_cost_intro_p")}</p>

        <h2>{t("guide_cost_factors_h2")}</h2>

        <h3>{t("guide_cost_group_h3")}</h3>
        <p>{t("guide_cost_group_p")}</p>

        <h3>{t("guide_cost_duration_h3")}</h3>
        <p>{t("guide_cost_duration_p")}</p>

        <h3>{t("guide_cost_season_h3")}</h3>
        <p>{t("guide_cost_season_p")}</p>

        <h3>{t("guide_cost_inclusions_h3")}</h3>
        <p>{t("guide_cost_inclusions_p")}</p>

        <h2>{t("guide_cost_included_h2")}</h2>
        <ul>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <li key={i}>{t(`guide_cost_included_li${i}`)}</li>
          ))}
        </ul>

        <h2>{t("guide_cost_notincluded_h2")}</h2>
        <ul>
          {[1, 2, 3, 4].map((i) => (
            <li key={i}>{t(`guide_cost_notincluded_li${i}`)}</li>
          ))}
        </ul>

        <div className={styles["highlight-box"]}>
          <p>
            <strong>{t("guide_cost_tip_bold")}</strong> {t("guide_cost_tip_text")}
          </p>
        </div>

        <h2>{t("guide_cost_value_h2")}</h2>
        <ul>
          {[1, 2, 3, 4].map((i) => (
            <li key={i}>
              <strong>{t(`guide_cost_value_li${i}_bold`)}</strong> {t(`guide_cost_value_li${i}_text`)}
            </li>
          ))}
        </ul>

        <h2>{t("guide_cost_worth_h2")}</h2>
        <p>{t("guide_cost_worth_p1")}</p>
        <p>{t("guide_cost_worth_p2")}</p>

        <div className={styles["cta-section"]}>
          <p>{t("guide_cost_cta")}</p>
          <Link href="/journeys" className={styles["cta-button"]}>
            {t("guide_cost_cta_button")}
          </Link>
        </div>
      </div>
    </div>
  );
}
