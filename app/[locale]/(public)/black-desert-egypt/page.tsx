import { Link } from "@/lib/i18n/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Breadcrumbs from "@/components/breadcrumbs/breadcrumbs";
import styles from "@/components/guides/guides.module.scss";

import { SITE_URL, buildAlternates } from "@/lib/seo";
const PATH = "/black-desert-egypt";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  const url = `${SITE_URL}${PATH}`;
  return {
    title: t("guide_black_title"),
    description: t("guide_black_meta_desc"),
    keywords: t("guide_black_meta_keywords"),
    alternates: buildAlternates(PATH),
    openGraph: {
      title: t("guide_black_og_title"),
      description: t("guide_black_og_desc"),
      url,
      images: [`${SITE_URL}/og-image.jpg`],
    },
    twitter: {
      card: "summary_large_image",
      title: t("guide_black_twitter_title"),
      description: t("guide_black_twitter_desc"),
      images: [`${SITE_URL}/og-image.jpg`],
    },
  };
}

export default async function BlackDesertPage() {
  const t = await getTranslations();
  const url = `${SITE_URL}${PATH}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: "Black Desert",
    alternateName: "الصحراء السوداء",
    description:
      "The Black Desert in Egypt's Western Desert is a volcanic landscape of dark dolerite-covered hills and mountains between Bahariya Oasis and the White Desert. A key stop on Egypt desert safari tours.",
    url,
    geo: { "@type": "GeoCoordinates", latitude: "28.0", longitude: "28.7" },
    touristType: ["Adventure seekers", "Photographers", "Nature lovers"],
  };

  return (
    <div className={styles["guide-page"]}>
      <Breadcrumbs
        items={[
          { name: t("breadcrumb_home"), url: `${SITE_URL}/` },
          { name: t("guide_black_breadcrumb"), url },
        ]}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className={styles["guide-hero"]} style={{ backgroundImage: "url('/img/adventure3.webp')" }}>
        <h1>{t("guide_black_h1")}</h1>
      </div>

      <div className={styles["guide-content"]}>
        <p>{t("guide_black_intro_p")}</p>

        <h2>{t("guide_black_what_h2")}</h2>
        <p>{t("guide_black_what_p1")}</p>
        <p>{t("guide_black_what_p2")}</p>

        <h2>{t("guide_black_see_h2")}</h2>
        <ul>
          {[1, 2, 3, 4, 5].map((i) => (
            <li key={i}>
              <strong>{t(`guide_black_see_li${i}_bold`)}</strong> — {t(`guide_black_see_li${i}_text`)}
            </li>
          ))}
        </ul>

        <div className={styles["highlight-box"]}>
          <p>{t("guide_black_highlight")}</p>
        </div>

        <h2>{t("guide_black_howto_h2")}</h2>
        <p>{t("guide_black_howto_p")}</p>

        <h3>{t("guide_black_route_h3")}</h3>
        <ol>
          <li>
            <strong>{t("guide_black_route_li1_bold")}</strong> {t("guide_black_route_li1_text")}
          </li>
          <li>
            <strong>{t("guide_black_route_li2_bold")}</strong> {t("guide_black_route_li2_text")}
          </li>
          <li>
            <strong>{t("guide_black_route_li3_bold")}</strong> {t("guide_black_route_li3_text")}
          </li>
          <li>
            <strong>{t("guide_black_route_li4_bold")}</strong> {t("guide_black_route_li4_text")}
          </li>
          <li>
            <strong>{t("guide_black_route_li5_bold")}</strong>
          </li>
        </ol>

        <h2>{t("guide_black_photo_h2")}</h2>
        <p>{t("guide_black_photo_p")}</p>

        <h2>{t("guide_black_besttime_h2")}</h2>
        <p>
          {t("guide_black_besttime_p1")} <strong>{t("guide_black_besttime_p1_bold")}</strong>
          {t("guide_black_besttime_p1_cont")}
        </p>

        <div className={styles["faq-section"]}>
          <h2>{t("guide_black_faq_h2")}</h2>
          {[1, 2, 3].map((i) => (
            <div className={styles["faq-item"]} key={i}>
              <h3>{t(`guide_black_faq${i}_q`)}</h3>
              <p>{t(`guide_black_faq${i}_a`)}</p>
            </div>
          ))}
        </div>

        <div className={styles["cta-section"]}>
          <p>{t("guide_black_cta")}</p>
          <Link href="/journeys" className={styles["cta-button"]}>
            {t("guide_black_cta_button")}
          </Link>
        </div>
      </div>
    </div>
  );
}
