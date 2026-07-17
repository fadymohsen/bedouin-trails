"use client";

import { useEffect, useState, useTransition } from "react";
import { useLocale } from "next-intl";
import { FaGlobe, FaTimes } from "react-icons/fa";
import { useRouter, usePathname } from "@/lib/i18n/navigation";
import { locales, type Locale } from "@/lib/i18n/config";
import styles from "./language-switcher.module.scss";

const LANGUAGE_META: Record<Locale, { nativeName: string; flag: string }> = {
  ar: { nativeName: "العربية", flag: "sa" },
  en: { nativeName: "English", flag: "gb" },
  pt: { nativeName: "Português", flag: "br" },
  zh: { nativeName: "中文", flag: "cn" },
  es: { nativeName: "Español", flag: "es" },
  nl: { nativeName: "Nederlands", flag: "nl" },
  it: { nativeName: "Italiano", flag: "it" },
  de: { nativeName: "Deutsch", flag: "de" },
  fr: { nativeName: "Français", flag: "fr" },
};

export default function LanguageSwitcher() {
  const activeLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  function handleLanguageChange(lang: Locale) {
    setIsOpen(false);
    startTransition(() => {
      router.replace(pathname, { locale: lang });
    });
  }

  return (
    <>
      <button className={styles.globeButton} onClick={() => setIsOpen(true)} aria-label="Select Language">
        <FaGlobe size={22} />
      </button>

      {isOpen && (
        <div className={styles.overlay} onClick={() => setIsOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={() => setIsOpen(false)} aria-label="Close">
              <FaTimes />
            </button>
            <h2>Select Language</h2>
            <div className={styles.languageGrid}>
              {locales.map((code) => {
                const meta = LANGUAGE_META[code];
                return (
                  <button
                    key={code}
                    className={`${styles.languageOption} ${activeLocale === code ? styles.active : ""}`}
                    onClick={() => handleLanguageChange(code)}
                  >
                    <img
                      src={`https://flagcdn.com/w80/${meta.flag}.png`}
                      srcSet={`https://flagcdn.com/w160/${meta.flag}.png 2x`}
                      alt={`${meta.nativeName} flag`}
                      className={styles.flagImg}
                      loading="lazy"
                    />
                    <span className={styles.langName}>{meta.nativeName}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
