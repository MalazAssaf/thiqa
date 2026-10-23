"use client";

import { use } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import CategoryIcon from "@/src/components/shared/CategoryIcon";
import { getCategoryLabel } from "@/src/data/categories";
import { getCityLabel } from "@/src/data/cities";
import { api, BASE_URL } from "@/src/lib/api";

type StoreProduct = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string;
  stock: number;
};

type StoreDetail = {
  id: number;
  name: string;
  category: string;
  city: string;
  products: StoreProduct[];
};

const amount = new Intl.NumberFormat("en-SA", { maximumFractionDigits: 2 });

export default function CustomerStorePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const {
    data: store,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["stores", id],
    queryFn: () => api<StoreDetail>(`/api/customer/stores/${id}`),
  });

  return (
    <main className="min-h-[calc(100dvh-68px)] bg-bg pb-16">
      <div className="container-page flex flex-col gap-6 pt-8">
        <Link
          href="/customer/stores"
          className="flex w-fit items-center gap-1.5 text-sm font-medium text-accent hover:underline"
        >
          <ArrowBackIcon sx={{ fontSize: 16 }} />
          All stores
        </Link>

        {isLoading ? (
          <div className="flex flex-col gap-6">
            <div className="h-32 animate-pulse rounded-lg bg-surface" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-64 animate-pulse rounded-lg bg-surface"
                />
              ))}
            </div>
          </div>
        ) : error || !store ? (
          <p className="text-sm text-critical-text">
            {error?.message ?? "Store not found."}
          </p>
        ) : (
          <>
            {/* Store header — same gradient as the store card */}
            <section className="flex flex-wrap items-end justify-between gap-4 rounded-lg bg-linear-[157deg] from-accent2-800 to-accent-800 to-64% px-5 py-5 sm:px-6">
              <div className="flex items-end gap-4">
                <CategoryIcon category={store.category} />
                <div className="flex flex-col gap-1">
                  <h1 className="font-display text-h2 font-semibold leading-[1.15] text-text">
                    {store.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-400">
                    <span>{getCategoryLabel(store.category)}</span>
                    <span className="flex items-center gap-1">
                      <PlaceOutlinedIcon sx={{ fontSize: 14 }} />
                      {getCityLabel(store.city)}
                    </span>
                  </div>
                </div>
              </div>
              <span className="rounded-md border border-accent px-2.5 py-1 text-2xs font-medium text-accent">
                Cash on delivery
              </span>
            </section>

            {/* Products — each card opens the product page */}
            {store.products.length === 0 ? (
              <div className="rounded-lg border border-dashed border-divider bg-surface px-6 py-12 text-center">
                <p className="text-sm text-text">
                  This store hasn&apos;t added any products yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {store.products.map((p) => {
                  const outOfStock = p.stock === 0;
                  return (
                    <Link
                      key={p.id}
                      href={`/customer/stores/${store.id}/products/${p.id}`}
                      className="flex flex-col overflow-hidden rounded-lg bg-surface shadow-[0_1px_0_0_rgba(0,0,0,0.05),0_0_0_1px_rgba(0,0,0,0.07)] transition-shadow hover:shadow-[0_4px_12px_0_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.07)]"
                    >
                      <img
                        src={`${BASE_URL}${p.imageUrl}`}
                        alt={p.name}
                        className={`aspect-square w-full bg-neutral-900 object-cover ${outOfStock ? "opacity-50 grayscale" : ""}`}
                      />
                      <div className="flex flex-1 flex-col gap-1.5 px-4 py-3.5">
                        <h2 className="font-display text-h5 font-semibold leading-[1.2] text-text">
                          {p.name}
                        </h2>
                        {p.description && (
                          <p className="line-clamp-2 text-xs leading-normal text-neutral-400">
                            {p.description}
                          </p>
                        )}
                        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
                          <span className="font-semibold tabular-nums text-text">
                            {amount.format(p.price)} SAR
                          </span>
                          {outOfStock ? (
                            <span className="rounded-sm bg-critical-bg px-1.75 py-0.5 text-3xs font-medium text-critical-text">
                              Out of stock
                            </span>
                          ) : p.stock < 5 ? (
                            <span className="text-3xs font-medium text-warn-text">
                              Only {p.stock} left
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
