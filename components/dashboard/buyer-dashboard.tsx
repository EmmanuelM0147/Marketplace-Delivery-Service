"use client";

import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BuyerOrders } from "./buyer-orders";
import { BuyerFavorites } from "./buyer-favorites";
import { BuyerProfile } from "./buyer-profile";

interface BuyerDashboardProps {
  user: User;
}

export function BuyerDashboard({ user }: BuyerDashboardProps) {
  const [activeTab, setActiveTab] = useState("orders");

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Buyer Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your orders and preferences
          </p>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <TabsContent value="orders">
        <BuyerOrders userId={user.id} />
      </TabsContent>

      <TabsContent value="favorites">
        <BuyerFavorites userId={user.id} />
      </TabsContent>

      <TabsContent value="profile">
        <BuyerProfile user={user} />
      </TabsContent>
    </div>
  );
}