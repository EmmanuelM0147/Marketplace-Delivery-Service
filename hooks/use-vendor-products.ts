"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

export function useVendorProducts() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data: vendorId } = await supabase.auth.getSession();
        if (!vendorId) return;

        const { data, error } = await supabase
          .from("products")
          .select(`
            *,
            category:categories(name),
            variations:product_variations(*)
          `)
          .eq("vendor_id", vendorId);

        if (error) throw error;
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return { products, isLoading };
}