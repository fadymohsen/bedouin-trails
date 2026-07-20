import { Link } from "@/lib/i18n/navigation";
import { FaStar } from "react-icons/fa";
import { useTranslations } from "next-intl";
import SafeImage from "@/components/safe-image/safe-image";
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
    <Link href={targetHref} className={`${styles.safariCard} safari-card`}>
      <div className={styles.imageContainer}>
        {data.rate > 0 && (
          <div className={styles.ratingBadge}>
            <span>
              <FaStar size={20} /> {data.rate}
            </span>
          </div>
        )}

        <SafeImage
          src={data.image || "/img/adventure1.webp"}
          alt={data.name}
          loading="lazy"
          fill
          style={{ objectFit: "cover" }}
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

        <span className={styles.detailsBtn}>{t("view_details")}</span>
      </div>
    </Link>
  );
}
