"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import Card from "@/components/card/card";
import type { TripCardData } from "@/lib/mappers/trap";
import styles from "./carousel.module.scss";

// Swiper's loop mode needs enough real slides to clone from — at 4 slides
// visible (the 1440px breakpoint) a handful of trips isn't enough, and it
// falls back to a non-looping strip with a dead gap where the clones would
// have gone. Repeat the data until there's a safe minimum to loop with.
const MIN_SLIDES_FOR_LOOP = 12;

function withLoopableCount(data: TripCardData[]) {
  if (data.length === 0 || data.length >= MIN_SLIDES_FOR_LOOP) return data;
  const repeats = Math.ceil(MIN_SLIDES_FOR_LOOP / data.length);
  return Array.from({ length: repeats }, () => data).flat();
}

export default function TripCarousel({ data }: { data: TripCardData[] }) {
  const slides = withLoopableCount(data);

  return (
    <div className={styles.marqueeWrapper}>
      <Swiper
        modules={[Autoplay, FreeMode]}
        slidesPerView={1.2}
        spaceBetween={40}
        loop
        freeMode
        speed={8000}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
          stopOnLastSlide: false,
        }}
        allowTouchMove
        breakpoints={{
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1440: { slidesPerView: 4 },
        }}
        onTouchStart={(swiper) => {
          swiper.autoplay.stop();
          swiper.autoplay.start();
        }}
        onTouchEnd={(swiper) => swiper.autoplay.start()}
        onTouchMove={(swiper) => swiper.autoplay.start()}
        className="steady-swiper"
      >
        {slides.map((item, index) => (
          <SwiperSlide key={`${item.id}-${index}`}>
            <Card data={item} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
