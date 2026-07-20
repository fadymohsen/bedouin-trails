"use client";

import { useState } from "react";
import { FaStar } from "react-icons/fa6";
import { useTranslations } from "next-intl";
import styles from "./call-to-action.module.scss";

export function ExperienceCTA({ onTriggerRating }: { onTriggerRating: () => void }) {
  const t = useTranslations();
  const [hover, setHover] = useState(0);

  return (
    <section className={styles["experience-cta"]}>
      <div className={styles["cta-overlay"]}>
        <div className={styles["cta-content"]}>
          <h2 className={styles["cta-title"]}>{t("share_your_siwa_experience")}</h2>
          <p className={styles["cta-description"]}>{t("experience_cta_description")}</p>

          <div className={styles["cta-stars"]}>
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={styles["star-icon"]}
                color={i + 1 <= hover ? "#ffc107" : "#e4e5e9"}
                onMouseEnter={() => setHover(i + 1)}
                onMouseLeave={() => setHover(0)}
                onClick={onTriggerRating}
                style={{ cursor: "pointer", transition: "color 200ms" }}
              />
            ))}
          </div>

          <button className={styles["cta-button"]} onClick={onTriggerRating}>
            {t("rate_us_now")}
          </button>
        </div>
      </div>
    </section>
  );
}
