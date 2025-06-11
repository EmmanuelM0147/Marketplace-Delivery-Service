"use client";

import { useState } from "react";
import { User } from "@supabase/auth-helpers-nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DisputeList } from "./dispute-list";
import { DisputeForm } from "./dispute-form";
import { DisputeStats } from "./dispute-stats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DisputeDashboardProps {
  user: User;
}

export function DisputeDashboard({ user }: DisputeDashboardProps) {
  const [activeTab, setActiveTab] = useState("active");

  return (
    <div className="container py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Dispute Resolution Center</h1>
          <p className="text-muted-foreground">
            Track and manage your ride disputes
          </p>
        </div>

        <DisputeStats userId={user.id} />

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="active">Active Disputes</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
            <TabsTrigger value="new">File New Dispute</TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            <DisputeList 
              userId={user.id} 
              status="active" 
            />
          </TabsContent>

          <TabsContent value="resolved">
            <DisputeList 
              userId={user.id} 
              status="resolved" 
            />
          </TabsContent>

          <TabsContent value="new">
            <Card>
              <CardHeader>
                <CardTitle>File a New Dispute</CardTitle>
              </CardHeader>
              <CardContent>
                <DisputeForm userId={user.id} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}