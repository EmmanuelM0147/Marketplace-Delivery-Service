"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePickerWithRange } from "@/components/ui/date-picker";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = {
  critical: "hsl(var(--destructive))",
  high: "hsl(var(--warning))",
  medium: "hsl(var(--info))",
  low: "hsl(var(--success))",
};

export function DisputeAnalytics() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>();
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  async function fetchAnalytics() {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (dateRange?.from) params.append('startDate', dateRange.from.toISOString());
      if (dateRange?.to) params.append('endDate', dateRange.to.toISOString());

      const response = await fetch(`/api/admin/disputes/analytics?${params}`);
      if (!response.ok) throw new Error("Failed to fetch analytics");

      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error("Analytics error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return <div>Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Dispute Analytics</h2>
        <DatePickerWithRange
          value={dateRange}
          onChange={setDateRange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Resolution Time Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Resolution Time by Severity</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.resolutionTimes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="severity" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="resolutionTime"
                  fill="hsl(var(--primary))"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={Object.entries(analytics?.statusDistribution || {}).map(
                    ([name, value]) => ({ name, value })
                  )}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {Object.entries(analytics?.statusDistribution || {}).map(
                    (entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={`hsl(var(--chart-${(index % 5) + 1}))`}
                      />
                    )
                  )}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Trends */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Category Trends</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={Object.entries(analytics?.categoryTrends || {}).map(
                ([date, categories]: [string, any]) => ({
                  date,
                  ...categories,
                })
              )}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                {Object.keys(analytics?.categoryTrends?.[0] || {}).map(
                  (category, index) => (
                    <Line
                      key={category}
                      type="monotone"
                      dataKey={category}
                      stroke={`hsl(var(--chart-${(index % 5) + 1}))`}
                      strokeWidth={2}
                    />
                  )
                )}
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}