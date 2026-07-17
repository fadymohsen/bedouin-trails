"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/lib/i18n/navigation";
import { useTranslations } from "next-intl";
import styles from "./carousel.module.scss";

type TripHeroCarouselProps = {
  images: string[];
  isOrder?: boolean;
  orderStatus?: string;
  onCancel?: () => void;
};

export default function TripHeroCarousel({ images, isOrder = false, orderStatus, onCancel }: TripHeroCarouselProps) {
  const t = useTranslations();
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const slides = images.length > 0 ? images : ["/img/adventure.webp"];

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const canCancel = isOrder && orderStatus !== "cancelled" && orderStatus !== "paid" && orderStatus !== "accepted";

  return (
    <div className={styles.heroContainer}>
      <div className={styles.mainBg}>
        {slides.map((image, index) => (
          <div
            key={index}
            className={`${styles.bgLayer} ${index === activeIndex ? styles.active : ""}`}
            style={{
              backgroundImage: `linear-gradient(0deg, rgba(30, 30, 30, 0.16), rgba(30, 30, 30, 0.16)), url(${image})`,
            }}
          >
            <div className={styles.card_nav}>
              <div className={styles["content-logo"]}>
                <img src="/img/bedouin-trail.webp" alt="Bedouin Trail Logo" loading="lazy" />
              </div>
              <div className={styles.backBtn}>
                <button className={styles.btn} onClick={() => router.back()} aria-label="Back" />
                {canCancel && onCancel && (
                  <button onClick={onCancel} className={styles["cancell-btn"]}>
                    {t("cancel")}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.thumbnailTrack}>
        {slides.map((image, index) => {
          let position = index - activeIndex;
          if (position < 0) position += slides.length;
          const posClass =
            position === 0
              ? styles.pos0
              : position === 1
                ? styles.pos1
                : position === 2
                  ? styles.pos2
                  : styles.posOther;

          return (
            <div key={index} className={`${styles.thumbNode} ${posClass}`} onClick={() => setActiveIndex(index)}>
              <div className={styles.imgBox}>
                <img src={image} alt="Desert safari slide" />
              </div>
              {position === 0 && <div className={styles.activeFrame} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
