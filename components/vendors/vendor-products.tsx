"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProductForm } from "./product-form";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./products-columns";
import { useVendorProducts } from "@/hooks/use-vendor-products";

export function VendorProducts() {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const { products, isLoading } = useVendorProducts();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Products</h2>
          <p className="text-muted-foreground">
            Manage your product catalog and inventory
          </p>
        </div>
        <Button onClick={() => setShowAddProduct(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Catalog</CardTitle>
          <CardDescription>
            View and manage all your listed products
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={products}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      <ProductForm
        open={showAddProduct}
        onOpenChange={setShowAddProduct}
      />
    </div>
  );
}