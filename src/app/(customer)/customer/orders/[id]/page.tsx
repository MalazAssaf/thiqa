"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ArrowBackIcon from "@mui/icons-material/ArrowBackRounded";
import { api, BASE_URL } from "@/src/lib/api";
import { cities } from "@/src/data/cities";

type StageState = "done" | "current" | "waiting" | "failed";
type Stage = { title: string; sub: string; state: StageState; warn?: boolean };

const price = new Intl.NumberFormat("en-SA", {
  style: "currency",
  currency: "SAR",
});
const day = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});
const fmt = (iso: string | null) => (iso ? day.format(new Date(iso)) : "");
const orderCode = (id: number) => `ORD-${String(id).padStart(4, "0")}`;
const cityLabel = (v: string | null) =>
  v ? (cities.find((c) => c.value === v)?.label ?? v) : "";

const panel =
  "rounded-lg bg-surface shadow-[0_1px_2px_0_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.07)]";
const kicker = "text-kicker font-medium uppercase tracking-wider text-accent";

const dot: Record<StageState, string> = {
  done: "bg-accent",
  current: "bg-accent",
  waiting: "bg-divider",
  failed: "bg-critical-text",
};

function buildStages(o: Order): Stage[] {
  const placed: Stage = {
    title: "Order placed",
    sub: `Placed ${fmt(o.createdAt)}`,
    state: "done",
  };

  // Ended before delivery
  if (o.status === "REJECTED")
    return [
      placed,
      { title: "Rejected by store", sub: fmt(o.closedAt), state: "failed" },
    ];
  if (o.status === "CANCELLED")
    return [
      placed,
      { title: "Cancelled by you", sub: fmt(o.closedAt), state: "failed" },
    ];

  const reached: Record<string, number> = {
    PENDING: 0,
    CONFIRMED: 1,
    OUT_FOR_DELIVERY: 2,
    DELIVERED: 3,
    REFUSED: 3,
  };
  const r = reached[o.status];
  const titles = [
    "Order placed",
    "Accepted by store",
    "Out for delivery",
    "Delivery closed",
  ];

  return titles.map((title, i): Stage => {
    if (i === 0) return { ...placed, state: r === 0 ? "current" : "done" };

    if (i === 3 && o.status === "DELIVERED")
      return {
        title: "Received",
        sub: `Closed ${fmt(o.closedAt)}`,
        state: "done",
      };
    if (i === 3 && o.status === "REFUSED")
      return {
        title: "Refused at the door",
        sub: `Closed ${fmt(o.closedAt)}`,
        state: "failed",
      };

    const autoAccepted = i === 1 && o.paymentMethod === "CARD";

    if (i < r)
      return {
        title,
        sub: autoAccepted ? "Accepted automatically · prepaid" : "Done",
        state: "done",
      };

    if (i === r) {
      if (autoAccepted)
        return {
          title,
          sub: "Accepted automatically · prepaid",
          state: "current",
        };
      const delayed = i === 2 && o.delayed;
      return {
        title,
        sub: delayed ? "Delayed" : "Current stage",
        state: "current",
        warn: delayed,
      };
    }

    return { title, sub: "Waiting", state: "waiting" };
  });
}

function scoreImpact(o: Order): string {
  switch (o.status) {
    case "DELIVERED":
      return "Received. This order raises your commitment score.";
    case "REFUSED":
      return "Recorded as refused at the door, which lowers your commitment score the most.";
    case "CANCELLED":
      return "You cancelled this order before delivery, which lowers your score a little.";
    case "REJECTED":
      return "The store rejected this order, so it doesn't affect your commitment score.";
    default:
      return o.paymentMethod === "CARD"
        ? "This order is prepaid, so it can't be refused on arrival. It raises your score once it's delivered."
        : "Receiving this order keeps your commitment score high. Refusing it at the door lowers it the most.";
  }
}

export default function TrackOrderPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [confirming, setConfirming] = useState(false);

  const {
    data: o,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["customer-order", id],
    queryFn: () => api<Order>(`/api/customer/orders/${id}`),
  });

  const cancel = useMutation({
    mutationFn: () =>
      api<Order>(`/api/customer/orders/${id}/cancel`, { method: "PATCH" }),
    onSuccess: (updated) => {
      queryClient.setQueryData(["customer-order", id], updated);
      queryClient.invalidateQueries({ queryKey: ["customer-orders"] });
      queryClient.invalidateQueries({ queryKey: ["customer-score"] });
      setConfirming(false);
    },
  });

  const canCancel = o && (o.status === "PENDING" || o.status === "CONFIRMED");

  return (
    <main className="min-h-[calc(100dvh-68px)] bg-bg pb-16">
      <div className="container-page flex flex-col gap-5 pt-8">
        <Link
          href="/customer/orders"
          className="flex w-fit items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-300"
        >
          <ArrowBackIcon sx={{ fontSize: 15 }} />
          My orders
        </Link>

        {isPending ? (
          <p className="text-sm text-neutral-500">Loading order…</p>
        ) : isError ? (
          <p className="rounded-md bg-critical-bg px-3 py-2 text-sm text-critical-text">
            {error.message}
          </p>
        ) : (
          <>
            <h1 className="font-display text-h2 font-semibold leading-[1.15] text-text">
              {orderCode(o.id)}
            </h1>

            <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
              {/* Delivery timeline */}
              <section
                className={`flex min-w-0 flex-1 flex-col gap-4 p-5 sm:p-6 ${panel}`}
              >
                <span className={kicker}>Delivery</span>

                <ol className="flex flex-col">
                  {buildStages(o).map((s, i, all) => {
                    const last = i === all.length - 1;
                    const next = all[i + 1];
                    const lineColor =
                      next?.state === "waiting"
                        ? "bg-divider"
                        : next?.state === "failed"
                          ? "bg-critical-bg"
                          : "bg-accent-600";

                    return (
                      <li
                        key={s.title}
                        className={`relative flex gap-4 ${last ? "" : "min-h-14"}`}
                      >
                        {/* Line to the next dot */}
                        {!last && (
                          <span
                            className={`absolute left-1.25 top-4.25 h-[calc(100%-12px)] w-0.5 ${lineColor}`}
                          />
                        )}

                        {/* Dot */}
                        <span
                          className={`relative mt-1.25 size-3 shrink-0 rounded-full ${dot[s.state]}`}
                        />

                        {/* Text */}
                        <div className="flex flex-col gap-0.5 pb-3">
                          <span
                            className={`text-body ${
                              s.state === "waiting"
                                ? "text-neutral-500"
                                : s.state === "failed"
                                  ? "font-medium text-critical-text"
                                  : "text-text"
                            }`}
                          >
                            {s.title}
                          </span>
                          <span
                            className={`text-xs ${s.warn ? "font-medium text-warn-text" : "text-neutral-500"}`}
                          >
                            {s.sub}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ol>

                {/* Items */}
                <div className="flex flex-col gap-3 border-t border-divider pt-4">
                  {o.items.map((i) => (
                    <div key={i.productId} className="flex items-center gap-3">
                      <img
                        src={`${BASE_URL}${i.imageUrl}`}
                        alt=""
                        className="size-12 shrink-0 rounded-md bg-neutral-900 object-cover"
                      />
                      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <span className="truncate text-body text-text">
                          {i.name}
                        </span>
                        <span className="text-xs tabular-nums text-neutral-500">
                          {price.format(i.unitPrice)} × {i.quantity}
                        </span>
                      </div>
                      <span className="whitespace-nowrap text-body tabular-nums text-text">
                        {price.format(i.unitPrice * i.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Side */}
              <div className="flex w-full flex-col gap-4 lg:w-100 lg:shrink-0">
                <section className={`flex flex-col gap-2.5 p-5 ${panel}`}>
                  <span className={kicker}>Summary</span>
                  {[
                    ["Store", o.storeName],
                    ["Placed", fmt(o.createdAt)],
                    [
                      "Payment",
                      o.paymentMethod === "COD"
                        ? "Cash on delivery"
                        : "Card, paid",
                    ],
                    ["Total", price.format(o.total)],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex justify-between gap-4 text-sm"
                    >
                      <span className="text-neutral-500">{label}</span>
                      <span className="text-right tabular-nums text-text">
                        {value}
                      </span>
                    </div>
                  ))}

                  {o.deliveryDetails && (
                    <div className="flex justify-between gap-4 border-t border-divider pt-2.5 text-sm">
                      <span className="text-neutral-500">Deliver to</span>
                      <span className="flex flex-col items-end text-right">
                        <span className="text-text">{o.deliveryLabel}</span>
                        <span className="text-xs text-neutral-500">
                          {o.deliveryDetails}, {cityLabel(o.deliveryCity)}
                        </span>
                      </span>
                    </div>
                  )}
                </section>

                <section className={`flex flex-col gap-3 p-5 ${panel}`}>
                  <span className={kicker}>Score impact</span>
                  <p className="text-sm leading-normal text-neutral-300">
                    {scoreImpact(o)}
                  </p>

                  {canCancel &&
                    (confirming ? (
                      <div className="flex flex-col gap-2 rounded-md bg-critical-bg/50 p-3">
                        <p className="text-sm text-critical-text">
                          Cancel this order? It lowers your score a little.
                        </p>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => cancel.mutate()}
                            disabled={cancel.isPending}
                            className="h-9 rounded-md bg-critical-text px-3 text-sm font-medium text-surface disabled:opacity-60"
                          >
                            {cancel.isPending ? "Cancelling…" : "Yes, cancel"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirming(false)}
                            className="h-9 rounded-md border border-divider bg-surface px-3 text-sm text-text"
                          >
                            Keep order
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirming(true)}
                        className="h-9 w-fit rounded-md border border-divider px-3 text-sm font-medium text-text hover:border-critical-text hover:text-critical-text"
                      >
                        Cancel order
                      </button>
                    ))}

                  {cancel.isError && (
                    <p className="rounded-md bg-critical-bg px-3 py-2 text-xs text-critical-text">
                      {cancel.error.message}
                    </p>
                  )}
                </section>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
