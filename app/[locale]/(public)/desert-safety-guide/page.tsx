import { Link } from "@/lib/i18n/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Breadcrumbs from "@/components/breadcrumbs/breadcrumbs";
import styles from "@/components/guides/guides.module.scss";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://bedouintrails.com";
const PATH = "/desert-safety-guide";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  const url = `${SITE_URL}${PATH}`;
  return {
    title: t("guide_safety_title"),
    description: t("guide_safety_meta_desc"),
    keywords:
      "desert safety Egypt, White Desert safety, Egypt desert tour safety, desert survival tips, desert camping safety, Western Desert Egypt safety, safari safety tips, desert first aid, desert travel advice",
    alternates: { canonical: url, languages: { en: url, ar: url, "x-default": url } },
    openGraph: {
      title: t("guide_safety_og_title"),
      description: t("guide_safety_og_desc"),
      url,
      images: [`${SITE_URL}/og-image.jpg`],
    },
    twitter: {
      card: "summary_large_image",
      title: t("guide_safety_og_title"),
      description: t("guide_safety_og_desc"),
      images: [`${SITE_URL}/og-image.jpg`],
    },
  };
}

export default async function DesertSafetyPage() {
  const t = await getTranslations();
  const url = `${SITE_URL}${PATH}`;

  return (
    <div className={styles["guide-page"]}>
      <Breadcrumbs
        items={[
          { name: t("breadcrumb_home"), url: `${SITE_URL}/` },
          { name: t("guide_safety_breadcrumb"), url },
        ]}
      />

      <div className={styles["guide-hero"]} style={{ backgroundImage: "url('/img/adventure4.webp')" }}>
        <h1>{t("guide_safety_h1")}</h1>
      </div>

      <div className={styles["guide-content"]}>
        <p>{t("guide_safety_intro")}</p>

        <h2>{t("guide_safety_sun_h2")}</h2>
        <ul>
          {[1, 2, 3, 4].map((i) => (
            <li key={i}>
              <strong>{t(`guide_safety_sun_${i}_bold`)}</strong> — {t(`guide_safety_sun_${i}`)}
            </li>
          ))}
        </ul>

        <h2>{t("guide_safety_hydration_h2")}</h2>
        <p>{t("guide_safety_hydration_p")}</p>
        <ul>
          {[1, 2, 3].map((i) => (
            <li key={i}>{t(`guide_safety_hydration_${i}`)}</li>
          ))}
        </ul>

        <div className={styles["highlight-box"]}>
          <p>{t("guide_safety_highlight")}</p>
        </div>

        <h2>{t("guide_safety_navigation_h2")}</h2>
        <p>{t("guide_safety_navigation_p")}</p>

        <h2>{t("guide_safety_wildlife_h2")}</h2>
        <p>{t("guide_safety_wildlife_p")}</p>
        <ul>
          {[1, 2, 3].map((i) => (
            <li key={i}>{t(`guide_safety_wildlife_${i}`)}</li>
          ))}
        </ul>

        <h2>{t("guide_safety_night_h2")}</h2>
        <p>{t("guide_safety_night_p")}</p>
        <ul>
          {[1, 2, 3].map((i) => (
            <li key={i}>{t(`guide_safety_night_${i}`)}</li>
          ))}
        </ul>

        <h2>{t("guide_safety_medical_h2")}</h2>
        <p>{t("guide_safety_medical_p")}</p>
        <ul>
          {[1, 2, 3].map((i) => (
            <li key={i}>{t(`guide_safety_medical_${i}`)}</li>
          ))}
        </ul>

        <h2>{t("guide_safety_vehicle_h2")}</h2>
        <p>{t("guide_safety_vehicle_p")}</p>

        <h2>{t("guide_safety_why_guide_h2")}</h2>
        <p>{t("guide_safety_why_guide_p")}</p>

        <div className={styles["cta-section"]}>
          <p>{t("guide_safety_cta")}</p>
          <Link href="/journeys" className={styles["cta-button"]}>
            {t("guide_browse_tours")}
          </Link>
        </div>
      </div>
    </div>
  );
}
