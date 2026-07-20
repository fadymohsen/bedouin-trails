"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";
import { usePathname } from "@/lib/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { IoSettingsOutline } from "react-icons/io5";
import { FaBars } from "react-icons/fa";
import LanguageSwitcher from "@/components/language-switcher/language-switcher";
import { isRtl, type Locale } from "@/lib/i18n/config";
import styles from "./navbar.module.scss";

type NavbarUser = { firstName: string; image: string | null } | null;

export default function NavbarClient({ user }: { user: NavbarUser }) {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setDropdownOpen(false);
  }, [pathname]);

  const navLinks = [
    { path: "/", label: t("home") },
    { path: "/about", label: t("about") },
    { path: "/journeys", label: t("journeys") },
    { path: "/blogs", label: t("blogs") },
    { path: "/faq", label: t("faq") },
    { path: "/contact", label: t("contact") },
  ];

  const isActive = (path: string) => pathname === path;
  const activeLink = navLinks.find((link) => isActive(link.path));
  const activeLinkLabel = activeLink?.label ?? t("home");
  const navDirection = isRtl(locale) ? "rtl" : "ltr";

  return (
    <header className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/">
          <Image src="/img/logo.png" alt="Bedouin Trails" width={50} height={50} />
        </Link>
      </div>

      <div className={`${styles.navLinks} ${styles.navLinksDesktop}`} style={{ direction: navDirection }}>
        {navLinks.map((link) => (
          <div key={link.path} className={`${styles.navLink} ${isActive(link.path) ? styles.active : ""}`}>
            <Link href={link.path}>{link.label}</Link>
          </div>
        ))}
      </div>

      <div className={styles.navDropdown} ref={dropdownRef}>
        <button
          className={`${styles.navDropdown__trigger} ${dropdownOpen ? styles.open : ""}`}
          onClick={() => setDropdownOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          <FaBars size={14} />
        </button>
        <LanguageSwitcher />
        {dropdownOpen && (
          <div className={styles.navDropdown__menu} style={{ direction: navDirection }}>
            <div className={styles.navDropdown__menuHeader}>
              <div className={styles.navDropdown__menuLogo}>
                <Image src="/img/logo.png" alt="Bedouin Trails" width={40} height={40} />
              </div>
              <div className={styles.navDropdown__menuHeaderActions}>
                <LanguageSwitcher />
                <button
                  className={styles.navDropdown__closeBtn}
                  onClick={() => setDropdownOpen(false)}
                  aria-label="Close navigation"
                >
                  <span style={{ fontSize: "32px", color: "white", lineHeight: 1 }}>&times;</span>
                </button>
              </div>
            </div>

            <div className={styles.navDropdown__links}>
              {navLinks.map((link) => (
                <div
                  key={link.path}
                  className={`${styles.navDropdown__item} ${isActive(link.path) ? styles.active : ""}`}
                >
                  <Link href={link.path} onClick={() => setDropdownOpen(false)}>
                    {link.label}
                  </Link>
                </div>
              ))}
            </div>

            {/* Auth block and divider removed */}
          </div>
        )}
      </div>

      <div className={styles.profile}>
        {/* Profile and login button actions hidden */}
        <LanguageSwitcher />
      </div>
    </header>
  );
}
