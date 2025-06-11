"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, TrendingDown, TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";

interface PriceData {
  commodity: string;
  currentPrice: number;
  previousPrice: number;
  dayHigh: number;
  dayLow: number;
  volume: number;
  priceHistory: {
    timestamp: string;
    price: number;
  }[];
  qualityGrades: {
    grade: string;
    price: number;
  }[];
  marketDemand: "high" | "medium" | "low";
  weatherImpact: {
    condition: string;
    impact: string;
  };
  transportCosts: {
    from: string;
    to: string;
    cost: number;
  }[];
}

export function PricingDashboard() {
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d">("24h");
  const [selectedMarket, setSelectedMarket] = useState("lagos");

  const { data: priceData, isLoading } = useQuery({
    queryKey: ["prices", timeRange, selectedMarket],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("market_prices")
        .select("*")
        .eq("market", selectedMarket)
        .order("timestamp", { ascending: false })
        .limit(1);

      if (error) throw error;
      return data[0] as PriceData;
    },
    refetchInterval: 15 * 60 * 1000, // Refetch every 15 minutes
  });

  const priceChange = priceData
    ? ((priceData.currentPrice - priceData.previousPrice) /
        priceData.previousPrice) *
      100
    : 0;

  const exportData = async () => {
    // Implement CSV export
  };

  if (isLoading) {
    return <div>Loading price data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Price</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">
                  ₦{priceData?.currentPrice.toFixed(2)}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  {priceChange >= 0 ? (
                    <TrendingUp className="text-green-500" />
                  ) : (
                    <TrendingDown className="text-red-500" />
                  )}
                  <span
                    className={
                      priceChange >= 0 ? "text-green-500" : "text-red-500"
                    }
                  >
                    {Math.abs(priceChange).toFixed(2)}%
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Volume</p>
                <p className="font-medium">{priceData?.volume.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Day Range</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Low</span>
                <span className="font-medium">₦{priceData?.dayLow.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">High</span>
                <span className="font-medium">
                  ₦{priceData?.dayHigh.toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Market Demand</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div
                className={`text-lg font-medium capitalize ${
                  priceData?.marketDemand === "high"
                    ? "text-green-500"
                    : priceData?.marketDemand === "medium"
                    ? "text-yellow-500"
                    : "text-red-500"
                }`}
              >
                {priceData?.marketDemand}
              </div>
              <p className="text-sm text-muted-foreground">
                Based on current trading volume and price movement
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Price History</CardTitle>
          <div className="flex items-center gap-4">
            <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as any)}>
              <TabsList>
                <TabsTrigger value="24h">24H</TabsTrigger>
                <TabsTrigger value="7d">7D</TabsTrigger>
                <TabsTrigger value="30d">30D</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button variant="outline" size="sm" onClick={exportData}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={priceData?.priceHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={(value) =>
                    new Date(value).toLocaleTimeString()
                  }
                />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [`₦${value}`, "Price"]}
                  labelFormatter={(label) =>
                    new Date(label).toLocaleString()
                  }
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quality Grades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {priceData?.qualityGrades.map((grade) => (
                <div
                  key={grade.grade}
                  className="flex items-center justify-between"
                >
                  <span className="font-medium">Grade {grade.grade}</span>
                  <span>₦{grade.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weather Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="font-medium">{priceData?.weatherImpact.condition}</p>
              <p className="text-sm text-muted-foreground">
                {priceData?.weatherImpact.impact}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}