"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

interface AddToCartProps {
  product: {
    id: string;
    name: string;
    price: number;
    inventory_count: number;
  };
}

export function AddToCart({ product }: AddToCartProps) {
  const [quantity, setQuantity] = useState(1);

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    if (quantity < product.inventory_count) {
      setQuantity(quantity + 1);
    }
  };

  const addToCart = () => {
    // TODO: Implement cart functionality
    toast.success(`Added ${quantity} ${product.name} to cart`);
  };

  if (product.inventory_count === 0) {
    return (
      <Button disabled className="w-full">
        Out of Stock
      </Button>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={decreaseQuantity}
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Input
            type="number"
            min="1"
            max={product.inventory_count}
            value={quantity}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (value >= 1 && value <= product.inventory_count) {
                setQuantity(value);
              }
            }}
            className="w-20 text-center mx-2"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={increaseQuantity}
            disabled={quantity >= product.inventory_count}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <Button onClick={addToCart} className="flex-1">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        {product.inventory_count} items available
      </p>
    </div>
  );
}