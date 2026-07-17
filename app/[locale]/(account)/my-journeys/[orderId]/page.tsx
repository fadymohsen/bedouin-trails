import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { getUserSession } from "@/lib/auth/session";
import { getOrderDetails } from "@/lib/services/orders";
import { NotFoundError, OwnershipError } from "@/lib/services/errors";
import { localize } from "@/lib/i18n/localized";
import { mapReviewForTestimonial } from "@/lib/mappers/misc";
import type { Locale } from "@/lib/i18n/config";
import OrderDetailClient from "@/components/trip-detail/order-detail-client";

export const metadata: Metadata = {
  title: "My Journey | Bedouin Trails",
  robots: { index: false, follow: false },
};

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export default async function OrderDetailPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  const session = await getUserSession();
  const locale = (await getLocale()) as Locale;

  let order;
  try {
    order = await getOrderDetails(Number(orderId), session!.uid);
  } catch (err) {
    if (err instanceof NotFoundError || err instanceof OwnershipError) notFound();
    throw err;
  }

  const trip = order.trap;
  const name = localize(trip.nameEn, trip.nameAr, locale);
  const interfaceFrom = localize(trip.interfaceFromEn, trip.interfaceFromAr, locale);
  const interfaceTo = localize(trip.interfaceToEn, trip.interfaceToAr, locale);
  const images = trip.galleries.map((g) => g.image);
  const days = trip.trapDays.map((day) => ({
    dayNumber: day.dayNumber,
    cards: day.cards.map((card) => ({
      id: card.id,
      title: localize(card.titleEn, card.titleAr, locale),
      description: localize(card.descriptionEn ?? "", card.descriptionAr, locale),
      image: card.image,
    })),
  }));
  const reviews = order.reviews.map(mapReviewForTestimonial);

  return (
    <OrderDetailClient
      orderId={order.id}
      status={order.status}
      tripName={name}
      interfaceFrom={interfaceFrom}
      interfaceTo={interfaceTo}
      images={images}
      days={days}
      reviews={reviews}
      booking={{
        firstName: order.firstName,
        lastName: order.lastName,
        email: order.email,
        phone: order.phone,
        numberOfAdults: order.numberOfAdults,
        numberOfChildren: order.numberOfChildren,
        startDate: formatDate(order.startDate),
        endDate: formatDate(order.endDate),
        description: order.description,
      }}
    />
  );
}
