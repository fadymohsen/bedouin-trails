"use client";

import { useState, useTransition } from "react";
import { addBlogFaqAction, updateBlogFaqAction, deleteBlogFaqAction } from "@/app/admin/(dashboard)/blogs/actions";
import I18nField from "./i18n-field";
import styles from "./admin.module.scss";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type I18nJson = Record<string, string> | any;

export type BlogFaqItem = {
  id: number;
  questionEn: string;
  questionAr: string;
  questionI18n?: I18nJson;
  answerEn: string;
  answerAr: string;
  answerI18n?: I18nJson;
};

function FaqForm({ blogId, faq, onDone }: { blogId: number; faq?: BlogFaqItem; onDone: () => void }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setError(null);
    startTransition(async () => {
      try {
        if (faq) {
          await updateBlogFaqAction(blogId, faq.id, form);
        } else {
          await addBlogFaqAction(blogId, form);
        }
        onDone();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to save. Please try again.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && <div className={styles.errorBanner}>{error}</div>}
      <I18nField
        name="question"
        label="Question"
        initial={{ en: faq?.questionEn, ar: faq?.questionAr, ...faq?.questionI18n }}
      />
      <I18nField
        name="answer"
        label="Answer"
        multiline
        rows={3}
        initial={{ en: faq?.answerEn, ar: faq?.answerAr, ...faq?.answerI18n }}
      />
      <div style={{ display: "flex", gap: 8 }}>
        <button type="submit" className={styles.primaryBtn} disabled={pending}>
          {pending ? "Saving..." : faq ? "Save" : "Add FAQ"}
        </button>
        <button type="button" className={styles.secondaryBtn} onClick={onDone}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function BlogFaqsManager({ blogId, faqs }: { blogId: number; faqs: BlogFaqItem[] }) {
  const [pending, startTransition] = useTransition();
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleDelete(faqId: number) {
    setError(null);
    startTransition(async () => {
      try {
        await deleteBlogFaqAction(blogId, faqId);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Delete failed. Please try again.");
      }
    });
  }

  return (
    <div className={styles.card}>
      {error && <div className={styles.errorBanner}>{error}</div>}
      {faqs.map((faq) =>
        editingId === faq.id ? (
          <FaqForm key={faq.id} blogId={blogId} faq={faq} onDone={() => setEditingId(null)} />
        ) : (
          <div key={faq.id} style={{ padding: "10px 0", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", gap: 12 }}>
            <div>
              <strong>{faq.questionEn}</strong>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#777" }}>{faq.answerEn}</p>
            </div>
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              <button className={styles.secondaryBtn} onClick={() => setEditingId(faq.id)}>
                Edit
              </button>
              <button className={styles.dangerBtn} onClick={() => handleDelete(faq.id)} disabled={pending}>
                Delete
              </button>
            </div>
          </div>
        )
      )}

      {adding ? (
        <div style={{ marginTop: 12 }}>
          <FaqForm blogId={blogId} onDone={() => setAdding(false)} />
        </div>
      ) : (
        <button className={styles.secondaryBtn} style={{ marginTop: 12 }} onClick={() => setAdding(true)}>
          + Add FAQ
        </button>
      )}
    </div>
  );
}
