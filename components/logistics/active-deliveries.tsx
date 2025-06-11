"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, ThermometerSun, Truck } from "lucide-react";
import { useDeliveryOrders } from "@/hooks/use-delivery-orders";
import { DeliveryMap } from "./delivery-map";
import { UpdateDeliveryStatus } from "./update-delivery-status";

export function ActiveDeliveries() {
  const { activeDeliveries, isLoading, updateDeliveryStatus } = useDeliveryOrders();
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);

  if (isLoading) {
    return <div>Loading deliveries...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        {activeDeliveries.map((delivery) => (
          <Card
            key={delivery.id}
            className={`cursor-pointer transition-colors ${
              selectedDelivery?.id === delivery.id
                ? "border-primary"
                : "hover:border-primary/50"
            }`}
            onClick={() => setSelectedDelivery(delivery)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  Order #{delivery.order_id}
                </CardTitle>
                <Badge variant={getStatusVariant(delivery.status)}>
                  {delivery.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {delivery.pickup_location.address} →{" "}
                    {delivery.delivery_location.address}
                  </span>
                </div>
                {delivery.temperature_log && (
                  <div className="flex items-center gap-2 text-sm">
                    <ThermometerSun className="h-4 w-4" />
                    <span>
                      Temperature: {getLatestTemperature(delivery.temperature_log)}°C
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Truck className="h-4 w-4" />
                  <span>
                    Scheduled: {formatDateTime(delivery.scheduled_delivery)}
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <Button
                  className="w-full"
                  onClick={() => setShowStatusUpdate(true)}
                >
                  Update Status
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="h-[600px] rounded-lg overflow-hidden">
        <DeliveryMap
          deliveries={activeDeliveries}
          selectedDelivery={selectedDelivery}
        />
      </div>

      <UpdateDeliveryStatus
        open={showStatusUpdate}
        onOpenChange={setShowStatusUpdate}
        delivery={selectedDelivery}
        onUpdate={updateDeliveryStatus}
      />
    </div>
  );
}

function getStatusVariant(status: string) {
  switch (status) {
    case "pending":
      return "secondary";
    case "assigned":
      return "warning";
    case "in_transit":
      return "default";
    case "delivered":
      return "success";
    case "failed":
      return "destructive";
    default:
      return "default";
  }
}

function getLatestTemperature(log: any[]) {
  if (!log || !log.length) return "N/A";
  return log[log.length - 1].temperature;
}

function formatDateTime(date: string) {
  return new Date(date).toLocaleString();
}