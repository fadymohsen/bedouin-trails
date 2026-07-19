import { Link } from "@/lib/i18n/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Breadcrumbs from "@/components/breadcrumbs/breadcrumbs";
import styles from "@/components/guides/guides.module.scss";

import { SITE_URL, buildAlternates } from "@/lib/seo";
const PATH = "/western-desert-egypt-guide";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  const url = `${SITE_URL}${PATH}`;
  return {
    title: t("guide_western_title"),
    description: t("guide_western_meta_desc"),
    keywords: t("guide_western_meta_keywords"),
    alternates: buildAlternates(PATH),
    openGraph: {
      title: t("guide_western_og_title"),
      description: t("guide_western_og_desc"),
      url,
      images: [`${SITE_URL}/og-image.jpg`],
    },
    twitter: {
      card: "summary_large_image",
      title: t("guide_western_twitter_title"),
      description: t("guide_western_twitter_desc"),
      images: [`${SITE_URL}/og-image.jpg`],
    },
  };
}

export default async function WesternDesertGuidePage() {
  const t = await getTranslations();
  const url = `${SITE_URL}${PATH}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Complete Guide to Egypt's Western Desert",
    description:
      "The ultimate guide to exploring Egypt's Western Desert including the White Desert, Black Desert, Bahariya Oasis, Siwa Oasis, and Djara Cave.",
    url,
    publisher: { "@type": "Organization", name: "Bedouin Trails", url: SITE_URL },
    mainEntityOfPage: url,
  };

  return (
    <div className={styles["guide-page"]}>
      <Breadcrumbs
        items={[
          { name: t("breadcrumb_home"), url: `${SITE_URL}/` },
          { name: t("guide_western_breadcrumb"), url },
        ]}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className={styles["guide-hero"]} style={{ backgroundImage: "url('/img/western-desert-hero.webp')" }}>
        <h1>{t("guide_western_h1")}</h1>
      </div>

      <div className={styles["guide-content"]}>
        <p>{t("guide_western_intro_p1")}</p>
        <p>{t("guide_western_intro_p2")}</p>

        <h2>{t("guide_western_geography_h2")}</h2>
        <p>{t("guide_western_geography_p1")}</p>
        <p>{t("guide_western_geography_p2")}</p>

        <h2>{t("guide_western_destinations_h2")}</h2>

        <h3>{t("guide_western_white_h3")}</h3>
        <p>
          {t("guide_western_white_p1")} <Link href="/white-desert-tour-from-cairo">{t("guide_western_white_link")}</Link>{" "}
          {t("guide_western_white_p2")}
        </p>

        <h3>{t("guide_western_black_h3")}</h3>
        <p>
          {t("guide_western_black_p1")} <Link href="/black-desert-egypt">{t("guide_western_black_link")}</Link>{" "}
          {t("guide_western_black_p2")}
        </p>

        <h3>{t("guide_western_bahariya_h3")}</h3>
        <p>{t("guide_western_bahariya_p")}</p>

        <h3>{t("guide_western_siwa_h3")}</h3>
        <p>{t("guide_western_siwa_p")}</p>

        <h3>{t("guide_western_crystal_h3")}</h3>
        <p>
          <Link href="/crystal-mountain-egypt">{t("guide_western_crystal_link")}</Link> {t("guide_western_crystal_p")}
        </p>

        <h3>{t("guide_western_djara_h3")}</h3>
        <p>
          <Link href="/djara-cave">{t("guide_western_djara_link")}</Link> {t("guide_western_djara_p")}
        </p>

        <h3>{t("guide_western_agabat_h3")}</h3>
        <p>{t("guide_western_agabat_p")}</p>

        <h3>{t("guide_western_sandsea_h3")}</h3>
        <p>{t("guide_western_sandsea_p")}</p>

        <h2>{t("guide_western_explore_h2")}</h2>
        <p>{t("guide_western_explore_p")}</p>

        <h3>{t("guide_western_duration_h3")}</h3>
        <ul>
          <li>
            <strong>
              <Link href="/white-desert-tour-from-cairo">{t("guide_western_duration_li1_bold")}</Link>
            </strong>{" "}
            — {t("guide_western_duration_li1_text")}
          </li>
          <li>
            <strong>{t("guide_western_duration_li2_bold")}</strong> — {t("guide_western_duration_li2_text")}
          </li>
          <li>
            <strong>{t("guide_western_duration_li3_bold")}</strong> — {t("guide_western_duration_li3_text")}{" "}
            <Link href="/djara-cave">{t("guide_western_duration_li3_link")}</Link> {t("guide_western_duration_li3_cont")}
          </li>
          <li>
            <strong>{t("guide_western_duration_li4_bold")}</strong> — {t("guide_western_duration_li4_text")}{" "}
            <Link href="/camel-trek">{t("guide_western_duration_li4_link")}</Link> {t("guide_western_duration_li4_cont")}
          </li>
          <li>
            <strong>{t("guide_western_duration_li5_bold")}</strong> — {t("guide_western_duration_li5_text")}
          </li>
        </ul>

        <h3>{t("guide_western_activity_h3")}</h3>
        <ul>
          <li>
            <strong>{t("guide_western_activity_li1_bold")}</strong> — {t("guide_western_activity_li1_text")}
          </li>
          <li>
            <strong>
              <Link href="/camel-trek">{t("guide_western_activity_li2_bold")}</Link>
            </strong>{" "}
            — {t("guide_western_activity_li2_text")}
          </li>
          <li>
            <strong>{t("guide_western_activity_li3_bold")}</strong> — {t("guide_western_activity_li3_text")}
          </li>
          <li>
            <strong>
              <Link href="/desert-yoga-retreat">{t("guide_western_activity_li4_bold")}</Link>
            </strong>{" "}
            — {t("guide_western_activity_li4_text")}
          </li>
          <li>
            <strong>{t("guide_western_activity_li5_bold")}</strong> — {t("guide_western_activity_li5_text")}
          </li>
        </ul>

        <h2>{t("guide_western_climate_h2")}</h2>
        <p>{t("guide_western_climate_p")}</p>

        <div className={styles["highlight-box"]}>
          <p>{t("guide_western_highlight")}</p>
        </div>

        <h2>{t("guide_western_history_h2")}</h2>
        <p>{t("guide_western_history_p1")}</p>
        <p>{t("guide_western_history_p2")}</p>

        <h2>{t("guide_western_wildlife_h2")}</h2>
        <p>{t("guide_western_wildlife_p")}</p>

        <h2>{t("guide_western_practical_h2")}</h2>

        <h3>{t("guide_western_getting_h3")}</h3>
        <p>{t("guide_western_getting_p")}</p>

        <h3>{t("guide_western_bring_h3")}</h3>
        <p>
          {t("guide_western_bring_p")} <Link href="/what-to-pack-white-desert">{t("guide_western_bring_link")}</Link>
          {t("guide_western_bring_p_cont")}
        </p>

        <h3>{t("guide_western_permits_h3")}</h3>
        <p>{t("guide_western_permits_p")}</p>

        <h3>{t("guide_western_safety_h3")}</h3>
        <p>
          {t("guide_western_safety_p")} <Link href="/desert-safety-guide">{t("guide_western_safety_link")}</Link>{" "}
          {t("guide_western_safety_p_cont")}
        </p>

        <div className={styles["cta-section"]}>
          <p>{t("guide_western_cta")}</p>
          <Link href="/journeys" className={styles["cta-button"]}>
            {t("guide_western_cta_button")}
          </Link>
        </div>
      </div>
    </div>
  );
}
