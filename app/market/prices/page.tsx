import { Suspense } from "react";
import { PricingDashboard } from "@/components/market/pricing-dashboard";
import { PricingFilters } from "@/components/market/pricing-filters";
import { PriceAlerts } from "@/components/market/price-alerts";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = {
  title: "Market Prices - Gardenia Marketplace",
  description: "Real-time agricultural commodity prices and market trends",
};

export default function MarketPricesPage() {
  return (
    <div className="container py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Market Prices</h1>
          <p className="text-muted-foreground">
            Real-time agricultural commodity prices and market trends
          </p>
        </div>

        <PricingFilters />

        <Suspense fallback={<Skeleton className="h-[600px]" />}>
          <PricingDashboard />
        </Suspense>

        <PriceAlerts />
      </div>
    </div>
  );
}