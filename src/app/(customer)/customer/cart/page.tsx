/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CloseIcon from "@mui/icons-material/Close";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import { useCart } from "@/src/components/cart/CartProvider";
import { api, BASE_URL } from "@/src/lib/api";

type PaymentMethod = "COD" | "CARD";

const price = new Intl.NumberFormat("en-SA", {
  style: "currency",
  currency: "SAR",
});

const methodLabel: Record<PaymentMethod, string> = {
  COD: "Cash on delivery",
  CARD: "Card",
};

const panel =
  "rounded-lg bg-surface shadow-[0_1px_2px_0_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.07)]";
const input =
  "h-9 w-full rounded-md border border-divider bg-surface px-2.5 text-sm text-text tabular-nums placeholder:text-neutral-700 focus:border-accent focus:outline-none";

export default function CartPage() {
  const cart = useCart();
  const router = useRouter();

  const [method, setMethod] = useState<PaymentMethod>("COD");
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "" });

  // Card details are checked here and never sent to the backend
  const cardValid =
    card.number.replace(/\s/g, "").length === 16 &&
    /^(0[1-9]|1[0-2])\/\d{2}$/.test(card.expiry) &&
    card.cvv.length === 3;

  const placeOrder = useMutation({
    mutationFn: () =>
      api<{ id: number }>("/api/customer/orders", {
        method: "POST",
        body: JSON.stringify({
          storeId: cart.store?.id,
          paymentMethod: method,
          items: cart.items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
        }),
      }),
    onSuccess: () => {
      cart.clear();
      router.push("/customer/orders");
    },
  });

  const canPlace =
    cart.items.length > 0 &&
    !placeOrder.isPending &&
    (method === "COD" || cardValid);

  return (
    <main className="min-h-[calc(100dvh-68px)] bg-bg pb-16">
      <div className="container-page flex flex-col gap-5 pt-8">
        <div className="flex flex-col gap-1.5">
          <h1 className="font-display text-h2 font-semibold leading-[1.15] text-text">
            Cart
          </h1>
          <p className="text-sm text-neutral-500">
            One store per order. Choose how you want to pay.
          </p>
        </div>

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
            {/* Store group */}
            <section
              className={`flex min-w-0 flex-1 flex-col gap-4 p-4 sm:p-5 ${panel}`}
            >
              <div className="flex items-center justify-between gap-2">
                <Link
                  href={`/customer/stores/${cart.store?.id}`}
                  className="truncate font-display text-h5 font-semibold text-text hover:text-accent"
                >
                  {cart.store?.name}
                </Link>
                <span className="shrink-0 text-sm tabular-nums text-neutral-500">
                  {price.format(cart.total)}
                </span>
              </div>

              {cart.items.map((item) => (
                <div
                  key={item.productId}
                  className="flex flex-wrap items-center gap-x-3 gap-y-2 sm:flex-nowrap"
                >
                  <img
                    src={`${BASE_URL}${item.imageUrl}`}
                    alt=""
                    className="size-12 shrink-0 rounded-md bg-neutral-900 object-cover"
                  />

                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="truncate text-body text-text">
                      {item.name}
                    </span>
                    <span className="text-xs tabular-nums text-neutral-500">
                      {price.format(item.price)} each
                    </span>
                  </div>

                  {/* Controls: own line under the name on mobile */}
                  <div className="flex w-full items-center gap-3 md:pl-15 sm:w-auto ">
                    <div className="flex h-7 shrink-0 items-center rounded-md border border-divider">
                      <button
                        type="button"
                        aria-label={`Decrease ${item.name}`}
                        onClick={() =>
                          cart.setQuantity(item.productId, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                        className="flex h-full w-7.5 items-center justify-center text-text hover:text-accent disabled:opacity-40"
                      >
                        <RemoveIcon sx={{ fontSize: 13 }} />
                      </button>
                      <span className="flex h-full w-7.5 items-center justify-center border-x border-divider text-sm tabular-nums text-text">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label={`Increase ${item.name}`}
                        onClick={() =>
                          cart.setQuantity(item.productId, item.quantity + 1)
                        }
                        disabled={item.quantity >= item.stock}
                        className="flex h-full w-7.5 items-center justify-center text-text hover:text-accent disabled:opacity-40"
                      >
                        <AddIcon sx={{ fontSize: 13 }} />
                      </button>
                    </div>

                    <span className="ml-auto whitespace-nowrap text-right text-body tabular-nums text-text sm:ml-0 sm:w-25">
                      {price.format(item.price * item.quantity)}
                    </span>

                    <button
                      type="button"
                      aria-label={`Remove ${item.name}`}
                      onClick={() => cart.remove(item.productId)}
                      className="flex size-7 shrink-0 items-center justify-center rounded-md text-accent hover:bg-critical-bg/50 hover:text-critical-text"
                    >
                      <CloseIcon sx={{ fontSize: 16 }} />
                    </button>
                  </div>
                </div>
              ))}

              <div className="h-px bg-divider" />

              {/* Payment method */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                <span className="text-sm text-neutral-500">Payment</span>
                <div className="grid h-8.5 w-full grid-cols-2 overflow-hidden rounded-md border border-divider sm:w-auto">
                  {(["COD", "CARD"] as const).map((m) => {
                    const active = method === m;
                    const Icon =
                      m === "COD"
                        ? PaymentsOutlinedIcon
                        : CreditCardOutlinedIcon;
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMethod(m)}
                        aria-pressed={active}
                        className={`flex items-center justify-center gap-1.5 whitespace-nowrap px-3 text-sm  ${
                          active
                            ? "border-accent bg-cream text-accent"
                            : "border-divider text-text hover:text-accent"
                        }`}
                      >
                        <Icon sx={{ fontSize: 14 }} />
                        {m === "COD" ? "Cash on delivery" : <>Card </>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Card fields */}
              {method === "CARD" && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-[1fr_110px_90px]">
                  <label className="col-span-2 flex flex-col gap-1.5 sm:col-span-1">
                    <span className="text-xs text-neutral-500">
                      Card number
                    </span>
                    <input
                      inputMode="numeric"
                      placeholder="4539 1234 5678 9012"
                      value={card.number}
                      onChange={(e) => {
                        const digits = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 16);
                        setCard({
                          ...card,
                          number: digits.replace(/(\d{4})(?=\d)/g, "$1 "),
                        });
                      }}
                      className={input}
                    />
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs text-neutral-500">Expiry</span>
                    <input
                      inputMode="numeric"
                      placeholder="09/29"
                      value={card.expiry}
                      onChange={(e) => {
                        const d = e.target.value.replace(/\D/g, "").slice(0, 4);
                        setCard({
                          ...card,
                          expiry:
                            d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d,
                        });
                      }}
                      className={input}
                    />
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs text-neutral-500">CVV</span>
                    <input
                      inputMode="numeric"
                      placeholder="123"
                      value={card.cvv}
                      onChange={(e) =>
                        setCard({
                          ...card,
                          cvv: e.target.value.replace(/\D/g, "").slice(0, 3),
                        })
                      }
                      className={input}
                    />
                  </label>
                </div>
              )}
            </section>

            {/* Checkout */}
            <aside
              className={`flex w-full flex-col gap-3 p-4 sm:p-5 lg:w-95 lg:shrink-0 ${panel}`}
            >
              <span className="text-kicker font-medium uppercase tracking-wider text-accent">
                Checkout
              </span>

              <div className="flex justify-between gap-3 text-sm">
                <span className="truncate text-neutral-500">
                  {cart.store?.name}
                </span>
                <span className="shrink-0 text-text">
                  {methodLabel[method]}
                </span>
              </div>

              <div className="h-px bg-divider" />

              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">
                  {method === "CARD" ? "Paid now by card" : "Due on delivery"}
                </span>
                <span
                  className={`tabular-nums ${method === "CARD" ? "text-accent" : "text-text"}`}
                >
                  {price.format(cart.total)}
                </span>
              </div>

              <div className="flex justify-between text-body">
                <span className="text-text">
                  Items (<span className="tabular-nums">{cart.count}</span>)
                </span>
                <span className="font-medium tabular-nums text-text">
                  {price.format(cart.total)}
                </span>
              </div>

              <button
                type="button"
                onClick={() => placeOrder.mutate()}
                disabled={!canPlace}
                className="flex h-10 items-center justify-center rounded-md bg-accent text-body font-medium text-cream hover:bg-accent-300 disabled:opacity-60"
              >
                {placeOrder.isPending ? "Placing order…" : "Place order"}
              </button>

              {placeOrder.isError && (
                <p className="rounded-md bg-critical-bg px-3 py-2 text-xs text-critical-text">
                  {placeOrder.error.message}
                </p>
              )}

              <p className="text-2xs leading-normal text-neutral-500">
                Your score at this moment is attached to the order as a
                snapshot. Paying by card raises it, because a prepaid order
                can&apos;t be refused on arrival.
              </p>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
