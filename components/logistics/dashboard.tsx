"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActiveDeliveries } from "./active-deliveries";
import { DeliveryHistory } from "./delivery-history";
import { DeliveryAnalytics } from "./delivery-analytics";
import { DeliveryPartnerProfile } from "./delivery-partner-profile";

export function LogisticsDashboard() {
  const [activeTab, setActiveTab] = useState("active");

  return (
    <div className="container py-8">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Logistics Dashboard</h1>
          <TabsList>
            <TabsTrigger value="active">Active Deliveries</TabsTrigger>
            <TabsTrigger value="history">Delivery History</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="active">
          <ActiveDeliveries />
        </TabsContent>

        <TabsContent value="history">
          <DeliveryHistory />
        </TabsContent>

        <TabsContent value="analytics">
          <DeliveryAnalytics />
        </TabsContent>

        <TabsContent value="profile">
          <DeliveryPartnerProfile />
        </TabsContent>
      </Tabs>
    </div>
  );
}