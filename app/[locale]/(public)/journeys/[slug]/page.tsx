import { notFound } from "next/navigation";
import { Link } from "@/lib/i18n/navigation";
import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { FaWhatsapp } from "react-icons/fa";
import { getTrapBySlug } from "@/lib/services/traps";
import { NotFoundError } from "@/lib/services/errors";
import { localize } from "@/lib/i18n/localized";
import { getLocalFallbackImage } from "@/lib/image-fallback";
import { mapReviewForTestimonial } from "@/lib/mappers/misc";
import { mapTrapForCard } from "@/lib/mappers/trap";
import { prisma } from "@/lib/prisma";
import type { Locale } from "@/lib/i18n/config";
import Breadcrumbs from "@/components/breadcrumbs/breadcrumbs";
import TripHeroCarousel from "@/components/carousel/trip-hero-carousel";
import TripDayViewer from "@/components/trip-detail/trip-day-viewer";
import TripCarousel from "@/components/carousel/trip-carousel";
import Card from "@/components/card/card";
import styles from "@/components/trip-detail/trip-detail.module.scss";

import { SITE_URL, buildAlternates } from "@/lib/seo";

async function loadTrip(slug: string) {
  try {
    return await getTrapBySlug(slug);
  } catch (err) {
    if (err instanceof NotFoundError) return null;
    throw err;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const trip = await loadTrip(slug);
  if (!trip) return {};

  const locale = (await getLocale()) as Locale;
  const name = localize(trip.nameEn, trip.nameAr, locale, trip.nameI18n);
  const url = `${SITE_URL}/journeys/${slug}`;
  const image = trip.galleries[0]?.image ?? `${SITE_URL}/og-image.jpg`;

  return {
    title: `${trip.metaTitle || name} | Bedouin Trails`,
    description:
      trip.metaDescription ||
      `${name} - ${localize(trip.interfaceFromEn, trip.interfaceFromAr, locale, trip.interfaceFromI18n)} → ${localize(trip.interfaceToEn, trip.interfaceToAr, locale, trip.interfaceToI18n)}. Book your spot now | Bedouin Trails`,
    alternates: buildAlternates(`/journeys/${slug}`),
    openGraph: {
      title: trip.metaTitle || name,
      description: trip.metaDescription || name,
      images: [image],
      url,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: trip.metaTitle || name,
      description: trip.metaDescription || name,
      images: [image],
    },
  };
}

export default async function TripDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const trip = await loadTrip(slug);
  if (!trip) notFound();

  const locale = (await getLocale()) as Locale;
  const t = await getTranslations();

  const name = localize(trip.nameEn, trip.nameAr, locale, trip.nameI18n);
  const interfaceFrom = localize(trip.interfaceFromEn, trip.interfaceFromAr, locale, trip.interfaceFromI18n);
  const interfaceTo = localize(trip.interfaceToEn, trip.interfaceToAr, locale, trip.interfaceToI18n);
  const url = `${SITE_URL}/journeys/${slug}`;
  
  const images = Array.from(
    new Set([
      ...trip.galleries.map((g) => getLocalFallbackImage(g.image)),
      ...trip.trapDays.flatMap((day) => day.cards.map((card) => card.image)).filter((img): img is string => img !== null).map(getLocalFallbackImage),
    ])
  );
  const reviews = trip.reviews.map(mapReviewForTestimonial);
  const days = trip.trapDays.map((day) => ({
    dayNumber: day.dayNumber,
    cards: day.cards.map((card) => ({
      id: card.id,
      title: localize(card.titleEn, card.titleAr, locale, card.titleI18n),
      description: localize(card.descriptionEn ?? "", card.descriptionAr, locale, card.descriptionI18n),
      image: getLocalFallbackImage(card.image),
    })),
  }));

  // Query 3 related trips (excluding current trip)
  const relatedTrips = await prisma.trap.findMany({
    where: {
      status: "active",
      slug: { not: slug },
    },
    include: {
      galleries: { take: 1, orderBy: { id: "asc" } },
    },
    take: 3,
    orderBy: { createdAt: "desc" },
  });
  const relatedCards = relatedTrips.map((trap) => mapTrapForCard(trap, locale));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name,
    description: trip.metaDescription || `${name} - ${interfaceFrom} → ${interfaceTo}`,
    image: images[0] ?? `${SITE_URL}/og-image.jpg`,
    url,
    touristType: "Adventure seekers, Nature lovers, Culture enthusiasts",
    itinerary: {
      "@type": "ItemList",
      numberOfItems: trip.duration,
      description: `${trip.duration} days from ${interfaceFrom} to ${interfaceTo}`,
    },
    provider: { "@type": "TravelAgency", name: "Bedouin Trails", url: SITE_URL },
    ...(trip.rate > 0 && reviews.length > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: trip.rate,
            reviewCount: reviews.length,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
  };

  return (
    <div className={styles.Card_page}>
      <Breadcrumbs
        items={[
          { name: "Home", url: `${SITE_URL}/` },
          { name: "Journeys", url: `${SITE_URL}/journeys` },
          { name, url },
        ]}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className={styles.Carousel}>
        <TripHeroCarousel images={images} />
      </div>

      <div className={styles["part-1"]}>
        <div className={styles.leftP}>
          <h1>{name}</h1>
          <div className={styles.dates}>
            <div className={styles.start}>
              <h3>{interfaceFrom}</h3>
              <p>{t("departure_point")}</p>
            </div>
            <div className={styles.end}>
              <h3>{interfaceTo}</h3>
              <p>{t("destination_point")}</p>
            </div>
          </div>
        </div>

        <div className={styles.rightP}>
          <div className={styles.bookingCard}>
            <h2>{t("have_questions_about_trip")}</h2>
            <p>{t("contact_us_now")}</p>
            <a target="_blank" href="https://wa.link/qtrpve/" className={styles.whatsappLink} rel="noopener noreferrer">
              <FaWhatsapp size={22} />
              <span>+20 10 02717380</span>
            </a>
            <Link href={`/book/${trip.id}`} className={styles.bookingBtn}>
              {t("book_your_spot_now")}
            </Link>
          </div>
        </div>
      </div>

      <div className={styles["part-2"]}>
        <TripDayViewer days={days} interfaceFrom={interfaceFrom} interfaceTo={interfaceTo} />
      </div>
      {relatedCards.length > 0 && (
        <div className={styles.relatedTripsSection}>
          <h2>{t("related_trips_title") || "Related Trips"}</h2>
          <div className={styles.relatedGrid}>
            {relatedCards.map((card) => (
              <Card key={card.id} data={card} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
