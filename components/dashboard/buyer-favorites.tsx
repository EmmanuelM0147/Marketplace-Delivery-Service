"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BuyerFavoritesProps {
  userId: string;
}

export function BuyerFavorites({ userId }: BuyerFavoritesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Favorite Products</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Your favorite products will be displayed here</p>
      </CardContent>
    </Card>
  );
}