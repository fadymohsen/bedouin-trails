import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { listActiveTraps } from "@/lib/services/traps";
import { mapTrapForCard } from "@/lib/mappers/trap";
import type { Locale } from "@/lib/i18n/config";
import Breadcrumbs from "@/components/breadcrumbs/breadcrumbs";
import JourneysFilterGrid from "@/components/journeys/journeys-filter-grid";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://bedouintrails.com";

export const metadata: Metadata = {
  title: "Desert Safari Tours & Adventure Journeys | Bedouin Trails",
  description:
    "Browse all White Desert safari tours, Egypt desert tours, multi-day desert treks, camel treks, and desert camping adventures. Explore Bahariya Oasis, Siwa Oasis, White Desert, Black Desert, and Djara Cave in Egypt's Western Desert with Bedouin Trails.",
  keywords:
    "White Desert Egypt, White Desert Safari, White Desert Camping, Egypt Desert Tour, Egypt Safari Tours, Bahariya Oasis Tour, Western Desert Egypt, Desert Trekking Egypt, Multi Day Desert Trek, Camel Trek Egypt, White Desert tour from Cairo, Djara Cave Western Desert, Black Desert Egypt tour, 2 day White Desert tour Egypt, Sahara Hiking Tour, Desert Yoga Retreat Egypt, Meditation Retreat Egypt, Silent Retreat Desert",
  alternates: {
    canonical: `${SITE_URL}/journeys`,
    languages: { en: `${SITE_URL}/journeys`, ar: `${SITE_URL}/journeys`, "x-default": `${SITE_URL}/journeys` },
  },
  openGraph: {
    title: "Desert Safari Tours & Adventure Journeys | Bedouin Trails",
    description:
      "Browse White Desert safari tours, Egypt desert tours, multi-day desert treks, camel treks, and camping adventures in Bahariya Oasis, Siwa Oasis & the Western Desert.",
    url: `${SITE_URL}/journeys`,
    images: [`${SITE_URL}/og-image.jpg`],
  },
};

export default async function JourneysPage() {
  const locale = (await getLocale()) as Locale;
  const { traps, facets } = await listActiveTraps();
  const trips = traps.map((trap) => mapTrapForCard(trap, locale));

  const itemListJsonLd =
    trips.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Desert Safari Tours & Adventure Journeys",
          description: "Browse all White Desert safari tours, Egypt desert tours, and desert camping adventures by Bedouin Trails.",
          numberOfItems: trips.length,
          itemListElement: trips.map((trip, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": "TouristTrip",
              name: trip.name,
              url: `${SITE_URL}/journeys/${trip.slug}`,
              ...(trip.rate > 0
                ? {
                    aggregateRating: {
                      "@type": "AggregateRating",
                      ratingValue: trip.rate,
                      bestRating: 5,
                      worstRating: 1,
                    },
                  }
                : {}),
            },
          })),
        }
      : null;

  return (
    <div>
      <Breadcrumbs
        items={[
          { name: "Home", url: `${SITE_URL}/` },
          { name: "Journeys", url: `${SITE_URL}/journeys` },
        ]}
      />
      {itemListJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      )}
      <JourneysFilterGrid trips={trips} durations={facets.durations} />
    </div>
  );
}
