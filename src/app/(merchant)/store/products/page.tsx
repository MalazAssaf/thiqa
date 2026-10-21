"use client";

import { Suspense, useCallback, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Snackbar from "@/src/components/ui/Snackbar";
import { api, BASE_URL } from "@/src/lib/api";
import type { Product } from "@/src/components/merchant/ProductForm";

const price = new Intl.NumberFormat("en-SA", {
  style: "currency",
  currency: "SAR",
});
const LOW_STOCK = 5;

export default function StoreProductsPage() {
  return (
    <main className="min-h-[calc(100dvh-68px)] bg-bg pb-16">
      {/* useSearchParams needs a Suspense boundary in Next.js */}
      <Suspense fallback={null}>
        <ProductsList />
      </Suspense>
    </main>
  );
}

function ProductsList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [deleted, setDeleted] = useState(false);

  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["store", "products"],
    queryFn: () => api<Product[]>("/api/store/products"),
  });

  const remove = useMutation({
    mutationFn: (id: number) =>
      api(`/api/store/products/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      setConfirmId(null);
      setDeleted(true);
      queryClient.invalidateQueries({ queryKey: ["store", "products"] });
    },
  });

  // Snackbar: after add/edit (from ?saved=) or after a delete on this page
  const saved = searchParams.get("saved");
  const message = deleted
    ? "Product deleted."
    : saved === "added"
      ? "Product added."
      : saved === "updated"
        ? "Changes saved."
        : null;

  const closeSnackbar = useCallback(() => {
    setDeleted(false);
    if (saved) router.replace("/store/products"); // so a refresh doesn't show it again
  }, [saved, router]);

  return (
    <div className="container-page flex flex-col gap-6 pt-8">
      {/* Heading */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          <h1 className="font-display text-h2 font-semibold leading-[1.15] text-text">
            Products
          </h1>
          <p className="text-sm text-neutral-400">
            {products.length} {products.length === 1 ? "product" : "products"}{" "}
            in your store
          </p>
        </div>
        <Link
          href="/store/products/new"
          className="flex h-9 items-center gap-1.5 rounded-md bg-accent px-3 text-sm font-medium text-cream hover:bg-accent-300"
        >
          <AddIcon sx={{ fontSize: 18 }} />
          Add product
        </Link>
      </div>

      {remove.error && (
        <p className="text-sm text-critical-text">{remove.error.message}</p>
      )}

      {isLoading ? (
        <div className="h-64 animate-pulse rounded-lg bg-surface" />
      ) : error ? (
        <p className="text-sm text-critical-text">{error.message}</p>
      ) : products.length === 0 ? (
        <div className="rounded-lg border border-dashed border-divider bg-surface px-6 py-12 text-center">
          <p className="text-sm text-text">
            You haven&apos;t added any products yet.
          </p>
          <Link
            href="/store/products/new"
            className="mt-2 inline-block text-sm font-medium text-accent"
          >
            Add your first product
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg bg-surface shadow-[0_1px_2px_0_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.07)]">
          <table className="w-full min-w-150 text-left text-sm">
            <thead className="border-b border-divider text-2xs uppercase tracking-[0.6px] text-neutral-500">
              <tr>
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-divider last:border-0"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={`${BASE_URL}${p.imageUrl}`}
                        alt=""
                        className="size-11 shrink-0 rounded-md bg-neutral-900 object-cover"
                      />
                      <div className="flex min-w-0 flex-col">
                        <span className="truncate font-medium text-text">
                          {p.name}
                        </span>
                        {p.description && (
                          <span className="max-w-80 truncate text-2xs text-neutral-500">
                            {p.description}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3 tabular-nums text-text">
                    {price.format(p.price)}
                  </td>

                  <td className="px-4 py-3">
                    {p.stock === 0 ? (
                      <span className="rounded-sm bg-critical-bg px-1.75 py-0.5 text-3xs font-medium text-critical-text">
                        Out of stock
                      </span>
                    ) : p.stock < LOW_STOCK ? (
                      <span className="rounded-sm bg-warn-bg px-1.75 py-0.5 text-3xs font-medium tabular-nums text-warn-text">
                        Only {p.stock} left
                      </span>
                    ) : (
                      <span className="tabular-nums text-text">
                        {p.stock} in stock
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    {confirmId === p.id ? (
                      // Inline confirmation instead of the browser's confirm()
                      <div className="flex items-center justify-end gap-2 text-xs">
                        <span className="text-text">Delete?</span>
                        <button
                          type="button"
                          onClick={() => remove.mutate(p.id)}
                          disabled={remove.isPending}
                          className="rounded-sm bg-critical-text px-2.5 py-1 font-medium text-surface disabled:opacity-60"
                        >
                          {remove.isPending ? "Deleting..." : "Delete"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmId(null)}
                          className="px-1.5 py-1 text-neutral-500 hover:text-text"
                        >
                          Keep
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-end gap-1">
                        <Link
                          href={`/store/products/${p.id}`}
                          aria-label={`Edit ${p.name}`}
                          className="flex size-8 items-center justify-center rounded-md text-neutral-500 hover:bg-accent-900 hover:text-accent"
                        >
                          <EditOutlinedIcon sx={{ fontSize: 18 }} />
                        </Link>
                        <button
                          type="button"
                          aria-label={`Delete ${p.name}`}
                          onClick={() => setConfirmId(p.id)}
                          className="flex size-8 items-center justify-center rounded-md text-neutral-500 hover:bg-critical-bg/50 hover:text-critical-text"
                        >
                          <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {message && (
        <Snackbar type="success" message={message} onClose={closeSnackbar} />
      )}
    </div>
  );
}
