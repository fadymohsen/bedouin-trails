"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "@/lib/i18n/navigation";
import { useTranslations } from "next-intl";
import { apiPost, ApiClientError } from "@/lib/api-client";
import { FaWhatsapp, FaCalendarAlt, FaUserFriends, FaMapMarkerAlt } from "react-icons/fa";
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
  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);
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

  const tripDurationDays = useMemo(() => {
    if (!formData.startDate || !formData.endDate || formData.endDate < formData.startDate) return null;
    const diffMs = new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime();
    return Math.round(diffMs / 86400000);
  }, [formData.startDate, formData.endDate]);

  // Popup Redirect Modal state
  const [showPopup, setShowPopup] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [redirectUrl, setRedirectUrl] = useState("");
  const [bookingSummary, setBookingSummary] = useState<{
    tripName: string;
    startDate: string;
    endDate: string;
    guests: number;
  } | null>(null);
  const COUNTDOWN_SECONDS = 5;

  function resetForm() {
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
  }

  useEffect(() => {
    if (!showPopup) return;
    if (countdown <= 0) {
      // Timeout: redirect to WhatsApp and forward the parent tab to the trips
      // page — navigating away unmounts this form, so there's no need to
      // reset its state here too (that would just be an extra setState call
      // inside the effect).
      window.open(redirectUrl, "_blank");
      router.push("/journeys");
      setShowPopup(false);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [showPopup, countdown, redirectUrl, router]);

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

    if (!formData.startDate) {
      newErrors.startDate = t("start_date_required");
    } else if (formData.startDate < todayStr) {
      newErrors.startDate = t("start_date_past");
    }

    if (!formData.endDate) {
      newErrors.endDate = t("end_date_required");
    } else if (formData.startDate && formData.endDate < formData.startDate) {
      newErrors.endDate = t("end_date_before_start");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    const numValue = type === "number" ? parseInt(value) || 0 : value;

    if (name === "startDate") {
      // Keep the range valid: if the new start lands on or after the current
      // end date, clear the end date instead of silently leaving a start-after-end range.
      setFormData((prev) => ({
        ...prev,
        startDate: value,
        endDate: prev.endDate && prev.endDate < value ? "" : prev.endDate,
      }));
      setErrors((prev) => ({ ...prev, startDate: undefined, endDate: undefined }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: numValue }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  const handleManualRedirect = () => {
    window.open(redirectUrl, "_blank");
    resetForm();
    router.push("/journeys");
    setShowPopup(false);
  };

  // Closing without confirming just hides the popup — the form data stays
  // filled in so the user can fix something and submit again.
  const handleClosePopup = () => {
    setShowPopup(false);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setSubmitStatus(null);

    const tripName = trip ? trip.name : trips.find(t2 => String(t2.id) === selectedTripId)?.name || "";

    const message = `Hello Bedouin Trails, I want to book a trip:
Trip: ${tripName}
Name: ${formData.firstName} ${formData.lastName}
Email: ${formData.email}
Phone: ${formData.phone}
Adults: ${formData.numberOfAdults}
Children: ${formData.numberOfChildren}
Start Date: ${formData.startDate}
End Date: ${formData.endDate}
Additional Notes: ${formData.description || "None"}`;

    const whatsappUrl = `https://api.whatsapp.com/send?phone=201002717380&text=${encodeURIComponent(message)}`;

    try {
      try {
        await apiPost("/api/orders", { ...formData, trapId: Number(selectedTripId) });
      } catch (dbErr) {
        console.warn("Database order saving skipped/failed: ", dbErr);
      }

      setBookingSummary({
        tripName,
        startDate: formData.startDate,
        endDate: formData.endDate,
        guests: formData.numberOfAdults + formData.numberOfChildren,
      });
      setRedirectUrl(whatsappUrl);
      setShowPopup(true);
      setCountdown(COUNTDOWN_SECONDS);
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
                {errors.firstName && <span className={styles["field-error"]}>{errors.firstName}</span>}
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
                {errors.lastName && <span className={styles["field-error"]}>{errors.lastName}</span>}
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
                {errors.phone && <span className={styles["field-error"]}>{errors.phone}</span>}
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

              <div className={styles["date-range-group"]}>
                <div className={styles["date-range-header"]}>
                  <FaCalendarAlt />
                  <span>{t("trip_dates")}</span>
                </div>

                <div className={styles["form-row-split"]}>
                  <div className={styles["form-field"]}>
                    <label>{t("start_date")}</label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      min={todayStr}
                      className={errors.startDate ? styles.error : ""}
                    />
                    {errors.startDate && <span className={styles["field-error"]}>{errors.startDate}</span>}
                  </div>
                  <div className={styles["form-field"]}>
                    <label>{t("end_date")}</label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      min={formData.startDate || todayStr}
                      disabled={!formData.startDate}
                      className={errors.endDate ? styles.error : ""}
                    />
                    {errors.endDate && <span className={styles["field-error"]}>{errors.endDate}</span>}
                  </div>
                </div>

                {tripDurationDays !== null && tripDurationDays >= 0 && (
                  <div className={styles["duration-chip"]}>
                    {tripDurationDays === 0
                      ? t("duration_same_day")
                      : t("duration_days_count", { count: tripDurationDays })}
                  </div>
                )}
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

      {showPopup && bookingSummary && (
        <div className={styles.redirectModalOverlay} onClick={handleClosePopup}>
          <div className={styles.redirectModal} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={styles.closeButton}
              onClick={handleClosePopup}
              aria-label={t("close")}
            >
              &times;
            </button>

            <div className={styles.iconCircle}>
              <FaWhatsapp className={styles.icon} />
            </div>

            <h2>{t("whatsapp_redirect_title")}</h2>
            <p>{t("whatsapp_redirect_desc")}</p>

            <div className={styles.bookingSummaryCard}>
              <div className={styles.summaryRow}>
                <FaMapMarkerAlt />
                <span>{bookingSummary.tripName}</span>
              </div>
              <div className={styles.summaryRow}>
                <FaCalendarAlt />
                <span>
                  {bookingSummary.startDate} → {bookingSummary.endDate}
                </span>
              </div>
              <div className={styles.summaryRow}>
                <FaUserFriends />
                <span>
                  {bookingSummary.guests} {t("guests")}
                </span>
              </div>
            </div>

            <div className={styles.countdownBarTrack}>
              <div
                className={styles.countdownBarFill}
                style={{ width: `${(countdown / COUNTDOWN_SECONDS) * 100}%` }}
              />
            </div>
            <div className={styles.countdownText}>{t("redirecting_in_seconds", { seconds: countdown })}</div>

            <button className={styles.actionButton} onClick={handleManualRedirect}>
              <FaWhatsapp /> {t("go_to_whatsapp")}
            </button>
            <button className={styles.editButton} onClick={handleClosePopup}>
              {t("edit_details")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
