import { Suspense } from "react";
import type { Metadata } from "next";
import AuthForm from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Login | Bedouin Trails",
  robots: { index: false, follow: false },
};

export default function AuthPage() {
  return (
    <Suspense fallback={null}>
      <AuthForm />
    </Suspense>
  );
}
