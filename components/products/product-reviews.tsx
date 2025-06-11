"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ProductReviewsProps {
  productId: string;
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  // TODO: Fetch real reviews from the database
  const [reviews] = useState([
    {
      id: 1,
      rating: 5,
      comment: "Great product! Exactly as described.",
      author: "John Doe",
      date: "2024-03-15",
    },
    {
      id: 2,
      rating: 4,
      comment: "Good quality but shipping took longer than expected.",
      author: "Jane Smith",
      date: "2024-03-14",
    },
  ]);

  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
      
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating ? "fill-yellow-400" : "fill-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-base font-normal text-muted-foreground">
                  by {review.author}
                </span>
              </CardTitle>
              <CardDescription>{review.date}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{review.comment}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button className="mt-6">Write a Review</Button>
    </section>
  );
}