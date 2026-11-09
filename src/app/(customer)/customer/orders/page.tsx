"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import ChevronRightIcon from "@mui/icons-material/ChevronRightRounded";
import { api, BASE_URL } from "@/src/lib/api";

type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "REFUSED"
  | "REJECTED"
  | "CANCELLED";

type Order = {
  id: number;
  storeId: number;
  storeName: string;
  status: OrderStatus;
  paymentMethod: "COD" | "CARD";
  delayed: boolean;
  total: number;
  createdAt: string;
  closedAt: string | null;
  items: {
    productId: number;
    name: string;
    imageUrl: string;
    quantity: number;
    unitPrice: number;
  }[];
};

type Filter = "ALL" | "ACTIVE" | "COMPLETED" | "CANCELLED";

const ACTIVE: OrderStatus[] = ["PENDING", "CONFIRMED", "OUT_FOR_DELIVERY"];
const FAILED: OrderStatus[] = ["REFUSED", "REJECTED", "CANCELLED"];

const filters: { key: Filter; label: string; match: (o: Order) => boolean }[] =
  [
    { key: "ALL", label: "All", match: () => true },
    { key: "ACTIVE", label: "Active", match: (o) => ACTIVE.includes(o.status) },
    {
      key: "COMPLETED",
      label: "Completed",
      match: (o) => o.status === "DELIVERED",
    },
    {
      key: "CANCELLED",
      label: "Cancelled",
      match: (o) => FAILED.includes(o.status),
    },
  ];

const price = new Intl.NumberFormat("en-SA", {
  style: "currency",
  currency: "SAR",
});

const date = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const tone = {
  neutral: "bg-divider text-neutral-100",
  accepted: "bg-accent-800 text-accent-100",
  shipped: "bg-accent2-800 text-accent2-100",
  warn: "bg-warn-bg text-warn-text",
  critical: "bg-critical-bg text-critical-text",
};

function statusTag(o: Order) {
  if (o.status === "OUT_FOR_DELIVERY" && o.delayed)
    return { label: "Delayed", cls: tone.warn };

  switch (o.status) {
    case "PENDING":
      return { label: "Pending", cls: tone.neutral };
    case "CONFIRMED":
      return { label: "Accepted", cls: tone.accepted };
    case "OUT_FOR_DELIVERY":
      return { label: "Shipped", cls: tone.shipped };
    case "DELIVERED":
      return { label: "Received", cls: tone.accepted };
    case "REFUSED":
      return { label: "Refused", cls: tone.critical };
    case "REJECTED":
      return { label: "Rejected by store", cls: tone.critical };
    case "CANCELLED":
      return { label: "Cancelled", cls: tone.critical };
  }
}

const orderCode = (id: number) => `ORD-${String(id).padStart(4, "0")}`;

const cols =
  "grid grid-cols-[130px_150px_minmax(0,1fr)_150px_120px_140px_72px] items-center gap-x-4";

const panel =
  "rounded-lg bg-surface shadow-[0_1px_2px_0_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.07)]";

function StatusTag({ order }: { order: Order }) {
  const tag = statusTag(order);
  return (
    <span
      className={`inline-flex h-5.5 shrink-0 items-center whitespace-nowrap rounded-md px-2 text-2xs font-medium ${tag.cls}`}
    >
      {tag.label}
    </span>
  );
}

function Items({ order }: { order: Order }) {
  const qty = order.items.reduce((s, i) => s + i.quantity, 0);
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="flex shrink-0 -space-x-3">
        {order.items.slice(0, 3).map((i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i.productId}
            src={`${BASE_URL}${i.imageUrl}`}
            alt=""
            className="size-10 rounded-md bg-neutral-900 object-cover ring-2 ring-surface"
          />
        ))}
      </div>
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="truncate text-body text-text">
          {order.items.map((i) => i.name).join(", ")}
        </span>
        <span className="text-xs tabular-nums text-neutral-500">
          {qty} {qty === 1 ? "item" : "items"}
        </span>
      </div>
    </div>
  );
}

function Payment({ order }: { order: Order }) {
  const Icon =
    order.paymentMethod === "COD"
      ? PaymentsOutlinedIcon
      : CreditCardOutlinedIcon;
  return (
    <span className="flex items-center gap-1.5 whitespace-nowrap text-sm text-text">
      <Icon sx={{ fontSize: 16 }} className="text-neutral-500" />
      {order.paymentMethod === "COD" ? "Cash on delivery" : "Card"}
    </span>
  );
}

function TrackLink({ order }: { order: Order }) {
  return (
    <Link
      href={`/customer/orders/${order.id}`}
      className="flex items-center whitespace-nowrap text-sm font-medium text-accent hover:text-accent-300"
    >
      Track
      <ChevronRightIcon sx={{ fontSize: 18 }} />
    </Link>
  );
}

export default function MyOrdersPage() {
  const [filter, setFilter] = useState<Filter>("ALL");

  const {
    data: orders,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["customer-orders"],
    queryFn: () => api<Order[]>("/api/customer/orders"),
  });

  const shown =
    orders?.filter(filters.find((f) => f.key === filter)!.match) ?? [];

  return (
    <main className="min-h-[calc(100dvh-68px)] bg-bg pb-16">
      <div className="container-page flex flex-col gap-5 pt-8">
        <div className="flex flex-col gap-1.5">
          <h1 className="font-display text-h2 font-semibold leading-[1.15] text-text">
            My orders
          </h1>
          <p className="text-sm text-neutral-500">
            Every order you receive keeps your commitment score high.
          </p>
        </div>

        {isPending ? (
          <p className="text-sm text-neutral-500">Loading orders…</p>
        ) : isError ? (
          <p className="rounded-md bg-critical-bg px-3 py-2 text-sm text-critical-text">
            {error.message}
          </p>
        ) : orders.length === 0 ? (
          <div className="rounded-lg border border-dashed border-divider bg-surface px-6 py-12 text-center">
            <p className="text-sm text-text">
              You haven&apos;t placed any orders yet.
            </p>
            <Link
              href="/customer/stores"
              className="mt-2 inline-block text-sm font-medium text-accent"
            >
              Browse stores
            </Link>
          </div>
        ) : (
          <>
            <div className="-mx-1 overflow-x-auto px-1 scrollbar-none [&::-webkit-scrollbar]:hidden">
              <div className="flex min-w-max border-b border-divider">
                {filters.map((f) => {
                  const active = filter === f.key;
                  const count = orders.filter(f.match).length;
                  return (
                    <button
                      key={f.key}
                      type="button"
                      onClick={() => setFilter(f.key)}
                      aria-pressed={active}
                      className={`-mb-px flex items-center gap-1.5 whitespace-nowrap border-b-2 px-3 pb-2.5 pt-1 text-sm sm:px-4 ${
                        active
                          ? "border-accent font-medium text-accent"
                          : "border-transparent text-neutral-500 hover:text-text"
                      }`}
                    >
                      {f.label}
                      <span
                        className={`rounded-sm px-1.5 text-2xs tabular-nums ${
                          active
                            ? "bg-accent-800 text-accent-100"
                            : "bg-divider text-neutral-300"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {shown.length === 0 ? (
              <p
                className={`px-5 py-10 text-center text-sm text-neutral-500 ${panel}`}
              >
                No orders here.
              </p>
            ) : (
              <>
                <div className="flex flex-col gap-3 lg:hidden">
                  {shown.map((o) => (
                    <article
                      key={o.id}
                      className={`flex flex-col gap-3 p-4 ${panel}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 flex-col gap-0.5">
                          <span className="font-mono text-xs font-medium text-text">
                            {orderCode(o.id)}
                          </span>
                          <span className="truncate text-xs text-neutral-500">
                            <Link
                              href={`/customer/stores/${o.storeId}`}
                              className="font-medium text-text hover:text-accent"
                            >
                              {o.storeName}
                            </Link>
                            {" · "}
                            {date.format(new Date(o.createdAt))}
                          </span>
                        </div>
                        <StatusTag order={o} />
                      </div>

                      <Items order={o} />

                      <div className="flex items-center justify-between gap-3 border-t border-divider pt-3">
                        <div className="flex min-w-0 flex-col gap-0.5">
                          <span className="text-body font-medium tabular-nums text-text">
                            {price.format(o.total)}
                          </span>
                          <Payment order={o} />
                        </div>
                        <TrackLink order={o} />
                      </div>
                    </article>
                  ))}
                </div>

                <div className={`hidden lg:block ${panel}`}>
                  <div
                    className={`${cols} border-b border-divider px-5 py-3 text-3xs font-medium uppercase tracking-wider text-neutral-500`}
                  >
                    <span>Order</span>
                    <span>Store</span>
                    <span>Items</span>
                    <span>Payment</span>
                    <span>Total</span>
                    <span>Status</span>
                    <span />
                  </div>

                  {shown.map((o) => (
                    <div
                      key={o.id}
                      className={`${cols} border-b border-divider px-5 py-3.5 last:border-0 hover:bg-bg/50`}
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="font-mono text-xs font-medium text-text">
                          {orderCode(o.id)}
                        </span>
                        <span className="text-xs text-neutral-500">
                          Placed {date.format(new Date(o.createdAt))}
                        </span>
                      </div>

                      <Link
                        href={`/customer/stores/${o.storeId}`}
                        className="truncate text-body text-text hover:text-accent"
                      >
                        {o.storeName}
                      </Link>

                      <Items order={o} />
                      <Payment order={o} />

                      <span className="text-body font-medium tabular-nums text-text">
                        {price.format(o.total)}
                      </span>

                      <span>
                        <StatusTag order={o} />
                      </span>

                      <span className="justify-self-end">
                        <TrackLink order={o} />
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </main>
  );
}
