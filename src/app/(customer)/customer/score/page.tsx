"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/src/lib/api";
import { category } from "@/src/data/score";

type ScoreBreakdown = {
  score: number | null;
  received: number;
  prepaid: number;
  delayed: number;
  cancelled: number;
  refused: number;
  total: number;
};

const W = {
  received: 1.0,
  prepaid: 1.1,
  delayed: 0.5,
  cancelled: 0.5,
  refused: 0,
};

const day = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});
const orderCode = (id: number) => `ORD-${String(id).padStart(4, "0")}`;

const panel =
  "rounded-lg bg-surface shadow-[0_1px_2px_0_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.07)]";
const kicker = "text-kicker font-medium uppercase tracking-wider text-accent";
const tagBase =
  "inline-flex h-[22px] shrink-0 items-center whitespace-nowrap rounded-md px-2 text-2xs font-medium";

function outcome(o: Order) {
  if (o.status === "DELIVERED" && o.delayed)
    return { label: "Delayed", weight: W.delayed, dot: "bg-warn-text" };
  if (o.status === "DELIVERED" && o.paymentMethod === "CARD")
    return { label: "Prepaid", weight: W.prepaid, dot: "bg-accent-2" };
  if (o.status === "DELIVERED")
    return { label: "Received", weight: W.received, dot: "bg-accent" };
  if (o.status === "CANCELLED")
    return { label: "Cancelled", weight: W.cancelled, dot: "bg-warn-text" };
  return { label: "Refused", weight: W.refused, dot: "bg-critical-text" };
}

function effect(weight: number) {
  if (weight >= 1) return { text: "Raises", cls: "text-accent" };
  if (weight > 0) return { text: "Lowers a little", cls: "text-warn-text" };
  return { text: "Lowers most", cls: "text-critical-text" };
}

const COUNTED: OrderStatus[] = ["DELIVERED", "REFUSED", "CANCELLED"];

export default function MyScorePage() {
  const scoreQuery = useQuery({
    queryKey: ["customer-score"],
    queryFn: () => api<ScoreBreakdown>("/api/customer/score"),
  });

  const ordersQuery = useQuery({
    queryKey: ["customer-orders"],
    queryFn: () => api<Order[]>("/api/customer/orders"),
  });

  const b = scoreQuery.data;
  const history =
    ordersQuery.data
      ?.filter((o) => COUNTED.includes(o.status))
      .sort((x, y) => (y.closedAt ?? "").localeCompare(x.closedAt ?? "")) ?? [];

  const rows = b
    ? [
        { label: "Prepaid", count: b.prepaid, bar: "bg-accent-2" },
        { label: "Received", count: b.received, bar: "bg-accent" },
        { label: "Delayed", count: b.delayed, bar: "bg-warn-text" },
        { label: "Cancelled", count: b.cancelled, bar: "bg-warn-text" },
        { label: "Refused", count: b.refused, bar: "bg-critical-text" },
      ]
    : [];

  return (
    <main className="min-h-[calc(100dvh-68px)] bg-bg">
      <div className="container-page flex flex-col gap-5 pt-8">
        <div className="flex flex-col gap-1.5">
          <h1 className="font-display text-h2 font-semibold leading-[1.15] text-text">
            My commitment score
          </h1>
          <p className="text-sm text-neutral-500">
            Stores see this number on your cash orders, never your name or
            phone.
          </p>
        </div>

        {scoreQuery.isPending ? (
          <p className="text-sm text-neutral-500">Loading your score…</p>
        ) : scoreQuery.isError ? (
          <p className="rounded-md bg-critical-bg px-3 py-2 text-sm text-critical-text">
            {scoreQuery.error.message}
          </p>
        ) : b!.score === null ? (
          /* No history yet */
          <section className={`flex flex-col gap-2 p-6 ${panel}`}>
            <span className={kicker}>Current score</span>
            <span className="font-display text-h3 font-semibold text-text">
              No score yet
            </span>
            <p className="max-w-130 text-sm leading-normal text-neutral-500">
              Your score appears after your first order is closed. Receiving
              your orders, or paying by card, starts it high.
            </p>
            <Link
              href="/customer/stores"
              className="mt-2 w-fit text-sm font-medium text-accent hover:text-accent-300"
            >
              Browse stores
            </Link>
          </section>
        ) : (
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            {/* Left Section */}
            <div className="flex min-w-0 flex-1 flex-col gap-4">
              {/* Current score */}
              {(() => {
                const c = category(b!.score!);
                return (
                  <section
                    className={`flex flex-col gap-4 p-5 sm:p-6 ${panel}`}
                  >
                    <span className={kicker}>Current score</span>
                    <div className="flex items-end gap-2.5">
                      <span className="font-display text-score font-semibold leading-none tabular-nums text-text">
                        {b!.score}
                      </span>
                      <span className="pb-1.5 text-sm text-neutral-500">
                        / 100
                      </span>
                      <span className="ml-auto pb-1">
                        <span className={`${tagBase} ${c.cls}`}>{c.label}</span>
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-divider">
                      <div
                        className={`h-full rounded-full ${c.bar}`}
                        style={{ width: `${b!.score}%` }}
                      />
                    </div>
                    <p className="text-sm leading-normal text-neutral-500">
                      Recalculated each time one of your orders is closed.
                      Refusing a delivery lowers it the most; delays and
                      cancellations lower it a little.
                    </p>
                  </section>
                );
              })()}

              {/* Breakdown */}
              <section className={`flex flex-col gap-3 p-5 sm:p-6 ${panel}`}>
                <span className={kicker}>Breakdown</span>

                {rows.map((r) => (
                  <div key={r.label} className="flex items-center gap-3">
                    <span className="w-20 shrink-0 text-body text-text">
                      {r.label}
                    </span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-divider">
                      <div
                        className={`h-full rounded-full ${r.bar}`}
                        style={{ width: `${(r.count / b!.total) * 100}%` }}
                      />
                    </div>
                    <span className="w-8 shrink-0 text-right text-body tabular-nums text-text">
                      {r.count}
                    </span>
                  </div>
                ))}
              </section>
            </div>

            {/*Right Section - History */}
            <section
              className={`flex w-full flex-col gap-1 p-5 sm:p-6 lg:w-115 lg:shrink-0 ${panel}`}
            >
              <span className={`${kicker} mb-2`}>History</span>

              {ordersQuery.isPending ? (
                <p className="text-sm text-neutral-500">Loading…</p>
              ) : history.length === 0 ? (
                <p className="text-sm text-neutral-500">
                  No closed orders yet.
                </p>
              ) : (
                history.map((o) => {
                  const e = outcome(o);
                  const fx = effect(e.weight);
                  return (
                    <Link
                      key={o.id}
                      href={`/customer/orders/${o.id}`}
                      className="-mx-2 flex items-center gap-3 rounded-md px-2 py-2.5 hover:bg-bg"
                    >
                      <span
                        className={`size-2 shrink-0 rounded-full ${e.dot}`}
                      />
                      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <span className="text-body text-text">{e.label}</span>
                        <span className="truncate text-2xs text-neutral-500">
                          <span className="font-mono">{orderCode(o.id)}</span> ·{" "}
                          {o.storeName} ·{" "}
                          {o.closedAt ? day.format(new Date(o.closedAt)) : ""}
                        </span>
                      </div>
                      <span
                        className={`whitespace-nowrap text-xs font-medium ${fx.cls}`}
                      >
                        {fx.text}
                      </span>
                    </Link>
                  );
                })
              )}
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
