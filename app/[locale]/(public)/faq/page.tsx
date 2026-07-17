import { getTranslations, getLocale } from "next-intl/server";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import type { Locale } from "@/lib/i18n/config";
import { mapFaq } from "@/lib/mappers/misc";
import Breadcrumbs from "@/components/breadcrumbs/breadcrumbs";
import PageHero from "@/components/page-hero/page-hero";
import FaqAccordionMulti from "@/components/faq-page/faq-accordion-multi";
import styles from "@/components/faq-page/faq-page.module.scss";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://bedouintrails.com";

export const metadata: Metadata = {
  title: "FAQ | Bedouin Trails - Desert Safari in Bahariya & Siwa Oasis",
  description:
    "Frequently asked questions about White Desert safari tours, Egypt desert tours, Bahariya Oasis tours, Siwa Oasis, White Desert camping, desert trekking, camel treks, multi-day desert treks, booking, pricing, and what to expect on your adventure with Bedouin Trails.",
  keywords:
    "White Desert Egypt FAQ, White Desert Safari, White Desert Camping, Egypt Desert Tour, Egypt Safari Tours, Bahariya Oasis Tour, Western Desert Egypt, Desert Trekking Egypt, Camel Trek Egypt, White Desert tour from Cairo, Black Desert Egypt tour, 2 day White Desert tour Egypt, Multi Day Desert Trek, Djara Cave Western Desert, Desert Yoga Retreat Egypt",
  alternates: {
    canonical: `${SITE_URL}/faq`,
    languages: { en: `${SITE_URL}/faq`, ar: `${SITE_URL}/faq`, "x-default": `${SITE_URL}/faq` },
  },
  openGraph: {
    title: "FAQ | Bedouin Trails",
    description:
      "Frequently asked questions about White Desert safari tours, Egypt desert tours, Bahariya Oasis, Siwa Oasis, White Desert camping, desert trekking, and booking.",
    url: `${SITE_URL}/faq`,
    images: [`${SITE_URL}/og-image.jpg`],
  },
};

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
