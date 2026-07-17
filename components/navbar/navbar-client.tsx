"use client";

import { useEffect, useRef, useState } from "react";
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
    { path: "/my-journeys", label: t("my_journeys") },
    { path: "/faq", label: t("faq") },
    { path: "/contact", label: t("contact") },
  ];

  const isActive = (path: string) => pathname === path;
  const activeLink = navLinks.find((link) => isActive(link.path));
  const activeLinkLabel = activeLink?.label ?? t("home");
  const navDirection = isRtl(locale) ? "rtl" : "ltr";

  return (
    <div className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/">
          <img src="/img/logo.png" alt="Bedouin Trails" width={50} height={50} />
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
        <span className={styles.navDropdown__activeLabel}>{activeLinkLabel}</span>
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

            <div className={styles.navDropdown__divider} />

            <div className={styles.navDropdown__auth}>
              {user ? (
                <Link
                  href="/profile"
                  className={styles.navDropdown__profile}
                  onClick={() => setDropdownOpen(false)}
                >
                  <img src={user.image || "/img/profile-img.png"} alt={user.firstName || "User"} />
                  <span>{user.firstName}</span>
                  <FaBars size={18} />
                </Link>
              ) : (
                <Link href="/auth" className={styles.navDropdown__login} onClick={() => setDropdownOpen(false)}>
                  {t("login")}
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      <div className={styles.profile}>
        {user ? (
          <Link href="/profile" className={styles.userProfile}>
            <IoSettingsOutline size={30} />
            <img src={user.image || "/img/profile-img.png"} alt={user.firstName || "User Profile"} />
          </Link>
        ) : (
          <Link href="/auth" className={styles.loginBtnNav}>
            {t("login")}
          </Link>
        )}
        <LanguageSwitcher />
      </div>
    </div>
  );
}
