"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";

export function useDeliveryOrders() {
  const [activeDeliveries, setActiveDeliveries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDeliveries();
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel('delivery_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'delivery_orders',
        },
        (payload) => {
          handleDeliveryUpdate(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchDeliveries() {
    try {
      const { data: partnerId } = await supabase.auth.getSession();
      if (!partnerId) return;

      const { data, error } = await supabase
        .from("delivery_orders")
        .select("*")
        .eq("delivery_partner_id", partnerId)
        .in("status", ["pending", "assigned", "in_transit"])
        .order("scheduled_pickup", { ascending: true });

      if (error) throw error;
      setActiveDeliveries(data);
    } catch (error) {
      console.error("Error fetching deliveries:", error);
      toast.error("Failed to load deliveries");
    } finally {
      setIsLoading(false);
    }
  }

  async function updateDeliveryStatus(deliveryId: string, status: string, updates: any = {}) {
    try {
      const { error } = await supabase
        .from("delivery_orders")
        .update({
          status,
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", deliveryId);

      if (error) throw error;
      toast.success("Delivery status updated");
      
      // Optimistically update the local state
      setActiveDeliveries((current) =>
        current.map((delivery) =>
          delivery.id === deliveryId
            ? { ...delivery, status, ...updates }
            : delivery
        )
      );
    } catch (error) {
      console.error("Error updating delivery status:", error);
      toast.error("Failed to update delivery status");
    }
  }

  function handleDeliveryUpdate(updatedDelivery: any) {
    setActiveDeliveries((current) =>
      current.map((delivery) =>
        delivery.id === updatedDelivery.id ? updatedDelivery : delivery
      )
    );
  }

  return {
    activeDeliveries,
    isLoading,
    updateDeliveryStatus,
  };
}