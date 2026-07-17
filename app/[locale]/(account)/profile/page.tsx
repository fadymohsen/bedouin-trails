import type { Metadata } from "next";
import { getUserSession } from "@/lib/auth/session";
import { getUserProfile } from "@/lib/services/profile";
import ProfileClient from "@/components/profile/profile-client";

export const metadata: Metadata = {
  title: "Profile | Bedouin Trails",
  robots: { index: false, follow: false },
};

export default async function ProfilePage() {
  const session = await getUserSession();
  const user = await getUserProfile(session!.uid);

  return (
    <ProfileClient
      user={{
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        image: user.image,
      }}
    />
  );
}
