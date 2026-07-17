import { Link } from "@/lib/i18n/navigation";
import { getTranslations } from "next-intl/server";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer/footer";

export const metadata = {
  title: "404 - Page Not Found | Bedouin Trails",
  robots: "noindex",
};

export default async function NotFound() {
  const t = await getTranslations();

  return (
    <>
      <Navbar />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          textAlign: "center",
          padding: "40px 20px",
        }}
      >
        <h1 style={{ fontSize: "6rem", color: "#CF9050", marginBottom: "0" }}>404</h1>
        <h2 style={{ color: "#333", marginBottom: "16px" }}>Page Not Found</h2>
        <p style={{ color: "#666", marginBottom: "32px", maxWidth: "400px" }}>
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          style={{
            background: "#CF9050",
            color: "#fff",
            padding: "12px 32px",
            borderRadius: "8px",
            fontSize: "1rem",
            textDecoration: "none",
          }}
        >
          {t("home")}
        </Link>
      </div>
      <Footer />
    </>
  );
}
