"use client";

import Link from "next/link";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import { useCart } from "@/src/components/cart/CartProvider";
import { BASE_URL } from "@/src/lib/api";

const price = new Intl.NumberFormat("en-SA", {
  style: "currency",
  currency: "SAR",
});

export default function CartPage() {
  const cart = useCart();

  return (
    <main className="min-h-[calc(100dvh-68px)] bg-bg pb-16">
      <div className="container-page flex flex-col gap-6 pt-8">
        <h1 className="font-display text-h2 font-semibold leading-[1.15] text-text">
          Cart
        </h1>

        {cart.items.length === 0 ? (
          <div className="rounded-lg border border-dashed border-divider bg-surface px-6 py-12 text-center">
            <p className="text-sm text-text">Your cart is empty.</p>
            <Link
              href="/customer/stores"
              className="mt-2 inline-block text-sm font-medium text-accent"
            >
              Browse stores
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            {/* Items */}
            <section className="flex min-w-0 flex-1 flex-col rounded-lg bg-surface shadow-[0_1px_2px_0_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.07)]">
              <Link
                href={`/customer/stores/${cart.store?.id}`}
                className="flex items-center gap-2 border-b border-divider px-4 py-3 text-sm font-medium text-text hover:text-accent"
              >
                <StorefrontOutlinedIcon
                  sx={{ fontSize: 18 }}
                  className="text-neutral-500"
                />
                {cart.store?.name}
              </Link>

              {cart.items.map((item) => (
                <div
                  key={item.productId}
                  className="flex flex-wrap items-center gap-4 border-b border-divider px-4 py-4 last:border-0"
                >
                  <img
                    src={`${BASE_URL}${item.imageUrl}`}
                    alt=""
                    className="size-16 shrink-0 rounded-md bg-neutral-900 object-cover"
                  />

                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="truncate font-medium text-text">
                      {item.name}
                    </span>
                    <span className="text-xs tabular-nums text-neutral-500">
                      {price.format(item.price)} each
                    </span>
                  </div>

                  {/* Quantity stepper (1 … stock) */}
                  <div className="flex items-center rounded-md border border-divider">
                    <button
                      type="button"
                      aria-label={`Decrease ${item.name}`}
                      onClick={() =>
                        cart.setQuantity(item.productId, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                      className="flex size-8 items-center justify-center text-neutral-500 hover:text-accent disabled:opacity-40"
                    >
                      <RemoveIcon sx={{ fontSize: 16 }} />
                    </button>
                    <span className="w-8 text-center text-sm tabular-nums text-text">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      aria-label={`Increase ${item.name}`}
                      onClick={() =>
                        cart.setQuantity(item.productId, item.quantity + 1)
                      }
                      disabled={item.quantity >= item.stock}
                      className="flex size-8 items-center justify-center text-neutral-500 hover:text-accent disabled:opacity-40"
                    >
                      <AddIcon sx={{ fontSize: 16 }} />
                    </button>
                  </div>

                  <span className="w-28 text-right font-semibold tabular-nums text-text">
                    {price.format(item.price * item.quantity)}
                  </span>

                  <button
                    type="button"
                    aria-label={`Remove ${item.name}`}
                    onClick={() => cart.remove(item.productId)}
                    className="flex size-8 items-center justify-center rounded-md text-neutral-500 hover:bg-critical-bg/50 hover:text-critical-text"
                  >
                    <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                  </button>
                </div>
              ))}
            </section>

            {/* Summary */}
            <aside className="flex w-full flex-col gap-4 rounded-lg bg-surface p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.07)] lg:w-80 lg:shrink-0">
              <h2 className="font-display text-h4 font-semibold text-text">
                Order summary
              </h2>

              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">
                  Items (<span className="tabular-nums">{cart.count}</span>)
                </span>
                <span className="tabular-nums text-text">
                  {price.format(cart.total)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Payment</span>
                <span className="text-text">Cash on delivery</span>
              </div>

              <div className="flex justify-between border-t border-divider pt-3">
                <span className="font-medium text-text">Total</span>
                <span className="font-semibold tabular-nums text-text">
                  {price.format(cart.total)}
                </span>
              </div>

              <button
                type="button"
                disabled
                // Checkout (POST /api/customer/orders) comes in the next step
                className="flex h-10 items-center justify-center rounded-md bg-accent text-sm font-medium text-cream hover:bg-accent-300 disabled:opacity-60"
              >
                Place order
              </button>

              <p className="text-2xs leading-normal text-neutral-500">
                You pay when the order arrives. Receiving your orders keeps your
                commitment score high.
              </p>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
