import { LogisticsDashboard } from "@/components/logistics/dashboard";
import { DeliveryPartnerGuard } from "@/components/logistics/delivery-partner-guard";

export const metadata = {
  title: "Logistics Dashboard - Gardenia Marketplace",
  description: "Manage your deliveries and track shipments",
};

export default function LogisticsDashboardPage() {
  return (
    <DeliveryPartnerGuard>
      <LogisticsDashboard />
    </DeliveryPartnerGuard>
  );
}