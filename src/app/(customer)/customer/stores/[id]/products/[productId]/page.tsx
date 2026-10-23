"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import Snackbar from "@/src/components/ui/Snackbar";
import { useCart } from "@/src/components/cart/CartProvider";
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

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string; productId: string }>;
}) {
  const { id, productId } = use(params);
  const cart = useCart();

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [otherStore, setOtherStore] = useState(false);

  const {
    data: store,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["stores", id],
    queryFn: () => api<StoreDetail>(`/api/customer/stores/${id}`),
  });

  const product = store?.products.find((p) => p.id === Number(productId));

  if (isLoading) {
    return (
      <main className="min-h-[calc(100dvh-68px)] bg-bg pb-16">
        <div className="container-page flex flex-col gap-6 pt-8 md:flex-row">
          <div className="aspect-square w-full max-w-120 animate-pulse rounded-lg bg-surface" />
          <div className="h-60 flex-1 animate-pulse rounded-lg bg-surface" />
        </div>
      </main>
    );
  }

  if (error || !store || !product) {
    return (
      <main className="min-h-[calc(100dvh-68px)] bg-bg pb-16">
        <div className="container-page flex flex-col gap-4 pt-8">
          <p className="text-sm text-critical-text">
            {error?.message ?? "Product not found."}
          </p>
          <Link
            href={`/customer/stores/${id}`}
            className="text-sm font-medium text-accent"
          >
            Back to the store
          </Link>
        </div>
      </main>
    );
  }

  const outOfStock = product.stock === 0;
  const cartStore = { id: store.id, name: store.name };
  const cartProduct = {
    productId: product.id,
    name: product.name,
    price: product.price,
    imageUrl: product.imageUrl,
    stock: product.stock,
  };

  function addToCart() {
    const result = cart.add(cartStore, cartProduct, quantity);
    if (result === "other-store") setOtherStore(true);
    else setAdded(true);
  }

  function startNewCart() {
    cart.replaceWith(cartStore, cartProduct, quantity);
    setOtherStore(false);
    setAdded(true);
  }

  return (
    <main className="min-h-[calc(100dvh-68px)] bg-bg pb-16">
      <div className="container-page flex flex-col gap-6 pt-8">
        {/* Back to the store */}
        <Link
          href={`/customer/stores/${store.id}`}
          className="flex w-fit items-center gap-1.5 text-sm font-medium text-accent hover:underline"
        >
          <ArrowBackIcon sx={{ fontSize: 16 }} />
          {store.name}
        </Link>

        <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
          {/* Image (1:1) */}
          <img
            src={`${BASE_URL}${product.imageUrl}`}
            alt={product.name}
            className={`aspect-square w-full max-w-120 shrink-0 rounded-lg bg-neutral-900 object-cover md:w-[45%] ${
              outOfStock ? "opacity-50 grayscale" : ""
            }`}
          />

          {/* Details */}
          <section className="flex min-w-0 flex-1 flex-col gap-3">
            <p className="text-kicker font-medium uppercase tracking-[0.6px] text-accent">
              {store.name}
            </p>
            <h1 className="font-display text-h2 font-semibold leading-[1.15] text-text">
              {product.name}
            </h1>
            <p className="font-display text-h4 font-semibold tabular-nums text-text">
              {amount.format(product.price)} SAR
            </p>
            {product.description && (
              <p className="max-w-130 text-sm leading-relaxed text-neutral-400">
                {product.description}
              </p>
            )}

            {/* Quantity */}
            {!outOfStock && (
              <div className="flex items-center gap-3 pt-1">
                <span className="text-xs text-neutral-500">Quantity</span>
                <div className="flex items-center rounded-md border border-divider bg-surface">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="flex size-8 items-center justify-center text-neutral-500 hover:text-accent disabled:opacity-40"
                  >
                    <RemoveIcon sx={{ fontSize: 16 }} />
                  </button>
                  <span className="w-9 border-x border-divider text-center text-sm tabular-nums text-text">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() =>
                      setQuantity((q) => Math.min(product.stock, q + 1))
                    }
                    disabled={quantity >= product.stock}
                    className="flex size-8 items-center justify-center text-neutral-500 hover:text-accent disabled:opacity-40"
                  >
                    <AddIcon sx={{ fontSize: 16 }} />
                  </button>
                </div>
              </div>
            )}

            {/* Cart from another store */}
            {otherStore && (
              <div
                role="alert"
                className="flex max-w-130 flex-col gap-2 rounded-lg border border-warn-text/30 bg-warn-bg px-4 py-3 text-sm text-warn-text"
              >
                <span>
                  Your cart has items from <strong>{cart.store?.name}</strong>.
                  One order can only include one store. Start a new cart?
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={startNewCart}
                    className="rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-cream hover:bg-accent-300"
                  >
                    Start new cart
                  </button>
                  <button
                    type="button"
                    onClick={() => setOtherStore(false)}
                    className="rounded-md px-3 py-1.5 text-xs font-medium text-warn-text hover:bg-surface/50"
                  >
                    Keep current cart
                  </button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={addToCart}
                disabled={outOfStock}
                className="flex h-9 items-center rounded-md bg-accent px-4 text-sm font-medium text-cream hover:bg-accent-300 disabled:cursor-not-allowed disabled:bg-neutral-900 disabled:text-neutral-600"
              >
                {outOfStock ? "Out of stock" : "Add to cart"}
              </button>
              <Link
                href="/customer/cart"
                className="flex h-9 items-center rounded-md border border-divider bg-surface px-4 text-sm font-medium text-text hover:border-accent hover:text-accent"
              >
                Go to cart
              </Link>
            </div>

            <p className="flex items-center gap-1.5 text-2xs text-neutral-500">
              <PaymentsOutlinedIcon
                sx={{ fontSize: 14 }}
                className="text-accent"
              />
              Cash on delivery ·{" "}
              {outOfStock ? (
                <span className="text-critical-text">Out of stock</span>
              ) : (
                <span className="tabular-nums">{product.stock} in stock</span>
              )}
            </p>
          </section>
        </div>
      </div>

      {added && (
        <Snackbar
          type="success"
          message={`${quantity} × ${product.name} added to your cart.`}
          onClose={() => setAdded(false)}
        />
      )}
    </main>
  );
}
