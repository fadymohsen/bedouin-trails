import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { FaFacebook, FaInstagram, FaWhatsapp, FaEnvelope } from "react-icons/fa";
import PageHero from "@/components/page-hero/page-hero";
import ContactForm from "@/components/contact/contact-form";
import styles from "@/components/contact/contact.module.scss";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://bedouintrails.com";

export const metadata: Metadata = {
  title: "Contact Bedouin Trails | Book White Desert Safari Tours from Cairo",
  description:
    "Contact Bedouin Trails to book your White Desert safari tour from Cairo, Egypt desert tours, camel treks, desert trekking adventures, and multi-day desert treks to Bahariya Oasis, Siwa Oasis, and the Western Desert of Egypt.",
  keywords:
    "White Desert Egypt, White Desert Safari, White Desert Camping, Egypt Desert Tour, Egypt Safari Tours, Bahariya Oasis Tour, Western Desert Egypt, Desert Trekking Egypt, Camel Trek Egypt, White Desert tour from Cairo, Black Desert Egypt tour, 2 day White Desert tour Egypt, Multi Day Desert Trek, Sahara Hiking Tour, Desert Yoga Retreat Egypt, Meditation Retreat Egypt, Silent Retreat Desert, Djara Cave Western Desert",
  alternates: {
    canonical: `${SITE_URL}/contact`,
    languages: { en: `${SITE_URL}/contact`, ar: `${SITE_URL}/contact`, "x-default": `${SITE_URL}/contact` },
  },
  openGraph: {
    title: "Contact Bedouin Trails | Book White Desert Safari Tours",
    description:
      "Contact Bedouin Trails to book White Desert safari tours, Egypt desert tours, camel treks, and multi-day adventures from Cairo.",
    url: `${SITE_URL}/contact`,
    images: [`${SITE_URL}/og-image.jpg`],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Bedouin Trails | Book Desert Safari Tours",
    description:
      "Contact Bedouin Trails to book White Desert safari tours, Egypt desert tours, and multi-day desert treks from Cairo.",
    images: [`${SITE_URL}/og-image.jpg`],
  },
};

export default async function ContactPage() {
  const t = await getTranslations();

  return (
    <div className={styles.contactPage}>
      <PageHero title={t("contact_hero_title")} image="/img/contact-bg.webp" eyebrow={t("contact")} />

      <div className={styles.grid}>
        <div className={styles.infoCard}>
          <h2>{t("contact_experience_title")}</h2>
          <p>{t("contact_experience_text")}</p>

          <div className={styles.infoLinks}>
            <a href="https://wa.link/qtrpve/" target="_blank" rel="noopener noreferrer">
              <FaWhatsapp size={20} /> +20 10 02717380
            </a>
            <a href="mailto:info@bedouintrails.com">
              <FaEnvelope size={20} /> info@bedouintrails.com
            </a>
          </div>

          <a
            className={styles.mapLink}
            href="https://www.google.com/maps?q=28.345849,28.8724675&z=17&hl=en"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/img/googlemaps.webp" alt="Bedouin Trails office location, Cairo, Egypt" loading="lazy" />
          </a>

          <div className={styles.socialRow}>
            <a
              className={styles.socialButton}
              href="https://wa.link/qtrpve/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
            >
              <FaWhatsapp />
            </a>
            <a
              className={styles.socialButton}
              href="https://www.instagram.com/the.white.and.black.desert?igsh=aHdjbzB6ajJ5dTBk"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
            <a
              className={styles.socialButton}
              href="https://www.facebook.com/profile.php?id=61587717913002"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <FaFacebook />
            </a>
          </div>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
