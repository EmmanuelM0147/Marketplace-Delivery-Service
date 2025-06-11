"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Bell, Plus, Trash } from "lucide-react";
import { toast } from "sonner";

interface PriceAlert {
  id: string;
  commodity: string;
  condition: "above" | "below";
  price: number;
  active: boolean;
}

export function PriceAlerts() {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [newAlert, setNewAlert] = useState({
    commodity: "",
    condition: "above" as const,
    price: 0,
  });

  const addAlert = () => {
    if (!newAlert.commodity || !newAlert.price) {
      toast.error("Please fill in all fields");
      return;
    }

    setAlerts([
      ...alerts,
      {
        id: crypto.randomUUID(),
        ...newAlert,
        active: true,
      },
    ]);

    setNewAlert({
      commodity: "",
      condition: "above",
      price: 0,
    });

    toast.success("Price alert created");
  };

  const removeAlert = (id: string) => {
    setAlerts(alerts.filter((alert) => alert.id !== id));
    toast.success("Price alert removed");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Price Alerts</CardTitle>
        <CardDescription>
          Get notified when prices reach your target levels
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <Select
              value={newAlert.commodity}
              onValueChange={(value) =>
                setNewAlert({ ...newAlert, commodity: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select commodity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rice">Rice</SelectItem>
                <SelectItem value="maize">Maize</SelectItem>
                <SelectItem value="tomatoes">Tomatoes</SelectItem>
                <SelectItem value="yam">Yam</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={newAlert.condition}
              onValueChange={(value: "above" | "below") =>
                setNewAlert({ ...newAlert, condition: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="above">Above</SelectItem>
                <SelectItem value="below">Below</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="number"
              placeholder="Price"
              value={newAlert.price || ""}
              onChange={(e) =>
                setNewAlert({ ...newAlert, price: parseFloat(e.target.value) })
              }
            />

            <Button onClick={addAlert}>
              <Plus className="h-4 w-4 mr-2" />
              Add Alert
            </Button>
          </div>

          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-primary" />
                  <span className="font-medium capitalize">
                    {alert.commodity}
                  </span>
                  <span className="text-muted-foreground">
                    {alert.condition} ₦{alert.price}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAlert(alert.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}