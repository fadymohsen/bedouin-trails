import { Link } from "@/lib/i18n/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Breadcrumbs from "@/components/breadcrumbs/breadcrumbs";
import styles from "@/components/guides/guides.module.scss";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://bedouintrails.com";
const PATH = "/stargazing-western-desert";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  const url = `${SITE_URL}${PATH}`;
  return {
    title: t("guide_stars_title"),
    description: t("guide_stars_meta_desc"),
    keywords:
      "stargazing Western Desert, stargazing Egypt, White Desert stars, dark sky Egypt, Milky Way Egypt, desert stargazing, White Desert Camping, night sky Western Desert, astrophotography Egypt desert",
    alternates: { canonical: url, languages: { en: url, ar: url, "x-default": url } },
    openGraph: {
      title: t("guide_stars_og_title"),
      description: t("guide_stars_og_desc"),
      url,
      images: [`${SITE_URL}/og-image.jpg`],
    },
    twitter: {
      card: "summary_large_image",
      title: t("guide_stars_twitter_title"),
      description: t("guide_stars_twitter_desc"),
      images: [`${SITE_URL}/og-image.jpg`],
    },
  };
}

export default async function StargazingPage() {
  const t = await getTranslations();
  const url = `${SITE_URL}${PATH}`;

  return (
    <div className={styles["guide-page"]}>
      <Breadcrumbs
        items={[
          { name: t("breadcrumb_home"), url: `${SITE_URL}/` },
          { name: t("guide_stars_breadcrumb"), url },
        ]}
      />

      <div className={styles["guide-hero"]} style={{ backgroundImage: "url('/img/contact-cta.webp')" }}>
        <h1>{t("guide_stars_h1")}</h1>
      </div>

      <div className={styles["guide-content"]}>
        <p>{t("guide_stars_intro_p")}</p>

        <h2>{t("guide_stars_why_h2")}</h2>
        <ul>
          {[1, 2, 3, 4, 5].map((i) => (
            <li key={i}>
              <strong>{t(`guide_stars_why_li${i}_bold`)}</strong> {t(`guide_stars_why_li${i}_text`)}
            </li>
          ))}
        </ul>

        <div className={styles["highlight-box"]}>
          <p>{t("guide_stars_highlight")}</p>
        </div>

        <h2>{t("guide_stars_see_h2")}</h2>

        <h3>{t("guide_stars_milkyway_h3")}</h3>
        <p>{t("guide_stars_milkyway_p")}</p>

        <h3>{t("guide_stars_planets_h3")}</h3>
        <p>{t("guide_stars_planets_p")}</p>

        <h3>{t("guide_stars_shooting_h3")}</h3>
        <p>{t("guide_stars_shooting_p")}</p>

        <h3>{t("guide_stars_constellations_h3")}</h3>
        <p>{t("guide_stars_constellations_p")}</p>

        <h2>{t("guide_stars_besttime_h2")}</h2>
        <ul>
          {[1, 2, 3, 4].map((i) => (
            <li key={i}>
              <strong>{t(`guide_stars_besttime_li${i}_bold`)}</strong> {t(`guide_stars_besttime_li${i}_text`)}
            </li>
          ))}
        </ul>

        <h2>{t("guide_stars_photo_h2")}</h2>
        <ul>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <li key={i}>
              <strong>{t(`guide_stars_photo_li${i}_bold`)}</strong> {t(`guide_stars_photo_li${i}_text`)}
            </li>
          ))}
        </ul>

        <h2>{t("guide_stars_camping_h2")}</h2>
        <p>{t("guide_stars_camping_p")}</p>

        <div className={styles["cta-section"]}>
          <p>{t("guide_stars_cta")}</p>
          <Link href="/journeys" className={styles["cta-button"]}>
            {t("guide_stars_cta_button")}
          </Link>
        </div>
      </div>
    </div>
  );
}
