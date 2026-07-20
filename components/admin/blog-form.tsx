"use client";

import { useActionState } from "react";
import I18nField from "./i18n-field";
import { getLocalFallbackImage } from "@/lib/image-fallback";
import styles from "./admin.module.scss";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type I18nJson = Record<string, string> | any;

export type BlogFormValues = {
  titleEn: string;
  titleAr: string;
  titleI18n?: I18nJson;
  excerptEn: string;
  excerptAr: string;
  excerptI18n?: I18nJson;
  contentEn: string;
  contentAr: string;
  contentI18n?: I18nJson;
  author: string;
  category: string;
  metaTitleEn: string;
  metaTitleAr: string;
  metaTitleI18n?: I18nJson;
  metaDescriptionEn: string;
  metaDescriptionAr: string;
  metaDescriptionI18n?: I18nJson;
  isPublished: boolean;
  image: string | null;
};

type ActionState = { success?: boolean; error?: string } | undefined;

export default function BlogForm({
  initial,
  action,
  submitLabel,
}: {
  initial?: Partial<BlogFormValues>;
  action: (prevState: ActionState, form: FormData) => Promise<ActionState>;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className={styles.form}>
      {state?.error && <div className={styles.errorBanner}>{state.error}</div>}
      {state?.success && <div className={styles.card}>Saved.</div>}

      <I18nField
        name="title"
        label="Title"
        initial={{ en: initial?.titleEn, ar: initial?.titleAr, ...initial?.titleI18n }}
      />

      <I18nField
        name="excerpt"
        label="Excerpt"
        multiline
        rows={2}
        initial={{ en: initial?.excerptEn, ar: initial?.excerptAr, ...initial?.excerptI18n }}
      />

      <I18nField
        name="content"
        label="Content (HTML)"
        multiline
        rows={10}
        initial={{ en: initial?.contentEn, ar: initial?.contentAr, ...initial?.contentI18n }}
      />

      <div className={styles.formRow}>
        <div className={styles.field}>
          <label>Author</label>
          <input name="author" defaultValue={initial?.author} />
        </div>
        <div className={styles.field}>
          <label>Category</label>
          <input name="category" defaultValue={initial?.category} />
        </div>
      </div>

      <I18nField
        name="metaTitle"
        label="Meta title"
        initial={{ en: initial?.metaTitleEn, ar: initial?.metaTitleAr, ...initial?.metaTitleI18n }}
      />

      <I18nField
        name="metaDescription"
        label="Meta description"
        initial={{ en: initial?.metaDescriptionEn, ar: initial?.metaDescriptionAr, ...initial?.metaDescriptionI18n }}
      />

      <div className={styles.field}>
        <label>Cover image {initial && "(leave empty to keep current)"}</label>
        {initial?.image && <img src={getLocalFallbackImage(initial.image)} alt="" className={styles.imagePreview} />}
        <input type="file" name="image" accept="image/*" />
      </div>

      <div className={styles.checkboxField}>
        <input type="checkbox" name="isPublished" id="isPublished" defaultChecked={initial?.isPublished} />
        <label htmlFor="isPublished">Published</label>
      </div>

      <button type="submit" className={styles.primaryBtn} disabled={pending}>
        {pending ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
