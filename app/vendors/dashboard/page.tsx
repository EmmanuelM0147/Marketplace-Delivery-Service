import { VendorDashboard } from "@/components/vendors/dashboard";
import { VendorGuard } from "@/components/vendors/vendor-guard";

export const metadata = {
  title: "Vendor Dashboard - Gardenia Marketplace",
  description: "Manage your agricultural supply business",
};

export default function VendorDashboardPage() {
  return (
    <VendorGuard>
      <VendorDashboard />
    </VendorGuard>
  );
}