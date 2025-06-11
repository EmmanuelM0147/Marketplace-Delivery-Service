import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { DisputeDashboard } from "@/components/disputes/dispute-dashboard";

export const metadata = {
  title: "Dispute Resolution - Gardenia Rides",
  description: "Track and manage your ride disputes",
};

export default async function DisputesPage() {
  const supabase = createServerComponentClient({ cookies });
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth/sign-in");
  }

  return <DisputeDashboard user={session.user} />;
}