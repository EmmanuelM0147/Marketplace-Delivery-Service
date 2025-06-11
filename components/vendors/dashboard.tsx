"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VendorProducts } from "./vendor-products";
import { VendorOrders } from "./vendor-orders";
import { VendorAnalytics } from "./vendor-analytics";
import { VendorProfile } from "./vendor-profile";

export function VendorDashboard() {
  const [activeTab, setActiveTab] = useState("products");

  return (
    <div className="container py-8">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Vendor Dashboard</h1>
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="products">
          <VendorProducts />
        </TabsContent>

        <TabsContent value="orders">
          <VendorOrders />
        </TabsContent>

        <TabsContent value="analytics">
          <VendorAnalytics />
        </TabsContent>

        <TabsContent value="profile">
          <VendorProfile />
        </TabsContent>
      </Tabs>
    </div>
  );
}