"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, Car, MapPin } from "lucide-react";
import { toast } from "sonner";

interface FareEstimate {
  breakdown: Array<{
    description: string;
    amount: number;
  }>;
  totalEstimate: number;
  surgeMultiplier: number;
  estimatedDuration: number;
  estimatedDistance: number;
}

export function FareEstimator() {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [rideType, setRideType] = useState("economy");
  const [estimate, setEstimate] = useState<FareEstimate | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEstimate = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/rides/fare/estimate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pickup: { latitude: 0, longitude: 0 }, // Replace with actual coordinates
          destination: { latitude: 0, longitude: 0 }, // Replace with actual coordinates
          rideType,
        }),
      });

      if (!response.ok) throw new Error("Failed to get estimate");

      const data = await response.json();
      setEstimate(data);
    } catch (error) {
      console.error("Estimation error:", error);
      toast.error("Failed to get fare estimate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Fare Estimate</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pickup location"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Car className="h-4 w-4 text-muted-foreground" />
            <Select value={rideType} onValueChange={setRideType}>
              <SelectTrigger>
                <SelectValue placeholder="Select ride type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="economy">Economy</SelectItem>
                <SelectItem value="comfort">Comfort</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleEstimate}
            disabled={!pickup || !destination || loading}
            className="w-full"
          >
            {loading ? "Calculating..." : "Get Estimate"}
          </Button>
        </CardContent>
      </Card>

      {estimate && (
        <Card>
          <CardHeader>
            <CardTitle>Fare Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {estimate.surgeMultiplier > 1 && (
              <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-500">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">
                  Surge pricing ({estimate.surgeMultiplier}x) is currently in effect
                </span>
              </div>
            )}

            <div className="space-y-2">
              {estimate.breakdown.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-muted-foreground">
                    {item.description}
                  </span>
                  <span>${item.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between font-semibold">
                <span>Total Estimate</span>
                <span>${estimate.totalEstimate.toFixed(2)}</span>
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>
                Estimated distance: {estimate.estimatedDistance.toFixed(1)} km
              </p>
              <p>
                Estimated duration: {estimate.estimatedDuration} minutes
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}