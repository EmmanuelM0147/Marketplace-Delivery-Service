import Image from "next/image";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { AddToCart } from "@/components/products/add-to-cart";
import { ProductGallery } from "@/components/products/product-gallery";
import { ProductReviews } from "@/components/products/product-reviews";
import { RelatedProducts } from "@/components/products/related-products";

export const revalidate = 3600;

async function getProduct(slug: string) {
  const { data: product, error } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(name),
      images:product_images(url, alt_text, is_primary)
    `)
    .eq("slug", slug)
    .single();

  if (error || !product) return null;
  return product;
}

interface Props {
  params: {
    slug: string;
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct(params.slug);

  if (!product) {
    notFound();
  }

  const primaryImage = product.images.find((img: any) => img.is_primary);

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ProductGallery images={product.images} />
        
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-lg font-semibold text-primary mt-2">
              ${product.price.toFixed(2)}
            </p>
          </div>

          <div className="prose max-w-none">
            <p>{product.description}</p>
          </div>

          <div className="flex items-center gap-4">
            <span className={product.inventory_count > 0 ? "text-green-600" : "text-red-600"}>
              {product.inventory_count > 0 ? "In Stock" : "Out of Stock"}
            </span>
            {product.category && (
              <span className="text-muted-foreground">
                Category: {product.category.name}
              </span>
            )}
          </div>

          <AddToCart product={product} />
        </div>
      </div>

      <div className="mt-16 space-y-16">
        <ProductReviews productId={product.id} />
        <RelatedProducts categoryId={product.category_id} currentProductId={product.id} />
      </div>
    </div>
  );
}