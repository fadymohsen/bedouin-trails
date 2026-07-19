import { getTranslations, getLocale } from "next-intl/server";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import type { Locale } from "@/lib/i18n/config";
import { mapFaq } from "@/lib/mappers/misc";
import Breadcrumbs from "@/components/breadcrumbs/breadcrumbs";
import PageHero from "@/components/page-hero/page-hero";
import FaqAccordionMulti from "@/components/faq-page/faq-accordion-multi";
import styles from "@/components/faq-page/faq-page.module.scss";

import { SITE_URL, buildAlternates } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  const title = t("meta_title_faq");
  const description = t("meta_desc_faq");
  const url = `${SITE_URL}/faq`;
  return {
    title, description,
    alternates: buildAlternates("/faq"),
    openGraph: { title, description, url, images: [`${SITE_URL}/og-image.jpg`] },
    twitter: { card: "summary_large_image", title, description, images: [`${SITE_URL}/og-image.jpg`] },
  };
}

export default async function FaqPage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations();

  const rows = await prisma.commonQuestion.findMany({ orderBy: { createdAt: "asc" } });
  const faqs = rows.map((row) => mapFaq(row, locale));

  const faqJsonLd =
    faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        }
      : null;

  return (
    <div className={styles.faq}>
      <Breadcrumbs
        items={[
          { name: "Home", url: `${SITE_URL}/` },
          { name: "FAQ", url: `${SITE_URL}/faq` },
        ]}
      />
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}

      <PageHero title={t("faq_title")} image="/img/faq-bg.webp" eyebrow={t("faq")} />

      <div className={styles["faq-container"]}>
        <div className={styles["faq-accordion"]}>
          <FaqAccordionMulti faqs={faqs} />
        </div>
      </div>
    </div>
  );
}
