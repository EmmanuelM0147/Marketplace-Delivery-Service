import { supabase } from "@/lib/supabase/client";
import ProductGrid from "./product-grid";

interface RelatedProductsProps {
  categoryId: string;
  currentProductId: string;
}

async function getRelatedProducts(categoryId: string, currentProductId: string) {
  const { data: products, error } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(name),
      images:product_images(url, alt_text, is_primary)
    `)
    .eq("category_id", categoryId)
    .neq("id", currentProductId)
    .eq("is_active", true)
    .limit(3);

  if (error) throw error;
  return products;
}

export async function RelatedProducts({ categoryId, currentProductId }: RelatedProductsProps) {
  const products = await getRelatedProducts(categoryId, currentProductId);

  if (!products.length) return null;

  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">Related Products</h2>
      <ProductGrid products={products} />
    </section>
  );
}