"use client";

import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FarmerProducts } from "./farmer-products";
import { FarmerOrders } from "./farmer-orders";
import { FarmerAnalytics } from "./farmer-analytics";
import { FarmerProfile } from "./farmer-profile";

interface FarmerDashboardProps {
  user: User;
}

export function FarmerDashboard({ user }: FarmerDashboardProps) {
  const [activeTab, setActiveTab] = useState("products");

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Farmer Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your farm products and orders
          </p>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <TabsContent value="products">
        <FarmerProducts userId={user.id} />
      </TabsContent>

      <TabsContent value="orders">
        <FarmerOrders userId={user.id} />
      </TabsContent>

      <TabsContent value="analytics">
        <FarmerAnalytics userId={user.id} />
      </TabsContent>

      <TabsContent value="profile">
        <FarmerProfile user={user} />
      </TabsContent>
    </div>
  );
}