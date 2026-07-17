import { z } from "zod";

const i18nJsonSchema = z.record(z.string(), z.string()).optional();

export const blogFormSchema = z.object({
  titleEn: z.string().min(1),
  titleAr: z.string().min(1),
  titleI18n: i18nJsonSchema,
  excerptEn: z.string().optional(),
  excerptAr: z.string().optional(),
  excerptI18n: i18nJsonSchema,
  contentEn: z.string().min(1),
  contentAr: z.string().min(1),
  contentI18n: i18nJsonSchema,
  author: z.string().optional(),
  category: z.string().optional(),
  metaTitleEn: z.string().optional(),
  metaTitleAr: z.string().optional(),
  metaTitleI18n: i18nJsonSchema,
  metaDescriptionEn: z.string().optional(),
  metaDescriptionAr: z.string().optional(),
  metaDescriptionI18n: i18nJsonSchema,
  isPublished: z.coerce.boolean().default(false),
});

export type BlogFormInput = z.infer<typeof blogFormSchema>;

export const blogFaqFormSchema = z.object({
  questionEn: z.string().min(1),
  questionAr: z.string().min(1),
  questionI18n: i18nJsonSchema,
  answerEn: z.string().min(1),
  answerAr: z.string().min(1),
  answerI18n: i18nJsonSchema,
});
