import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin/disputes/admin-dashboard";

export const metadata = {
  title: "Dispute Management - Admin Dashboard",
  description: "Manage and analyze dispute cases",
};

export default async function AdminDisputesPage() {
  const supabase = createServerComponentClient({ cookies });
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth/sign-in");
  }

  // Verify admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  if (profile?.role !== 'admin') {
    redirect("/dashboard");
  }

  return <AdminDashboard user={session.user} />;
}