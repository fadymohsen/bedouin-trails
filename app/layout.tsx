import type { Metadata } from "next";
import "@fontsource/el-messiri";
import "@fontsource/el-messiri/400.css";
import "@fontsource/el-messiri/500.css";
import "@fontsource/el-messiri/600.css";
import "@fontsource/el-messiri/700.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bedouin Trails",
  description:
    "Desert safari and tour experiences in Egypt's Western Desert and White Desert National Park.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
