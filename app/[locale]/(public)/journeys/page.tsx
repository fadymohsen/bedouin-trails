import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { listActiveTraps } from "@/lib/services/traps";
import { mapTrapForCard } from "@/lib/mappers/trap";
import type { Locale } from "@/lib/i18n/config";
import Breadcrumbs from "@/components/breadcrumbs/breadcrumbs";
import JourneysFilterGrid from "@/components/journeys/journeys-filter-grid";

import { SITE_URL, buildAlternates } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  const title = t("meta_title_journeys");
  const description = t("meta_desc_journeys");
  const url = `${SITE_URL}/journeys`;
  return {
    title, description,
    alternates: buildAlternates("/journeys"),
    openGraph: { title, description, url, images: [`${SITE_URL}/og-image.jpg`] },
  };
}

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
