"use client";

import { useEffect, useState } from "react";
import { Link } from "@/lib/i18n/navigation";
import { FaArrowRight } from "react-icons/fa";
import { useTranslations } from "next-intl";
import styles from "./carousel.module.scss";

export type HeroSlide = {
  image: string;
  title: string;
  description: string;
};

export type HeroFeaturedTrip = {
  slug: string;
  name: string;
  image: string | null;
};

type HeroCarouselProps = {
  slides: HeroSlide[];
  ctaHref?: string;
  featuredTrip?: HeroFeaturedTrip | null;
};

export default function HeroCarousel({ slides, ctaHref = "/journeys", featuredTrip }: HeroCarouselProps) {
  const t = useTranslations();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) return null;

  const active = slides[activeIndex];

  return (
    <div className={styles.heroContainer}>
      <div className={styles.mainBg}>
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`${styles.bgLayer} ${index === activeIndex ? styles.active : ""}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          />
        ))}
      </div>

      <div className={styles.mainContent}>
        {slides.map((slide, index) => (
          <div key={index} className={`${styles.contentItem} ${index === activeIndex ? styles.active : styles.exit}`}>
            <h1>{slide.title}</h1>
            <p>{slide.description}</p>
          </div>
        ))}
        <Link href={ctaHref} className={styles.heroCta}>
          {t("begin_your_journey")}
        </Link>
      </div>

      {featuredTrip && (
        <Link href={`/journeys/${featuredTrip.slug}`} className={styles.nextDeparture}>
          <img src={featuredTrip.image || "/img/adventure.webp"} alt={featuredTrip.name} />
          <div className={styles.nextDepartureText}>
            <span className={styles.eyebrow}>{t("featured_journeys")}</span>
            <strong>{featuredTrip.name}</strong>
            <span className={styles.nextDepartureLink}>
              {t("view_details")} <FaArrowRight size={11} />
            </span>
          </div>
        </Link>
      )}

      {slides.length > 1 && (
        <div className={styles.heroDots}>
          {slides.map((slide, index) => (
            <button
              key={index}
              className={`${styles.heroDot} ${index === activeIndex ? styles.active : ""}`}
              onClick={() => setActiveIndex(index)}
              aria-label={slide.title || `Slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
