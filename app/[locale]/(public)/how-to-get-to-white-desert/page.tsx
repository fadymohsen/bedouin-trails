import { Link } from "@/lib/i18n/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Breadcrumbs from "@/components/breadcrumbs/breadcrumbs";
import styles from "@/components/guides/guides.module.scss";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://bedouintrails.com";
const PATH = "/how-to-get-to-white-desert";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  const url = `${SITE_URL}${PATH}`;
  return {
    title: t("guide_howto_title"),
    description: t("guide_howto_meta_desc"),
    keywords: t("guide_howto_meta_keywords"),
    alternates: { canonical: url, languages: { en: url, ar: url, "x-default": url } },
    openGraph: {
      title: t("guide_howto_og_title"),
      description: t("guide_howto_og_desc"),
      url,
      images: [`${SITE_URL}/og-image.jpg`],
    },
    twitter: {
      card: "summary_large_image",
      title: t("guide_howto_twitter_title"),
      description: t("guide_howto_twitter_desc"),
      images: [`${SITE_URL}/og-image.jpg`],
    },
  };
}

export default async function HowToGetTherePage() {
  const t = await getTranslations();
  const url = `${SITE_URL}${PATH}`;

  return (
    <div className={styles["guide-page"]}>
      <Breadcrumbs
        items={[
          { name: t("breadcrumb_home"), url: `${SITE_URL}/` },
          { name: t("guide_howto_breadcrumb"), url },
        ]}
      />

      <div className={styles["guide-hero"]} style={{ backgroundImage: "url('/img/bg.webp')" }}>
        <h1>{t("guide_howto_h1")}</h1>
      </div>

      <div className={styles["guide-content"]}>
        <p>{t("guide_howto_intro_p")}</p>

        <h2>{t("guide_howto_route_h2")}</h2>
        <ol>
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <li key={i}>
              <strong>{t(`guide_howto_route_li${i}_bold`)}</strong> — {t(`guide_howto_route_li${i}_text`)}
            </li>
          ))}
        </ol>

        <div className={styles["highlight-box"]}>
          <p>{t("guide_howto_highlight")}</p>
        </div>

        <h2>{t("guide_howto_transport_h2")}</h2>

        <h3>{t("guide_howto_option1_h3")}</h3>
        <p>{t("guide_howto_option1_p")}</p>

        <h3>{t("guide_howto_option2_h3")}</h3>
        <p>{t("guide_howto_option2_p")}</p>

        <h3>{t("guide_howto_option3_h3")}</h3>
        <p>{t("guide_howto_option3_p")}</p>

        <h2>{t("guide_howto_tips_h2")}</h2>
        <ul>
          {[1, 2, 3, 4, 5].map((i) => (
            <li key={i}>
              <strong>{t(`guide_howto_tips_li${i}_bold`)}</strong> — {t(`guide_howto_tips_li${i}_text`)}
            </li>
          ))}
        </ul>

        <h2>{t("guide_howto_distance_h2")}</h2>
        <ul>
          <li>{t("guide_howto_distance_li1")}</li>
          <li>{t("guide_howto_distance_li2")}</li>
          <li>{t("guide_howto_distance_li3")}</li>
          <li>{t("guide_howto_distance_li4")}</li>
          <li>
            <strong>{t("guide_howto_distance_li5")}</strong>
          </li>
        </ul>

        <div className={styles["cta-section"]}>
          <p>{t("guide_howto_cta")}</p>
          <Link href="/white-desert-tour-from-cairo" className={styles["cta-button"]}>
            {t("guide_howto_cta_button")}
          </Link>
        </div>
      </div>
    </div>
  );
}
