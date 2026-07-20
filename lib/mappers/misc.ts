import type { Locale } from "@/lib/i18n/config";
import { localize } from "@/lib/i18n/localized";
import { getLocalFallbackImage } from "@/lib/image-fallback";
import type { HeroSlide } from "@/components/carousel/hero-carousel";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type I18nJson = Record<string, string> | any;

type SliderLike = {
  image: string;
  titleEn: string | null;
  titleAr: string | null;
  titleI18n?: I18nJson;
  descriptionEn: string | null;
  descriptionAr: string | null;
  descriptionI18n?: I18nJson;
};

export function mapSliderForHero(slider: SliderLike, locale: Locale): HeroSlide {
  return {
    image: getLocalFallbackImage(slider.image),
    title: localize(slider.titleEn ?? "", slider.titleAr, locale, slider.titleI18n),
    description: localize(slider.descriptionEn ?? "", slider.descriptionAr, locale, slider.descriptionI18n),
  };
}

type BlogLike = {
  id: number;
  slug: string;
  titleEn: string;
  titleAr: string;
  titleI18n?: I18nJson;
  excerptEn: string | null;
  excerptAr: string | null;
  excerptI18n?: I18nJson;
  contentEn: string;
  contentAr: string;
  contentI18n?: I18nJson;
  image: string | null;
};

export function mapBlogForHomeSection(blog: BlogLike, locale: Locale) {
  const title = localize(blog.titleEn, blog.titleAr, locale, blog.titleI18n);
  const rawDescription =
    localize(blog.excerptEn ?? "", blog.excerptAr, locale, blog.excerptI18n) ||
    localize(blog.contentEn, blog.contentAr, locale, blog.contentI18n);
  const description = rawDescription.replace(/<[^>]*>/g, "").slice(0, 200);

  return {
    id: blog.id,
    slug: blog.slug,
    title,
    description,
    image: getLocalFallbackImage(blog.image),
  };
}

type AboutUsLike = {
  id: number;
  titleEn: string;
  titleAr: string | null;
  titleI18n?: I18nJson;
  descriptionEn: string;
  descriptionAr: string | null;
  descriptionI18n?: I18nJson;
  image: string | null;
};

export function mapAboutUs(entry: AboutUsLike, locale: Locale) {
  return {
    id: entry.id,
    title: localize(entry.titleEn, entry.titleAr, locale, entry.titleI18n),
    description: localize(entry.descriptionEn, entry.descriptionAr, locale, entry.descriptionI18n),
    image: getLocalFallbackImage(entry.image),
  };
}

type ReviewLike = {
  id: number;
  stars: number;
  comment: string | null;
  user: { firstName: string; lastName: string; image: string | null };
};

export function mapReviewForTestimonial(review: ReviewLike) {
  return {
    id: review.id,
    userName: `${review.user.firstName} ${review.user.lastName}`.trim(),
    userImage: getLocalFallbackImage(review.user.image),
    stars: review.stars,
    comment: review.comment,
  };
}

type FaqLike = {
  id: number;
  questionEn: string;
  questionAr: string | null;
  questionI18n?: I18nJson;
  answerEn: string;
  answerAr: string | null;
  answerI18n?: I18nJson;
};

export function mapFaq(faq: FaqLike, locale: Locale) {
  return {
    id: faq.id,
    question: localize(faq.questionEn, faq.questionAr, locale, faq.questionI18n),
    answer: localize(faq.answerEn, faq.answerAr, locale, faq.answerI18n),
  };
}
