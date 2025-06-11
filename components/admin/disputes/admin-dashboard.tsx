"use client";

import { useState } from "react";
import { User } from "@supabase/auth-helpers-nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DisputeAnalytics } from "./dispute-analytics";
import { DisputeManagement } from "./dispute-management";
import { UserManagement } from "./user-management";
import { SystemLogs } from "./system-logs";

interface AdminDashboardProps {
  user: User;
}

export function AdminDashboard({ user }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("analytics");

  return (
    <div className="container py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage disputes and analyze system performance
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="disputes">Dispute Management</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="logs">System Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics">
            <DisputeAnalytics />
          </TabsContent>

          <TabsContent value="disputes">
            <DisputeManagement />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="logs">
            <SystemLogs />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}