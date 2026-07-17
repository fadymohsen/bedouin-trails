import { Link } from "@/lib/i18n/navigation";
import { FaStar } from "react-icons/fa";
import { useTranslations } from "next-intl";
import type { TripCardData } from "@/lib/mappers/trap";
import styles from "./card.module.scss";

type CardProps = {
  data: TripCardData;
  href?: string;
};

export default function Card({ data, href }: CardProps) {
  const t = useTranslations();
  if (!data) return null;

  const targetHref = href ?? `/journeys/${data.slug}`;

  return (
    <div className={`${styles.safariCard} safari-card`}>
      <div className={styles.imageContainer}>
        {data.rate > 0 && (
          <div className={styles.ratingBadge}>
            <span>
              <FaStar size={20} /> {data.rate}
            </span>
          </div>
        )}

        <img
          src={data.image || "/img/adventure1.webp"}
          alt={data.name}
          loading="lazy"
          width="100%"
          height="auto"
        />
      </div>

      <div className={styles.titleBadge}>
        <h2>{data.name}</h2>
      </div>

      <div className={styles.infoSection}>
        <div className={styles.locationRow}>
          <div className={styles.locItem}>
            <span className={styles.date}>{t("destination_point")}</span>
            <span className={styles.name}>{data.interfaceTo}</span>
          </div>

          <div className={styles.locItem}>
            <span className={styles.date}>{t("starting_point")}</span>
            <span className={styles.name}>{data.interfaceFrom}</span>
          </div>
        </div>

        <div className={styles.statsRow}>
          <div className={styles.statPill}>
            {data.duration} {t("days")}
          </div>
        </div>

        <Link href={targetHref} className={styles.detailsLink}>
          <button className={styles.detailsBtn}>{t("view_details")}</button>
        </Link>
      </div>
    </div>
  );
}
