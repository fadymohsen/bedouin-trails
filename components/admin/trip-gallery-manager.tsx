"use client";

import { useState, useTransition } from "react";
import { addGalleryImagesAction, deleteGalleryImageAction } from "@/app/admin/(dashboard)/trips/actions";
import { getLocalFallbackImage } from "@/lib/image-fallback";
import styles from "./admin.module.scss";

export type GalleryImage = { id: number; image: string };

export default function TripGalleryManager({ tripId, images }: { tripId: number; images: GalleryImage[] }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    setError(null);
    startTransition(async () => {
      try {
        await addGalleryImagesAction(tripId, form);
        formEl.reset();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
      }
    });
  }

  function handleDelete(galleryId: number) {
    setError(null);
    startTransition(async () => {
      try {
        await deleteGalleryImageAction(tripId, galleryId);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Delete failed. Please try again.");
      }
    });
  }

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
        {images.map((img) => (
          <div key={img.id} style={{ position: "relative" }}>
            <img src={getLocalFallbackImage(img.image)} alt="" className={styles.imagePreview} />
            <button
              type="button"
              className={styles.dangerBtn}
              style={{ position: "absolute", top: 4, right: 4, padding: "2px 8px", fontSize: "0.75rem" }}
              onClick={() => handleDelete(img.id)}
              disabled={pending}
            >
              &times;
            </button>
          </div>
        ))}
      </div>

      {error && <div className={styles.errorBanner}>{error}</div>}

      <form onSubmit={handleUpload} className={styles.field}>
        <label>Add images</label>
        <input type="file" name="images" accept="image/*" multiple />
        <button type="submit" className={styles.secondaryBtn} disabled={pending} style={{ width: "fit-content" }}>
          {pending ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
}
