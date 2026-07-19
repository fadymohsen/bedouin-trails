import Image from "next/image";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { FaFacebook, FaInstagram, FaWhatsapp, FaEnvelope } from "react-icons/fa";
import PageHero from "@/components/page-hero/page-hero";
import ContactForm from "@/components/contact/contact-form";
import styles from "@/components/contact/contact.module.scss";

import { SITE_URL, buildAlternates } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  const title = t("meta_title_contact");
  const description = t("meta_desc_contact");
  const url = `${SITE_URL}/contact`;
  return {
    title, description,
    alternates: buildAlternates("/contact"),
    openGraph: { title, description, url, images: [`${SITE_URL}/og-image.jpg`] },
    twitter: { card: "summary_large_image", title, description, images: [`${SITE_URL}/og-image.jpg`] },
  };
}

export default async function ContactPage() {
  const t = await getTranslations();

  const contactJsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: t("meta_title_contact"),
    description: t("meta_desc_contact"),
    url: `${SITE_URL}/contact`,
    mainEntity: {
      "@type": "TravelAgency",
      name: "Bedouin Trails",
      url: SITE_URL,
      telephone: "+20-10-02717380",
      email: "info@bedouintrails.com",
      address: { "@type": "PostalAddress", addressCountry: "EG", addressLocality: "Cairo" },
    },
  };

  return (
    <div className={styles.contactPage}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }} />
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
            <Image src="/img/googlemaps.webp" alt="Bedouin Trails office location, Cairo, Egypt" loading="lazy" width={600} height={300} />
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
