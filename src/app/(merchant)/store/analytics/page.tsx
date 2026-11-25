"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/src/lib/api";
import { category } from "@/src/data/score";

type StoreMe = {
  autoReject: boolean;
  rejectThreshold: number;
};

const panel =
  "rounded-lg bg-surface shadow-[0_1px_2px_0_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.07)]";
const kicker =
  "text-kicker font-medium uppercase tracking-wider text-neutral-500";
const tagBase =
  "inline-flex h-[21px] shrink-0 items-center whitespace-nowrap rounded-md px-2 text-2xs font-medium";

const pct = (part: number, whole: number) =>
  whole === 0 ? 0 : Math.round((part / whole) * 100);

function BarRow({
  label,
  count,
  max,
  bar,
}: {
  label: React.ReactNode;
  count: number;
  max: number;
  bar: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-24 shrink-0 text-body text-text">{label}</span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-divider">
        <div
          className={`h-full rounded-full ${bar}`}
          style={{ width: `${pct(count, max)}%` }}
        />
      </div>
      <span className="w-8 shrink-0 text-right text-body tabular-nums text-text">
        {count}
      </span>
    </div>
  );
}

export default function AnalyticsPage() {
  const ordersQuery = useQuery({
    queryKey: ["store-orders"],
    queryFn: () => api<StoreOrder[]>("/api/store/orders"),
  });
  const storeQuery = useQuery({
    queryKey: ["store", "me"],
    queryFn: () => api<StoreMe>("/api/store/me"),
  });

  const orders = ordersQuery.data ?? [];
  const store = storeQuery.data;

  const codClosed = orders.filter(
    (o) =>
      o.paymentMethod === "COD" &&
      (o.status === "DELIVERED" || o.status === "REFUSED"),
  );
  const refused = orders.filter((o) => o.status === "REFUSED").length;
  const rto = pct(refused, codClosed.length);

  // Closed orders by outcome
  const received = orders.filter(
    (o) => o.status === "DELIVERED" && !o.delayed,
  ).length;
  const delayed = orders.filter(
    (o) => o.status === "DELIVERED" && o.delayed,
  ).length;
  const cancelled = orders.filter((o) => o.status === "CANCELLED").length;
  const outcomes = [
    { label: "Received", count: received, bar: "bg-accent" },
    { label: "Delayed", count: delayed, bar: "bg-warn-text" },
    { label: "Refused", count: refused, bar: "bg-critical-text" },
    { label: "Cancelled", count: cancelled, bar: "bg-neutral-600" },
  ];
  const outcomesMax = Math.max(1, ...outcomes.map((o) => o.count));

  // Customers under the COD lock who paid by card instead
  const switchedToCard = store?.autoReject
    ? orders.filter(
        (o) =>
          o.paymentMethod === "CARD" &&
          o.scoreAtOrder !== null &&
          o.scoreAtOrder < store.rejectThreshold,
      ).length
    : 0;

  // Incoming orders by score category
  // A sample score from each band, so every row gets its colours from category()
  const bands = [90, 70, 50, 20].map((s) => category(s));
  const tiers = [
    ...bands.map((c) => ({
      label: c.label,
      cls: c.cls,
      bar: c.bar,
      count: orders.filter(
        (o) =>
          o.scoreAtOrder !== null && category(o.scoreAtOrder).label === c.label,
      ).length,
    })),
    {
      label: "No history",
      cls: "bg-divider text-neutral-100",
      bar: "bg-neutral-600",
      count: orders.filter((o) => o.scoreAtOrder === null).length,
    },
  ];
  const tiersMax = Math.max(1, ...tiers.map((t) => t.count));

  return (
    <main className="min-h-[calc(100dvh-68px)] bg-bg pb-16">
      <div className="container-page flex flex-col gap-5 pt-8">
        <div className="flex flex-col gap-1.5">
          <h1 className="font-display text-h2 font-semibold leading-[1.15] text-text">
            Return to origin
          </h1>
          <p className="text-sm text-neutral-500">
            How your cash orders end, and what the commitment score saved you.
          </p>
        </div>

        {ordersQuery.isPending ? (
          <p className="text-sm text-neutral-500">Loading analytics…</p>
        ) : ordersQuery.isError ? (
          <p className="rounded-md bg-critical-bg px-3 py-2 text-sm text-critical-text">
            {ordersQuery.error.message}
          </p>
        ) : orders.length === 0 ? (
          <div className="rounded-lg border border-dashed border-divider bg-surface px-6 py-12 text-center">
            <p className="text-sm text-text">No orders yet.</p>
            <p className="mt-1 text-xs text-neutral-500">
              Analytics appear once customers start ordering from your store.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              {/* RTO rate */}
              <section className={`flex flex-col gap-2 p-6 ${panel}`}>
                <span className={kicker}>RTO rate</span>
                <span
                  className={`font-display text-stat font-semibold leading-none tabular-nums ${
                    rto >= 20 ? "text-critical-text" : "text-text"
                  }`}
                >
                  {rto}%
                </span>
                <p className="text-sm text-neutral-500">
                  {codClosed.length === 0
                    ? "No closed cash orders yet."
                    : `${refused} of ${codClosed.length} closed COD orders came back refused.`}
                </p>
              </section>

              {/* Closed orders by outcome */}
              <section className={`flex flex-col gap-3 p-6 ${panel}`}>
                <span className={kicker}>Closed orders by outcome</span>
                {outcomes.map((o) => (
                  <BarRow
                    key={o.label}
                    label={o.label}
                    count={o.count}
                    max={outcomesMax}
                    bar={o.bar}
                  />
                ))}
              </section>

              {/* COD lock impact */}
              <section className={`flex flex-col gap-2 p-6 ${panel}`}>
                <span className={kicker}>Switched to card</span>
                <span className="font-display text-stat font-semibold leading-none tabular-nums text-accent">
                  {switchedToCard}
                </span>
                <p className="text-sm text-neutral-500">
                  {store?.autoReject
                    ? `Orders from customers below ${store.rejectThreshold} who paid by card instead of cash. None of them can come back refused.`
                    : "Turn on the COD lock in Settings to see how many risky customers pay by card instead."}
                </p>
              </section>
            </div>

            {/* By score category */}
            <section className={`flex flex-col gap-3 p-6 ${panel}`}>
              <span className={kicker}>Incoming orders by category</span>
              {tiers.map((t) => (
                <BarRow
                  key={t.label}
                  label={
                    <span className={`${tagBase} ${t.cls}`}>{t.label}</span>
                  }
                  count={t.count}
                  max={tiersMax}
                  bar={t.bar}
                />
              ))}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
