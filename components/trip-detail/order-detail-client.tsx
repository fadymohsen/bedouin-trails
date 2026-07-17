"use client";

import { useState } from "react";
import { useRouter } from "@/lib/i18n/navigation";
import { useTranslations } from "next-intl";
import { FaStar, FaTimes } from "react-icons/fa";
import TripHeroCarousel from "@/components/carousel/trip-hero-carousel";
import TripDayViewer, { type TripDayData } from "@/components/trip-detail/trip-day-viewer";
import ReviewCarousel from "@/components/carousel/review-carousel";
import BookingDetails, { type BookingDetailsData } from "@/components/booking-details/booking-details";
import { ExperienceCTA } from "@/components/call-to-action/call-to-action";
import { apiPost, ApiClientError } from "@/lib/api-client";
import sweetAlert from "@/lib/sweet-alert";
import type { TestimonialData } from "@/components/rating-card/rating-card";
import styles from "./trip-detail.module.scss";

type OrderStatus = "pending" | "accepted" | "paid" | "cancelled";

const STATUS_STEPS: Record<"active" | "cancelled", { key: string; labelKey: string }[]> = {
  cancelled: [
    { key: "cancelled", labelKey: "booking_cancelled" },
    { key: "pending", labelKey: "booking_pending" },
  ],
  active: [
    { key: "accepted", labelKey: "booking_completed" },
    { key: "paid", labelKey: "booking_paid" },
    { key: "pending", labelKey: "booking_pending" },
  ],
};

export default function OrderDetailClient({
  orderId,
  status,
  tripName,
  interfaceFrom,
  interfaceTo,
  images,
  days,
  reviews,
  booking,
}: {
  orderId: number;
  status: OrderStatus;
  tripName: string;
  interfaceFrom: string;
  interfaceTo: string;
  images: string[];
  days: TripDayData[];
  reviews: TestimonialData[];
  booking: BookingDetailsData;
}) {
  const t = useTranslations();
  const router = useRouter();
  const [bookingData, setBookingData] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleCancel() {
    const confirmed = await sweetAlert.confirm(t("cancel"), undefined, t("cancel"), t("back"));
    if (!confirmed.isConfirmed) return;
    try {
      const res = await fetch(`/api/orders/${orderId}`, { method: "PUT", credentials: "same-origin" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.status === false) throw new ApiClientError(data.message || "Something went wrong.");
      sweetAlert.success(t("order_cancelled_success"));
      router.refresh();
    } catch (err) {
      sweetAlert.error(err instanceof ApiClientError ? err.message : t("error_occurred"));
    }
  }

  async function handleAddReview() {
    if (rating === 0) return sweetAlert.warning(t("please_select_star_rating"));
    setSubmitting(true);
    try {
      await apiPost("/api/reviews", { orderId, stars: rating, comment });
      sweetAlert.success(t("rating_added_successfully"));
      setShowPopup(false);
      setRating(0);
      setComment("");
      router.refresh();
    } catch (err) {
      sweetAlert.warning(err instanceof ApiClientError ? err.message : t("rating_submit_failed"));
    } finally {
      setSubmitting(false);
    }
  }

  const steps = STATUS_STEPS[status === "cancelled" ? "cancelled" : "active"];
  const activeIndex = status === "cancelled" ? 0 : status === "accepted" ? 0 : status === "paid" ? 1 : 2;

  return (
    <div className={styles.Card_page}>
      {showPopup && (
        <div className={styles["rating-overlay"]}>
          <div className={styles["rating-modal"]}>
            <button className={styles["close-btn"]} onClick={() => setShowPopup(false)}>
              <FaTimes />
            </button>
            <h3>{t("service_rating")}</h3>
            <div className={styles["stars-row"]}>
              {[1, 2, 3, 4, 5].map((num) => (
                <FaStar
                  key={num}
                  color={num <= rating ? "#ffc107" : "#e4e5e9"}
                  onClick={() => setRating(num)}
                  size={35}
                  style={{ cursor: "pointer" }}
                />
              ))}
            </div>
            <textarea
              placeholder={t("write_your_comment")}
              className={styles["review-textarea"]}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button className={styles["submit-btn"]} onClick={handleAddReview} disabled={submitting}>
              {t("submit_rating")}
            </button>
          </div>
        </div>
      )}

      <div className={styles.Carousel}>
        <TripHeroCarousel images={images} isOrder orderStatus={status} onCancel={handleCancel} />
      </div>

      <div className={styles["part-1"]}>
        <div className={styles.leftP}>
          <h1>{tripName}</h1>
          <div className={styles.dates}>
            <div className={styles.start}>
              <p>{interfaceFrom}</p>
              <p>{t("departure_point")}</p>
            </div>
            <img src="/img/small-logo.png" alt="Bedouin Trails desert safari company logo" />
            <div className={styles.end}>
              <p>{interfaceTo}</p>
              <p>{t("destination_point")}</p>
            </div>
          </div>
        </div>

        <div className={styles.rightP}>
          <div className={styles.btnsntrack}>
            <div className={styles.DataBtns}>
              <button className={bookingData ? styles.active : ""} onClick={() => setBookingData(true)}>
                {t("booking_data")}
              </button>
              <button className={!bookingData ? styles.active : ""} onClick={() => setBookingData(false)}>
                {t("trip_data")}
              </button>
            </div>
            <div className={styles.stepper}>
              <div className={styles.stepper__steps}>
                {steps.map((step, i) => {
                  const isActive = i === activeIndex;
                  const isCancelled = status === "cancelled";
                  return (
                    <div className={styles.stepper__step} key={step.key}>
                      <div
                        className={styles.stepper__dot}
                        style={
                          isActive
                            ? {
                                background: isCancelled ? "#e03535" : "#3b6fd4",
                                border: `2px solid ${isCancelled ? "#e03535" : "#3b6fd4"}`,
                                boxShadow: `0 0 0 5px ${isCancelled ? "rgba(224,53,53,0.2)" : "rgba(59,111,212,0.2)"}`,
                                width: 16,
                                height: 16,
                              }
                            : {}
                        }
                      />
                      <span
                        className={styles.stepper__label}
                        style={isActive ? { color: isCancelled ? "#e03535" : "#1a1a1a", fontWeight: 700 } : {}}
                      >
                        {t(step.labelKey)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {!bookingData ? (
        <>
          <TripDayViewer days={days} interfaceFrom={interfaceFrom} interfaceTo={interfaceTo} />

          <div className={styles["part-3"]}>
            <h1>{t("customer_reviews")}</h1>
            {reviews.length > 0 ? (
              <ReviewCarousel data={reviews} />
            ) : (
              <div style={{ textAlign: "center", padding: "30px", background: "#f9f9f9", borderRadius: "12px", color: "#999" }}>
                <p>{t("no_reviews_yet")}</p>
              </div>
            )}
          </div>

          {status !== "cancelled" && (
            <div className={styles["part-4"]}>
              <ExperienceCTA onTriggerRating={() => setShowPopup(true)} />
            </div>
          )}
        </>
      ) : (
        <BookingDetails data={booking} />
      )}
    </div>
  );
}
