"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import ProductForm, {
  type Product,
} from "@/src/components/merchant/ProductForm";
import { api } from "@/src/lib/api";

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  // Reuses the products list (already cached when coming from the products page)
  const { data: products, isLoading } = useQuery({
    queryKey: ["store", "products"],
    queryFn: () => api<Product[]>("/api/store/products"),
  });

  const product = products?.find((p) => p.id === Number(id));

  return (
    <main className="min-h-[calc(100dvh-68px)] bg-bg pb-16">
      <div className="container-page flex flex-col gap-6 pt-8">
        <h1 className="font-display text-h2 font-semibold leading-[1.15] text-text">
          Edit product
        </h1>
        {isLoading ? (
          <div className="h-96 max-w-160 animate-pulse rounded-lg bg-surface" />
        ) : product ? (
          <ProductForm product={product} />
        ) : (
          <p className="text-sm text-critical-text">Product not found.</p>
        )}
      </div>
    </main>
  );
}
