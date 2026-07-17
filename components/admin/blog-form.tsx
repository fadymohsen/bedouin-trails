"use client";

import { useActionState, useState } from "react";
import styles from "./admin.module.scss";

const I18N_LANGS = [
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "es", label: "Spanish" },
  { code: "pt", label: "Portuguese" },
  { code: "it", label: "Italian" },
  { code: "nl", label: "Netherlands" },
  { code: "zh", label: "Chinese" },
] as const;

type I18nJson = Record<string, string>;

export type BlogFormValues = {
  titleEn: string;
  titleAr: string;
  titleI18n: I18nJson | null;
  excerptEn: string;
  excerptAr: string;
  excerptI18n: I18nJson | null;
  contentEn: string;
  contentAr: string;
  contentI18n: I18nJson | null;
  author: string;
  category: string;
  metaTitleEn: string;
  metaTitleAr: string;
  metaTitleI18n: I18nJson | null;
  metaDescriptionEn: string;
  metaDescriptionAr: string;
  metaDescriptionI18n: I18nJson | null;
  isPublished: boolean;
  image: string | null;
};

type ActionState = { success?: boolean; error?: string } | undefined;

function getI18nValue(json: I18nJson | null | undefined, lang: string): string {
  return json?.[lang] ?? "";
}

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
  const [showTranslations, setShowTranslations] = useState(false);

  return (
    <form action={formAction} className={styles.form}>
      {state?.error && <div className={styles.errorBanner}>{state.error}</div>}
      {state?.success && <div className={styles.card}>Saved.</div>}

      <div className={styles.formRow}>
        <div className={styles.field}>
          <label>Title (English)</label>
          <input name="titleEn" required defaultValue={initial?.titleEn} />
        </div>
        <div className={styles.field}>
          <label>Title (Arabic)</label>
          <input name="titleAr" required defaultValue={initial?.titleAr} dir="rtl" />
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.field}>
          <label>Excerpt (English)</label>
          <textarea name="excerptEn" rows={2} defaultValue={initial?.excerptEn} />
        </div>
        <div className={styles.field}>
          <label>Excerpt (Arabic)</label>
          <textarea name="excerptAr" rows={2} defaultValue={initial?.excerptAr} dir="rtl" />
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.field}>
          <label>Content (English, HTML)</label>
          <textarea name="contentEn" required rows={10} defaultValue={initial?.contentEn} />
        </div>
        <div className={styles.field}>
          <label>Content (Arabic, HTML)</label>
          <textarea name="contentAr" required rows={10} defaultValue={initial?.contentAr} dir="rtl" />
        </div>
      </div>

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

      <div className={styles.formRow}>
        <div className={styles.field}>
          <label>Meta title (English)</label>
          <input name="metaTitleEn" defaultValue={initial?.metaTitleEn} />
        </div>
        <div className={styles.field}>
          <label>Meta title (Arabic)</label>
          <input name="metaTitleAr" defaultValue={initial?.metaTitleAr} dir="rtl" />
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.field}>
          <label>Meta description (English)</label>
          <input name="metaDescriptionEn" defaultValue={initial?.metaDescriptionEn} />
        </div>
        <div className={styles.field}>
          <label>Meta description (Arabic)</label>
          <input name="metaDescriptionAr" defaultValue={initial?.metaDescriptionAr} dir="rtl" />
        </div>
      </div>

      {/* ── Translations Section ── */}
      <div className={styles.field} style={{ marginTop: 24 }}>
        <button
          type="button"
          className={styles.secondaryBtn ?? styles.primaryBtn}
          onClick={() => setShowTranslations(!showTranslations)}
          style={{ marginBottom: 12 }}
        >
          {showTranslations ? "▼ Hide" : "► Show"} Other Language Translations ({I18N_LANGS.length} languages)
        </button>

        {showTranslations && (
          <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16 }}>
            {I18N_LANGS.map(({ code, label }) => (
              <fieldset key={code} style={{ border: "1px solid #eee", borderRadius: 6, padding: 12, marginBottom: 12 }}>
                <legend style={{ fontWeight: 600, padding: "0 8px" }}>{label} ({code})</legend>
                <div className={styles.formRow}>
                  <div className={styles.field}>
                    <label>Title ({label})</label>
                    <input name={`titleI18n_${code}`} defaultValue={getI18nValue(initial?.titleI18n, code)} />
                  </div>
                  <div className={styles.field}>
                    <label>Excerpt ({label})</label>
                    <textarea name={`excerptI18n_${code}`} rows={2} defaultValue={getI18nValue(initial?.excerptI18n, code)} />
                  </div>
                </div>
                <div className={styles.field}>
                  <label>Content ({label}, HTML)</label>
                  <textarea name={`contentI18n_${code}`} rows={6} defaultValue={getI18nValue(initial?.contentI18n, code)} />
                </div>
                <div className={styles.formRow}>
                  <div className={styles.field}>
                    <label>Meta title ({label})</label>
                    <input name={`metaTitleI18n_${code}`} defaultValue={getI18nValue(initial?.metaTitleI18n, code)} />
                  </div>
                  <div className={styles.field}>
                    <label>Meta description ({label})</label>
                    <input name={`metaDescriptionI18n_${code}`} defaultValue={getI18nValue(initial?.metaDescriptionI18n, code)} />
                  </div>
                </div>
              </fieldset>
            ))}
          </div>
        )}
      </div>

      <div className={styles.field}>
        <label>Cover image {initial && "(leave empty to keep current)"}</label>
        {initial?.image && <img src={initial.image} alt="" className={styles.imagePreview} />}
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
