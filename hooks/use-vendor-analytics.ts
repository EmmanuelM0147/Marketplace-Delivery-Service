"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

export function useVendorAnalytics() {
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    revenueGrowth: 0,
    totalOrders: 0,
    orderGrowth: 0,
    averageOrderValue: 0,
    totalProductsSold: 0,
    revenueData: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const { data: vendorId } = await supabase.auth.getSession();
        if (!vendorId) return;

        const { data, error } = await supabase
          .from("vendor_analytics")
          .select("*")
          .eq("vendor_id", vendorId)
          .order("date", { ascending: true });

        if (error) throw error;

        // Process analytics data
        const processedData = {
          totalRevenue: data.reduce((sum, day) => sum + day.total_revenue, 0),
          revenueGrowth: calculateGrowth(data, "total_revenue"),
          totalOrders: data.reduce((sum, day) => sum + day.total_orders, 0),
          orderGrowth: calculateGrowth(data, "total_orders"),
          averageOrderValue:
            data.reduce((sum, day) => sum + day.average_order_value, 0) /
            data.length,
          totalProductsSold: data.reduce(
            (sum, day) => sum + day.total_products_sold,
            0
          ),
          revenueData: data.map((day) => ({
            date: day.date,
            revenue: day.total_revenue,
          })),
        };

        setAnalytics(processedData);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  return { analytics, isLoading };
}

function calculateGrowth(data: any[], key: string) {
  if (data.length < 2) return 0;
  const current = data[data.length - 1][key];
  const previous = data[data.length - 2][key];
  return ((current - previous) / previous) * 100;
}