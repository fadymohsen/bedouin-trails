import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";
import { FaArrowRight, FaInstagram, FaCompass, FaBoxOpen, FaMapMarkedAlt } from "react-icons/fa";
import { getTranslations, getLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import type { Locale } from "@/lib/i18n/config";
import { mapTrapForCard } from "@/lib/mappers/trap";
import { mapSliderForHero, mapBlogForHomeSection, mapFaq, mapAboutUs, mapReviewForTestimonial } from "@/lib/mappers/misc";
import SafeImage from "@/components/safe-image/safe-image";
import HeroCarousel from "@/components/carousel/hero-carousel";
import TripCarousel from "@/components/carousel/trip-carousel";
import Card from "@/components/card/card";
import FaqAccordion from "@/components/faq-accordion/faq-accordion";
import ScrollReveal from "@/components/scroll-reveal/scroll-reveal";
import styles from "@/components/home/home.module.scss";

import { SITE_URL, buildAlternates } from "@/lib/seo";

export async function generateMetadata() {
  const t = await getTranslations();
  return {
    title: t("meta_title_home"),
    description: t("meta_desc_home"),
    alternates: buildAlternates("/"),
  };
}

const ACTIVITY_IMAGES = [
  { key: "recreational_trips", img: "/img/camel-ride.webp" },
  { key: "safari_trips", img: "/img/quad-bike.webp" },
  { key: "parties_events", img: "/img/events.webp" },
  { key: "therapeutic_lakes", img: "/img/salt-lake.webp" },
];

const WHY_CHOOSE_ICONS = [FaCompass, FaBoxOpen, FaMapMarkedAlt];

const HISTORY_LINKS = [
  { href: "/about", labelKey: "about" as const },
  { href: "/journeys", labelKey: "all_tours" as const },
  { href: "/blogs", labelKey: "blogs" as const },
];

export default async function HomePage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations();

  const [sliders, traps, spotlightTrap, blogs, faqs, aboutUsEntries, topReview, trapCount] =
    await Promise.all([
      prisma.slider.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.trap.findMany({
        where: { status: "active" },
        take: 10,
        orderBy: { createdAt: "desc" },
        include: { galleries: { take: 1, orderBy: { id: "asc" } }, reviews: { select: { stars: true } } },
      }),
      prisma.trap.findFirst({
        where: { status: "active" },
        orderBy: { countPeople: "desc" },
        include: { galleries: { take: 2, orderBy: { id: "asc" } } },
      }),
      prisma.blog.findMany({
        where: { isPublished: true },
        take: 2,
        orderBy: { publishedAt: "desc" },
      }),
      prisma.commonQuestion.findMany({ orderBy: { createdAt: "asc" }, take: 8 }),
      prisma.aboutUs.findMany({ orderBy: { id: "asc" }, take: 3 }),
      prisma.review.findFirst({
        where: { comment: { not: null } },
        orderBy: [{ stars: "desc" }, { createdAt: "desc" }],
        include: { user: { select: { firstName: true, lastName: true, image: true } } },
      }),
      prisma.trap.count(),
    ]);

  const heroSlides = sliders.map((s) => mapSliderForHero(s, locale));
  const tripCards = traps.map((trap) => {
    const rate =
      trap.reviews.length > 0
        ? Math.round((trap.reviews.reduce((sum, r) => sum + r.stars, 0) / trap.reviews.length) * 10) / 10
        : 0;
    return mapTrapForCard({ ...trap, rate }, locale);
  });
  const featuredCards = tripCards.slice(0, 3);
  const socialCards = tripCards.slice(0, 3);
  const homeBlogs = blogs.map((b) => mapBlogForHomeSection(b, locale));
  const homeFaqs = faqs.map((f) => mapFaq(f, locale));
  const historyEntries = aboutUsEntries.map((entry) => mapAboutUs(entry, locale));
  const testimonial = topReview ? mapReviewForTestimonial(topReview) : null;
  const spotlightName = spotlightTrap ? (locale === "ar" ? spotlightTrap.nameAr ?? spotlightTrap.nameEn : spotlightTrap.nameEn) : null;
  const spotlightImages = spotlightTrap?.galleries.map((g) => g.image) ?? [];

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: "Bedouin Trails",
    url: SITE_URL,
    logo: `${SITE_URL}/img/logo.png`,
    image: `${SITE_URL}/og-image.jpg`,
    description:
      "Egyptian desert safari tour company based in Cairo, organizing White Desert safari tours, camel treks, desert trekking, and multi-day desert tours.",
    address: {
      "@type": "PostalAddress",
      addressCountry: "EG",
      addressLocality: "Cairo",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+20-10-02717380",
      contactType: "reservations",
      availableLanguage: ["English", "Arabic"],
    },
    sameAs: [
      "https://www.instagram.com/the.white.and.black.desert",
      "https://www.facebook.com/profile.php?id=61587717913002",
    ],
  };

  return (
    <main className={styles.home}>
      <h1 className="sr-only">{t("meta_title_home")}</h1>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <div className="carousel">
        <HeroCarousel
          slides={heroSlides}
          ctaHref="/journeys"
          featuredTrip={
            featuredCards[0] ? { slug: featuredCards[0].slug, name: featuredCards[0].name, image: featuredCards[0].image } : null
          }
        />
      </div>

      <ScrollReveal as="div" className={styles.trustBar}>
        <div className={styles.trustItem}>
          <h3>+{trapCount}</h3>
          <p>{t("number_of_destinations")}</p>
        </div>
        <div className={styles.trustItem}>
          <h3>+1000</h3>
          <p>{t("our_clients")}</p>
        </div>
        <div className={styles.trustItem}>
          <h3>+5</h3>
          <p>{t("experience_years")}</p>
        </div>
      </ScrollReveal>

      <ScrollReveal className={`${styles.sectionHead} ${styles.sectionHeadTop} ${styles.sectionHeadCenter}`}>
        <h2>{t("featured_journeys")}</h2>
      </ScrollReveal>
      <div className={styles.adventuresSlider}>
        <TripCarousel data={tripCards} />
      </div>
      <div className={styles.adventuresCta}>
        <Link href="/journeys" className={styles.pillButton}>
          {t("all_tours")} <FaArrowRight size={13} />
        </Link>
      </div>

      <ScrollReveal as="div" className={styles.expertSection}>
        <div className={styles.collageWrap}>
          <div className={styles.scene}>
            <div className={styles.collageWrapper}>
              <div className={styles.pillLarge}>
                <Image src="/img/adventure.webp" alt="ATV rider celebrating on sand dunes" width={400} height={500} />
                <div className={styles.grainOverlay} />
              </div>
              <div className={styles.pillSmall}>
                <Image src="/img/salt-lake.webp" alt="Tourists floating in a crystal-clear salt lake in Egypt's Western Desert" width={300} height={400} />
                <div className={styles.grainOverlay} />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.expertText}>
          <h2>{t("our_safari_story")}</h2>
          <p>{t("safari_experience_message")}</p>
          <Link href="/about" className={styles.textLink}>
            {t("about")} <FaArrowRight size={13} />
          </Link>
        </div>
      </ScrollReveal>

      {spotlightTrap && (
        <div className={styles.spotlightSection}>
          <ScrollReveal className={styles.spotlightCard}>
            {spotlightImages[0] && (
              <div className={`${styles.spotlightPolaroid} ${styles.left}`}>
                <SafeImage src={spotlightImages[0]} alt={spotlightName ?? ""} width={170} height={150} />
              </div>
            )}
            {spotlightImages[1] && (
              <div className={`${styles.spotlightPolaroid} ${styles.right}`}>
                <SafeImage src={spotlightImages[1]} alt={spotlightName ?? ""} width={170} height={150} />
              </div>
            )}
            <span className={styles.spotlightEyebrow}>{t("featured_journeys")}</span>
            <h2 className={styles.spotlightTitle}>{spotlightName}</h2>
            <div className={styles.spotlightMeta}>
              <span>{spotlightTrap.duration} {t("days")}</span>
              <span>•</span>
              <span>{spotlightTrap.countPeople} {t("booking")}</span>
            </div>
            <Link href={`/journeys/${spotlightTrap.slug}`} className={styles.pillButton}>
              {t("explore_tour")}
            </Link>
          </ScrollReveal>
        </div>
      )}

      <ScrollReveal as="div" className={styles.activitiesGrid}>
        {ACTIVITY_IMAGES.map((item) => (
          <div key={item.key} className={styles.activityTile}>
            <Image src={item.img} alt={t(item.key)} loading="lazy" width={300} height={200} />
            <h3>{t(item.key)}</h3>
          </div>
        ))}
      </ScrollReveal>

      {testimonial?.comment && (
        <ScrollReveal as="section" className={styles.testimonialSection}>
          <p className={styles.testimonialBody}>&ldquo;{testimonial.comment}&rdquo;</p>
          <p className={styles.testimonialAuthor}>{testimonial.userName}</p>
        </ScrollReveal>
      )}

      <ScrollReveal as="div" className={styles.whyChooseSection}>
        <h2>{t("why_choose_us")}</h2>
        <div className={styles.whyChooseList}>
          {[1, 2, 3].map((n, i) => {
            const Icon = WHY_CHOOSE_ICONS[i];
            return (
              <div key={n} className={styles.whyChooseItem}>
                <div className={styles.icon}>
                  <Icon />
                </div>
                <div>
                  <h3>{t(`why_choose_us_${n}_title` as any)}</h3>
                  <p>{t(`why_choose_us_${n}_body` as any)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollReveal>

      {historyEntries.length > 0 && (
        <div className={styles.historySection}>
          <ScrollReveal as="h2" className={styles.historyHeading}>
            {t("our_journey_heading")}
          </ScrollReveal>
          <div className={styles.historyGrid}>
            {historyEntries.map((entry, i) => (
              <ScrollReveal key={entry.id} className={styles.historyItem} delay={i * 100}>
                <h3>{entry.title}</h3>
                <SafeImage src={entry.image || `/img/adventure${i % 2 === 0 ? "3" : "4"}.webp`} alt={entry.title} loading="lazy" width={400} height={300} style={{ objectFit: "cover", borderRadius: "20px" }} />
                <p>{entry.description}</p>
                {HISTORY_LINKS[i] && (
                  <Link href={HISTORY_LINKS[i].href} className={styles.textLink}>
                    {t(HISTORY_LINKS[i].labelKey)} <FaArrowRight size={13} />
                  </Link>
                )}
              </ScrollReveal>
            ))}
          </div>
        </div>
      )}

      {homeBlogs.length > 0 && (
        <div className={styles.journalSection}>
          <ScrollReveal className={styles.sectionHead}>
            <h2>{t("blogs")}</h2>
            <Link href="/blogs" className={styles.sectionLink}>
              {t("read_more_articles")} <FaArrowRight size={13} />
            </Link>
          </ScrollReveal>
          <div className={styles.journalList}>
            {homeBlogs.map((blog, i) => (
              <ScrollReveal key={blog.id} as="div" className={styles.journalItem} delay={i * 100}>
                <SafeImage src={blog.image || `/img/adventure${i % 2 === 0 ? "" : "1"}.webp`} alt={blog.title} loading="lazy" width={400} height={300} style={{ objectFit: "cover", borderRadius: "20px" }} />
                <div>
                  <span className={styles.journalEyebrow}>{t("blogs")}</span>
                  <h3 className={styles.journalTitle}>{blog.title}</h3>
                  <p className={styles.journalExcerpt}>{blog.description}...</p>
                  <Link href={`/blogs/${blog.slug}`} className={styles.textLink}>
                    {t("read_story")} <FaArrowRight size={13} />
                  </Link>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      )}

      <ScrollReveal as="div" className={styles.faqSection}>
        <h2>{t("faq_title")}</h2>
        <div className={styles["faq-accordion"]}>
          <FaqAccordion faqs={homeFaqs} />
        </div>
        <div className={styles.faqFooterLine}>
          <Link href="/contact" className={styles.pillButton}>
            {t("contact_us")}
          </Link>
        </div>
      </ScrollReveal>

      <ScrollReveal as="div" className={styles.socialSection}>
        <h2 className={styles.socialHandle}>@the.white.and.black.desert</h2>
        <div className={styles.socialGrid}>
          {socialCards.map((card) => (
            <a
              key={card.id}
              className={styles.socialTile}
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.instagram.com/the.white.and.black.desert?igsh=aHdjbzB6ajJ5dTBk"
            >
              <SafeImage src={card.image || "/img/adventure1.webp"} alt={card.name} loading="lazy" width={300} height={300} style={{ objectFit: "cover", borderRadius: "20px" }} />
              <div className={styles.socialLabel}>
                <strong>{card.name}</strong>
              </div>
            </a>
          ))}
        </div>
        <a
          className={styles.pillButton}
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.instagram.com/the.white.and.black.desert?igsh=aHdjbzB6ajJ5dTBk"
        >
          <FaInstagram /> {t("follow_us")}
        </a>
      </ScrollReveal>

    </main>
  );
}
