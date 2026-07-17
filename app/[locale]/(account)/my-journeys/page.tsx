import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { getUserSession } from "@/lib/auth/session";
import { getMyOrders } from "@/lib/services/orders";
import { mapTrapForCard } from "@/lib/mappers/trap";
import type { Locale } from "@/lib/i18n/config";
import Card from "@/components/card/card";
import styles from "@/components/my-journeys/my-journeys.module.scss";

export const metadata: Metadata = {
  title: "My Journeys | Bedouin Trails",
  robots: { index: false, follow: false },
};

export default async function MyJourneysPage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations();
  const session = await getUserSession();

  const orders = await getMyOrders(session!.uid);

  return (
    <div className={styles["my-journeys-container"]}>
      <div className={styles["cards-container"]}>
        <h1>{t("my_experiences_and_journeys")}</h1>

        {orders.length === 0 ? (
          <div className={styles["no-orders"]}>
            <p>{t("no_bookings")}</p>
          </div>
        ) : (
          <div className={styles["orders-grid"]}>
            {orders.map((order) => (
              <Card key={order.id} data={mapTrapForCard(order.trap, locale)} href={`/my-journeys/${order.id}`} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
