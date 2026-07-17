import { Link } from "@/lib/i18n/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Breadcrumbs from "@/components/breadcrumbs/breadcrumbs";
import styles from "@/components/guides/guides.module.scss";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://bedouintrails.com";
const PATH = "/white-desert-vs-wadi-rum";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  const url = `${SITE_URL}${PATH}`;
  return {
    title: t("guide_compare_title"),
    description: t("guide_compare_meta_desc"),
    keywords:
      "White Desert vs Wadi Rum, Egypt desert or Jordan desert, White Desert Egypt, Wadi Rum comparison, desert safari comparison, best desert experience, Egypt Safari Tours, White Desert Safari",
    alternates: { canonical: url, languages: { en: url, ar: url, "x-default": url } },
    openGraph: {
      title: t("guide_compare_og_title"),
      description: t("guide_compare_og_desc"),
      url,
      images: [`${SITE_URL}/og-image.jpg`],
    },
    twitter: {
      card: "summary_large_image",
      title: t("guide_compare_twitter_title"),
      description: t("guide_compare_twitter_desc"),
      images: [`${SITE_URL}/og-image.jpg`],
    },
  };
}

export default async function WhiteDesertVsWadiRumPage() {
  const t = await getTranslations();
  const url = `${SITE_URL}${PATH}`;

  return (
    <div className={styles["guide-page"]}>
      <Breadcrumbs
        items={[
          { name: t("breadcrumb_home"), url: `${SITE_URL}/` },
          { name: t("guide_compare_breadcrumb"), url },
        ]}
      />

      <div className={styles["guide-hero"]} style={{ backgroundImage: "url('/img/western-desert-hero.webp')" }}>
        <h1>{t("guide_compare_h1")}</h1>
      </div>

      <div className={styles["guide-content"]}>
        <p>{t("guide_compare_intro_p")}</p>

        <h2>{t("guide_compare_landscape_h2")}</h2>
        <h3>{t("guide_compare_landscape_wd_h3")}</h3>
        <p>{t("guide_compare_landscape_wd_p")}</p>
        <h3>{t("guide_compare_landscape_wr_h3")}</h3>
        <p>{t("guide_compare_landscape_wr_p")}</p>

        <div className={styles["highlight-box"]}>
          <p>
            <strong>{t("guide_compare_landscape_verdict_bold")}</strong> {t("guide_compare_landscape_verdict_text")}
          </p>
        </div>

        <h2>{t("guide_compare_activities_h2")}</h2>
        <h3>{t("guide_compare_activities_wd_h3")}</h3>
        <ul>
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <li key={i}>{t(`guide_compare_activities_wd_li${i}`)}</li>
          ))}
        </ul>
        <h3>{t("guide_compare_activities_wr_h3")}</h3>
        <ul>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <li key={i}>{t(`guide_compare_activities_wr_li${i}`)}</li>
          ))}
        </ul>

        <h2>{t("guide_compare_remoteness_h2")}</h2>
        <h3>{t("guide_compare_remoteness_wd_h3")}</h3>
        <p>{t("guide_compare_remoteness_wd_p")}</p>
        <h3>{t("guide_compare_remoteness_wr_h3")}</h3>
        <p>{t("guide_compare_remoteness_wr_p")}</p>

        <h2>{t("guide_compare_accommodation_h2")}</h2>
        <h3>{t("guide_compare_accommodation_wd_h3")}</h3>
        <p>{t("guide_compare_accommodation_wd_p")}</p>
        <h3>{t("guide_compare_accommodation_wr_h3")}</h3>
        <p>{t("guide_compare_accommodation_wr_p")}</p>

        <h2>{t("guide_compare_accessibility_h2")}</h2>
        <h3>{t("guide_compare_accessibility_wd_h3")}</h3>
        <p>{t("guide_compare_accessibility_wd_p")}</p>
        <h3>{t("guide_compare_accessibility_wr_h3")}</h3>
        <p>{t("guide_compare_accessibility_wr_p")}</p>

        <h2>{t("guide_compare_culture_h2")}</h2>
        <h3>{t("guide_compare_culture_wd_h3")}</h3>
        <p>{t("guide_compare_culture_wd_p")}</p>
        <h3>{t("guide_compare_culture_wr_h3")}</h3>
        <p>{t("guide_compare_culture_wr_p")}</p>

        <h2>{t("guide_compare_bestfor_h2")}</h2>
        <ul>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <li key={i}>
              <strong>{t(`guide_compare_bestfor_li${i}_bold`)}</strong> {t(`guide_compare_bestfor_li${i}_text`)}
            </li>
          ))}
        </ul>

        <h2>{t("guide_compare_both_h2")}</h2>
        <p>{t("guide_compare_both_p")}</p>

        <div className={styles["cta-section"]}>
          <p>{t("guide_compare_cta")}</p>
          <Link href="/white-desert-tour-from-cairo" className={styles["cta-button"]}>
            {t("guide_compare_cta_button")}
          </Link>
        </div>
      </div>
    </div>
  );
}
