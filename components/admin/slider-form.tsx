"use client";

import { useActionState } from "react";
import I18nField from "./i18n-field";
import { getLocalFallbackImage } from "@/lib/image-fallback";
import styles from "./admin.module.scss";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type I18nJson = Record<string, string> | any;

export type SliderFormValues = {
  titleEn: string;
  titleAr: string;
  titleI18n?: I18nJson;
  descriptionEn: string;
  descriptionAr: string;
  descriptionI18n?: I18nJson;
  image?: string;
};

type ActionState = { success?: boolean; error?: string } | undefined;

export default function SliderForm({
  initial,
  action,
  submitLabel,
}: {
  initial?: Partial<SliderFormValues>;
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
        name="description"
        label="Description"
        multiline
        initial={{ en: initial?.descriptionEn, ar: initial?.descriptionAr, ...initial?.descriptionI18n }}
      />

      {initial?.image && (
        <div className={styles.field}>
          <label>Current image</label>
          <img src={getLocalFallbackImage(initial.image)} alt="" className={styles.imagePreview} />
        </div>
      )}

      <div className={styles.field}>
        <label>Image {initial ? "(leave empty to keep current)" : ""}</label>
        <input type="file" name="image" accept="image/*" required={!initial} />
      </div>

      <button type="submit" className={styles.primaryBtn} disabled={pending}>
        {pending ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
