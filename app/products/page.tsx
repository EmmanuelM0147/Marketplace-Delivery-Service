import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import ProductGrid from "@/components/products/product-grid";
import ProductFilters from "@/components/products/product-filters";
import { ProductSearch } from "@/components/products/product-search";

export const revalidate = 3600; // Revalidate every hour

async function getProducts() {
  const supabase = createServerComponentClient({ cookies });
  
  try {
    const { data: products, error } = await supabase
      .from("products")
      .select(`
        *,
        category:categories(name),
        images:product_images(url, alt_text, is_primary)
      `)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching products:", error);
      return [];
    }

    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export default async function ProductsPage() {
  const products = await getProducts();

  // Handle case when no products are found
  if (!products || products.length === 0) {
    return (
      <div className="container py-8">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold">Products</h1>
            <ProductSearch />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1">
              <ProductFilters />
            </aside>
            
            <main className="lg:col-span-3">
              <div className="text-center py-8">
                <p className="text-muted-foreground">No products found</p>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">Products</h1>
          <ProductSearch />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <ProductFilters />
          </aside>
          
          <main className="lg:col-span-3">
            <ProductGrid products={products} />
          </main>
        </div>
      </div>
    </div>
  );
}