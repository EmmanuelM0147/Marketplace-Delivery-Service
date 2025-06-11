import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { FarmerDashboard } from "@/components/dashboard/farmer-dashboard";
import { BuyerDashboard } from "@/components/dashboard/buyer-dashboard";

export const metadata = {
  title: "Dashboard - Gardenia Marketplace",
  description: "Manage your agricultural business",
};

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies });
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth/sign-in");
  }

  const userRole = session.user.user_metadata.role;

  return (
    <div className="container py-8">
      {userRole === "farmer" ? (
        <FarmerDashboard user={session.user} />
      ) : (
        <BuyerDashboard user={session.user} />
      )}
    </div>
  );
}