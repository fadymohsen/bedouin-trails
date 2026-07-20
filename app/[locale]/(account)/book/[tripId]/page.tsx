import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { localize } from "@/lib/i18n/localized";
import { getLocalFallbackImage } from "@/lib/image-fallback";
import type { Locale } from "@/lib/i18n/config";
import BookFormClient from "@/components/book-form/book-form-client";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return {
    title: t("meta_title_book"),
    description: t("meta_desc_book"),
    robots: { index: false, follow: false },
  };
}

export default async function BookTripPage({ params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params;
  const locale = (await getLocale()) as Locale;

  const trap = await prisma.trap.findUnique({
    where: { id: Number(tripId) },
    include: { galleries: { take: 1, orderBy: { id: "asc" } } },
  });
  if (!trap) notFound();

  const trip = {
    id: trap.id,
    name: localize(trap.nameEn, trap.nameAr, locale),
    image: getLocalFallbackImage(trap.galleries[0]?.image ?? null),
    description: localize(trap.descriptionEn ?? "", trap.descriptionAr, locale) || null,
  };

  return <BookFormClient trip={trip} trips={[]} />;
}
