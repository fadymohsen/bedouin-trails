import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer/footer";

export default function MyJourneysLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="page-content">{children}</div>
      <Footer />
    </>
  );
}
