"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BuyerOrdersProps {
  userId: string;
}

export function BuyerOrders({ userId }: BuyerOrdersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Order history will be displayed here</p>
      </CardContent>
    </Card>
  );
}