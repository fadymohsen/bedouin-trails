import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";
import { useTranslations } from "next-intl";
import { FaFacebook, FaInstagram, FaWhatsapp, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import styles from "./footer.module.scss";

export default function Footer() {
  const t = useTranslations();

  return (
    <footer className={styles.footer} id="contact">
      <div className={styles.mountainDivider} />
      <div className={styles.wrap}>
        <Link href="/" className={styles.footerLogoRowCentered}>
          <Image src="/img/logo.png" alt="Bedouin Trails Logo" width={160} height={160} />
        </Link>
        <div className={styles.columns}>
          <div className={styles.col}>
            <h5 className={styles.colTitle}>{t("navigation")}</h5>
            <nav className={styles.footerMenu}>
              <Link href="/">{t("home")}</Link>
              <Link href="/about">{t("about")}</Link>
              <Link href="/contact">{t("contact")}</Link>
            </nav>
          </div>

          <div className={styles.col}>
            <h5 className={styles.colTitle}>{t("explore")}</h5>
            <nav className={styles.footerMenu}>
              <Link href="/journeys">{t("safari_trips")}</Link>
              <Link href="/blogs">{t("blogs")}</Link>
              <Link href="/contact">{t("contact")}</Link>
            </nav>
          </div>

          <div className={styles.col}>
            <h5 className={styles.colTitle}>{t("contact_us")}</h5>
            <p className={styles.colText}>{t("about_footer_title")}</p>
            <div className={styles.contactLinks}>
              <a href="https://wa.link/qtrpve/" target="_blank" rel="noopener noreferrer">
                <FaWhatsapp /> +20 10 02717380
              </a>
              <a href="mailto:info@bedouintrails.com">
                <FaEnvelope /> info@bedouintrails.com
              </a>
              <a
                href="https://www.google.com/maps?q=28.345849,28.8724675&z=17&hl=en"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaMapMarkerAlt /> Egypt - Cairo
              </a>
            </div>
          </div>
        </div>

        <div className={styles.socialIcons}>
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

        <div className={styles.copyrights}>
          <p>{t("terms_privacy")}</p>
        </div>
      </div>
    </footer>
  );
}
