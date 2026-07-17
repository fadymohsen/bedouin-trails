import { Link } from "@/lib/i18n/navigation";
import { FaArrowRight } from "react-icons/fa";
import { getTranslations, getLocale } from "next-intl/server";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import type { Locale } from "@/lib/i18n/config";
import { mapAboutUs } from "@/lib/mappers/misc";
import Breadcrumbs from "@/components/breadcrumbs/breadcrumbs";
import PageHero from "@/components/page-hero/page-hero";
import ScrollReveal from "@/components/scroll-reveal/scroll-reveal";
import styles from "@/components/about/about.module.scss";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://bedouintrails.com";

export const metadata: Metadata = {
  title: "About Bedouin Trails | White Desert Safari Tour Company in Egypt",
  description:
    "Learn about Bedouin Trails, an Egyptian desert safari tour company offering White Desert safari tours, camel treks, desert trekking, and multi-day desert tours from Cairo to Bahariya Oasis, Siwa Oasis, and the Western Desert of Egypt.",
  keywords:
    "White Desert Egypt, White Desert Safari, Egypt Desert Tour, Egypt Safari Tours, Bahariya Oasis Tour, Western Desert Egypt, Desert Trekking Egypt, Camel Trek Egypt, White Desert tour from Cairo, Black Desert Egypt tour, Sahara Hiking Tour, Multi Day Desert Trek, Desert Yoga Retreat Egypt, Meditation Retreat Egypt, Silent Retreat Desert, Djara Cave Western Desert, White Desert Camping, 2 day White Desert tour Egypt",
  alternates: {
    canonical: `${SITE_URL}/about`,
    languages: { en: `${SITE_URL}/about`, ar: `${SITE_URL}/about`, "x-default": `${SITE_URL}/about` },
  },
  openGraph: {
    title: "About Bedouin Trails | White Desert Safari Tour Company in Egypt",
    description:
      "Learn about Bedouin Trails, offering White Desert safari tours, camel treks, desert trekking, and multi-day desert tours from Cairo to Bahariya Oasis, Siwa Oasis & the Western Desert.",
    url: `${SITE_URL}/about`,
    images: [`${SITE_URL}/og-image.jpg`],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Bedouin Trails | White Desert Safari Tour Company",
    description:
      "Learn about Bedouin Trails, offering White Desert safari tours, camel treks, and multi-day desert tours in Egypt's Western Desert.",
    images: [`${SITE_URL}/og-image.jpg`],
  },
};

export default async function AboutPage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations();

  const [entries, trapCount] = await Promise.all([
    prisma.aboutUs.findMany({ orderBy: { id: "asc" } }),
    prisma.trap.count(),
  ]);
  const aboutData = entries.map((entry) => mapAboutUs(entry, locale));

  return (
    <div className={styles.aboutPage}>
      <Breadcrumbs
        items={[
          { name: "Home", url: `${SITE_URL}/` },
          { name: "About", url: `${SITE_URL}/about` },
        ]}
      />

      <PageHero title={t("about_hero_title")} image="/img/western-desert-hero.webp" eyebrow={t("about")} />

      <ScrollReveal as="div" className={styles.trustBar}>
        <div className={styles.trustItem}>
          <h3>+{trapCount}</h3>
          <p>{t("number_of_destinations")}</p>
        </div>
        <div className={styles.trustItem}>
          <h3>+1000</h3>
          <p>{t("our_clients")}</p>
        </div>
        <div className={styles.trustItem}>
          <h3>+5</h3>
          <p>{t("experience_years")}</p>
        </div>
      </ScrollReveal>

      {aboutData.map((item, index) => (
        <ScrollReveal
          as="section"
          key={item.id}
          className={`${styles.storyRow} ${index % 2 !== 0 ? styles.reverse : ""}`}
        >
          <div className={styles.imageCol}>
            <img src={item.image ?? "/img/adventure3.webp"} alt={item.title} loading="lazy" />
          </div>
          <div className={styles.textCol}>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
          </div>
        </ScrollReveal>
      ))}

      <ScrollReveal as="div" className={styles.ctaBanner}>
        <div className={styles.ctaCard}>
          <h2>{t("about_footer_title")}</h2>
          <p>{t("about_footer_text")}</p>
          <Link href="/journeys" className={styles.pillButton}>
            {t("all_tours")} <FaArrowRight size={13} />
          </Link>
        </div>
      </ScrollReveal>
    </div>
  );
}
