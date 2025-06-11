"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, DollarSign, MapPin, TrendingDown, TrendingUp } from "lucide-react";

interface LiveFare {
  currentFare: number;
  initialEstimate: number;
  timeRemaining: number;
  distanceRemaining: number;
  routeEfficiency: number;
  fareAdjustments: Array<{
    reason: string;
    amount: number;
  }>;
}

export function LiveFareTracker() {
  const [fare, setFare] = useState<LiveFare>({
    currentFare: 0,
    initialEstimate: 0,
    timeRemaining: 0,
    distanceRemaining: 0,
    routeEfficiency: 0,
    fareAdjustments: [],
  });

  useEffect(() => {
    // Subscribe to real-time fare updates
    const unsubscribe = subscribeToFareUpdates((update) => {
      setFare(update);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Live Fare Tracker</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Current Fare</p>
              <p className="text-2xl font-bold">
                ${fare.currentFare.toFixed(2)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Initial Estimate</p>
              <p className="text-lg">
                ${fare.initialEstimate.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Time Remaining</span>
              </div>
              <span>{fare.timeRemaining} min</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Distance Remaining</span>
              </div>
              <span>{fare.distanceRemaining.toFixed(1)} km</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                {fare.routeEfficiency >= 0.9 ? (
                  <TrendingDown className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingUp className="h-4 w-4 text-yellow-500" />
                )}
                <span>Route Efficiency</span>
              </div>
              <span>{(fare.routeEfficiency * 100).toFixed(0)}%</span>
            </div>
          </div>

          {fare.fareAdjustments.length > 0 && (
            <div className="border-t pt-4">
              <p className="text-sm font-semibold mb-2">Fare Adjustments</p>
              {fare.fareAdjustments.map((adjustment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-muted-foreground">
                    {adjustment.reason}
                  </span>
                  <span
                    className={
                      adjustment.amount < 0
                        ? "text-green-500"
                        : "text-yellow-500"
                    }
                  >
                    {adjustment.amount < 0 ? "-" : "+"}$
                    {Math.abs(adjustment.amount).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Mock function for real-time fare updates
function subscribeToFareUpdates(callback: (update: LiveFare) => void) {
  const interval = setInterval(() => {
    callback({
      currentFare: Math.random() * 50,
      initialEstimate: 45,
      timeRemaining: Math.floor(Math.random() * 20),
      distanceRemaining: Math.random() * 10,
      routeEfficiency: Math.random(),
      fareAdjustments: [
        {
          reason: "Traffic Detour",
          amount: 2.50,
        },
      ],
    });
  }, 5000);

  return () => clearInterval(interval);
}