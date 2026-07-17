"use client";

import { useState } from "react";
import { useRouter } from "@/lib/i18n/navigation";
import { useTranslations } from "next-intl";
import { apiPost, ApiClientError } from "@/lib/api-client";
import styles from "./book-form.module.scss";

export type BookableTrip = { id: number; name: string; image: string | null; description: string | null };

type FormErrors = Partial<Record<"tripId" | "firstName" | "lastName" | "email" | "phone" | "startDate" | "endDate", string>>;

export default function BookFormClient({
  trip,
  trips,
}: {
  trip: BookableTrip | null;
  trips: BookableTrip[];
}) {
  const t = useTranslations();
  const router = useRouter();
  const [selectedTripId, setSelectedTripId] = useState<string>(trip ? String(trip.id) : "");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    numberOfAdults: 1,
    numberOfChildren: 0,
    startDate: "",
    endDate: "",
    description: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  function validateForm(): boolean {
    const newErrors: FormErrors = {};
    if (!selectedTripId) newErrors.tripId = t("trap_id_required");
    if (!formData.firstName.trim()) newErrors.firstName = t("first_name_required");
    if (!formData.lastName.trim()) newErrors.lastName = t("last_name_required");
    if (!formData.email.trim()) {
      newErrors.email = t("email_required");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t("email_invalid");
    }
    if (!formData.phone.trim()) newErrors.phone = t("phone_required");
    if (!formData.startDate) newErrors.startDate = t("start_date_required");
    if (!formData.endDate) newErrors.endDate = t("end_date_required");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    const numValue = type === "number" ? parseInt(value) || 0 : value;
    setFormData((prev) => ({ ...prev, [name]: numValue }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await apiPost("/api/orders", { ...formData, trapId: Number(selectedTripId) });
      setSubmitStatus({ type: "success", message: t("booking_success") });
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        numberOfAdults: 1,
        numberOfChildren: 0,
        startDate: "",
        endDate: "",
        description: "",
      });
    } catch (err) {
      setSubmitStatus({ type: "error", message: err instanceof ApiClientError ? err.message : t("network_error") });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles["book-form-container"]}>
      <div className={styles["book-form-split"]}>
        <div className={styles["form-panel"]}>
          <div className={styles["form-panel-inner"]}>
            <div className={styles["form-header"]}>
              <h1>{t("book_your_trip")}</h1>
            </div>

            <form onSubmit={handleSubmit} className={styles["booking-form"]}>
              {!trip && (
                <div className={styles["form-field"]}>
                  <label>{t("journeys")}</label>
                  <select
                    value={selectedTripId}
                    onChange={(e) => {
                      setSelectedTripId(e.target.value);
                      setErrors((prev) => ({ ...prev, tripId: undefined }));
                    }}
                    className={errors.tripId ? styles.error : ""}
                  >
                    <option value="">{t("select_trip")}</option>
                    {trips.map((t2) => (
                      <option key={t2.id} value={t2.id}>
                        {t2.name}
                      </option>
                    ))}
                  </select>
                  {errors.tripId && <span className={styles["field-error"]}>{errors.tripId}</span>}
                </div>
              )}

              <div className={styles["form-field"]}>
                <label>{t("first_name")}</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={errors.firstName ? styles.error : ""}
                  placeholder={t("first_name")}
                />
                {errors.firstName && <span className={styles["field-error"]}>{t("error_occurred")}</span>}
              </div>

              <div className={styles["form-field"]}>
                <label>{t("last_name")}</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={errors.lastName ? styles.error : ""}
                  placeholder={t("last_name")}
                />
                {errors.lastName && <span className={styles["field-error"]}>{t("error_occurred")}</span>}
              </div>

              <div className={styles["form-field"]}>
                <label>{t("email")}</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? styles.error : ""}
                  placeholder={t("email")}
                />
                {errors.email && <span className={styles["field-error"]}>{errors.email}</span>}
              </div>

              <div className={styles["form-field"]}>
                <label>{t("phone")}</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={errors.phone ? styles.error : ""}
                  placeholder={t("phone")}
                />
                {errors.phone && <span className={styles["field-error"]}>{t("error_occurred")}</span>}
              </div>

              <div className={styles["form-row-split"]}>
                <div className={styles["form-field"]}>
                  <label>{t("number_of_guests")}</label>
                  <input type="number" name="numberOfAdults" value={formData.numberOfAdults} onChange={handleChange} min={1} max={20} />
                </div>
                <div className={styles["form-field"]}>
                  <label>{t("children")}</label>
                  <input type="number" name="numberOfChildren" value={formData.numberOfChildren} onChange={handleChange} min={0} max={20} />
                </div>
              </div>

              <div className={styles["form-row-split"]}>
                <div className={styles["form-field"]}>
                  <label>{t("start_date")}</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className={errors.startDate ? styles.error : ""}
                  />
                  {errors.startDate && <span className={styles["field-error"]}>{t("error_occurred")}</span>}
                </div>
                <div className={styles["form-field"]}>
                  <label>{t("end_date")}</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className={errors.endDate ? styles.error : ""}
                  />
                  {errors.endDate && <span className={styles["field-error"]}>{t("error_occurred")}</span>}
                </div>
              </div>

              <div className={styles["form-field"]}>
                <label>{t("additional_notes")}</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={3} placeholder={t("additional_notes")} />
              </div>

              <button type="submit" className={styles["submit-button"]} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className={styles["btn-spinner"]}></span>
                    {t("submit")}...
                  </>
                ) : (
                  t("submit")
                )}
              </button>
            </form>

            {submitStatus && (
              <div className={`${styles["status-message"]} ${styles[submitStatus.type]}`}>
                <div className={styles["status-icon"]}>{submitStatus.type === "success" ? "✓" : "✗"}</div>
                <p>{submitStatus.message}</p>
                {submitStatus.type === "success" && (
                  <button className={styles["view-booking-link"]} onClick={() => router.push("/my-journeys")}>
                    {t("view_booking")}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className={styles["image-panel"]}>
          <div className={styles["image-panel-overlay"]}>
            <div className={styles["trip-info-card"]}>
              <h2>{trip ? trip.name : t("book_your_trip")}</h2>
              {trip?.description && <p className={styles["trip-description"]}>{trip.description}</p>}
            </div>
          </div>
          <div
            className={styles["image-panel-bg"]}
            style={{ backgroundImage: trip?.image ? `url(${trip.image})` : "url(/img/adventure.webp)" }}
          />
        </div>
      </div>
    </div>
  );
}
