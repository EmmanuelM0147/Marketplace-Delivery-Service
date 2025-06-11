"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

interface ProductGridProps {
  products: any[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => {
        const primaryImage = product.images.find((img: any) => img.is_primary);
        
        return (
          <Link key={product.id} href={`/products/${product.slug}`}>
            <Card className="group cursor-pointer overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-square relative">
                  <Image
                    src={primaryImage?.url || "https://via.placeholder.com/400"}
                    alt={primaryImage?.alt_text || product.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold truncate">{product.name}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-primary font-medium">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className={product.inventory_count > 0 ? "text-green-600 text-sm" : "text-red-600 text-sm"}>
                      {product.inventory_count > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>
                  {product.category && (
                    <span className="text-muted-foreground text-sm block mt-2">
                      {product.category.name}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}