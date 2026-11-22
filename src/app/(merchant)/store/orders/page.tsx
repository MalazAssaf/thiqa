"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import CloseIcon from "@mui/icons-material/Close";
import { api, BASE_URL } from "@/src/lib/api";
import { cities } from "@/src/data/cities";

type Risk = "HIGH" | "MODERATE" | "LOW" | "RISKY" | "NONE";
type RiskFilter = "ALL" | Exclude<Risk, "NONE">;

const price = new Intl.NumberFormat("en-SA", {
  style: "currency",
  currency: "SAR",
});
const day = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});
const orderCode = (id: number) => `ORD-${String(id).padStart(4, "0")}`;
const cityLabel = (v: string | null) =>
  v ? (cities.find((c) => c.value === v)?.label ?? v) : "";

const panel =
  "rounded-lg bg-surface shadow-[0_1px_2px_0_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.07)]";
const tagBase =
  "inline-flex h-[21px] shrink-0 items-center whitespace-nowrap rounded-md px-2 text-2xs font-medium";

/* ---------- score ---------- */

function riskOf(score: number | null): Risk {
  if (score === null) return "NONE";
  if (score >= 80) return "HIGH";
  if (score >= 60) return "MODERATE";
  if (score >= 40) return "LOW";
  return "RISKY";
}

const risk: Record<Risk, { label: string; cls: string; note: string }> = {
  HIGH: {
    label: "High",
    cls: "bg-accent2-800 text-accent2-100",
    note: "Very likely to receive the order.",
  },
  MODERATE: {
    label: "Moderate",
    cls: "bg-accent-800 text-accent-100",
    note: "Usually receives orders.",
  },
  LOW: {
    label: "Low",
    cls: "bg-warn-bg text-warn-text",
    note: "Elevated risk of refusal on arrival.",
  },
  RISKY: {
    label: "Risky",
    cls: "bg-critical-bg text-critical-text",
    note: "High risk of refusal. Consider rejecting or asking for card payment.",
  },
  NONE: {
    label: "No history",
    cls: "bg-divider text-neutral-100",
    note: "First order on Thiqa, so there is no record yet.",
  },
};

/* ---------- status ---------- */

function statusTag(o: StoreOrder) {
  if (o.status === "OUT_FOR_DELIVERY" && o.delayed)
    return { label: "Delayed", cls: "bg-warn-bg text-warn-text" };
  switch (o.status) {
    case "PENDING":
      return { label: "Pending", cls: "border border-accent text-accent" };
    case "CONFIRMED":
      return { label: "Accepted", cls: "bg-accent-800 text-accent-100" };
    case "OUT_FOR_DELIVERY":
      return {
        label: "Out for delivery",
        cls: "bg-accent2-800 text-accent2-100",
      };
    case "DELIVERED":
      return { label: "Received", cls: "bg-accent-800 text-accent-100" };
    case "REFUSED":
      return { label: "Refused", cls: "bg-critical-bg text-critical-text" };
    case "REJECTED":
      return { label: "Rejected", cls: "bg-divider text-neutral-100" };
    case "CANCELLED":
      return { label: "Cancelled", cls: "bg-divider text-neutral-100" };
  }
}

/* ---------- actions per status ---------- */

type Action = {
  path: string;
  label: string;
  style: "primary" | "secondary" | "danger";
};

function actionsFor(o: StoreOrder): Action[] {
  switch (o.status) {
    case "PENDING":
      return [
        { path: "confirm", label: "Accept", style: "primary" },
        { path: "reject", label: "Reject", style: "secondary" },
      ];
    case "CONFIRMED":
      return [
        {
          path: "out-for-delivery",
          label: "Mark out for delivery",
          style: "primary",
        },
      ];
    case "OUT_FOR_DELIVERY":
      return [
        { path: "delivered", label: "Delivered", style: "primary" },
        ...(o.paymentMethod === "COD"
          ? [
              {
                path: "refused",
                label: "Refused at door",
                style: "danger",
              } as Action,
            ]
          : []),
        ...(!o.delayed
          ? [
              {
                path: "delayed",
                label: "Mark delayed",
                style: "secondary",
              } as Action,
            ]
          : []),
      ];
    default:
      return [];
  }
}

const btn: Record<Action["style"], string> = {
  primary: "bg-accent text-cream hover:bg-accent-300",
  secondary:
    "border border-divider bg-surface text-text hover:border-accent hover:text-accent",
  danger:
    "border border-critical-text/40 bg-surface text-critical-text hover:bg-critical-bg/50",
};

/* ---------- small pieces ---------- */

function Tag({ label, cls }: { label: string; cls: string }) {
  return <span className={`${tagBase} ${cls}`}>{label}</span>;
}

function Score({ o }: { o: StoreOrder }) {
  const r = risk[riskOf(o.scoreAtOrder)];
  return (
    <span className="flex items-center gap-2">
      <span className="w-7 font-display text-h5 font-semibold tabular-nums text-text">
        {o.scoreAtOrder ?? "—"}
      </span>
      <Tag label={r.label} cls={r.cls} />
    </span>
  );
}

function PayTag({ o }: { o: StoreOrder }) {
  return (
    <Tag
      label={o.paymentMethod === "COD" ? "COD" : "Card"}
      cls="bg-divider text-neutral-100"
    />
  );
}

/* ---------- detail panel ---------- */

function OrderDetail({
  o,
  onAction,
  pending,
  error,
}: {
  o: StoreOrder;
  onAction: (path: string) => void;
  pending: boolean;
  error: string | null;
}) {
  const r = risk[riskOf(o.scoreAtOrder)];
  const s = statusTag(o);
  const actions = actionsFor(o);

  return (
    <div className="flex flex-col gap-4 p-5">
      <div className="flex flex-col gap-1">
        <span className="font-mono text-2xs font-medium text-accent">
          {orderCode(o.id)}
        </span>
        <span className="font-display text-h4 font-semibold text-text">
          {o.customerLabel}
        </span>
        <span className="text-xs text-neutral-500">
          Personal details and order history stay hidden.
        </span>
      </div>

      {/* Score box */}
      <div className="flex flex-col gap-2 rounded-lg bg-section-base p-4">
        <div className="flex items-end gap-2">
          <span className="font-display text-stat font-semibold leading-none tabular-nums text-accent-2">
            {o.scoreAtOrder ?? "—"}
          </span>
          <span className="pb-1 text-2xs text-neutral-700">of 100</span>
          <span className="ml-auto">
            <Tag label={r.label} cls={r.cls} />
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-white/15">
          <div
            className="h-full rounded-full bg-accent-2"
            style={{ width: `${o.scoreAtOrder ?? 0}%` }}
          />
        </div>
        <p className="text-xs text-cream">
          {o.paymentMethod === "CARD"
            ? "Prepaid, so it can't be refused on arrival."
            : r.note}
        </p>
        <p className="text-2xs text-neutral-700">
          Score at the moment the order was placed.
        </p>
      </div>

      {/* Items */}
      <div className="flex flex-col gap-2.5">
        {o.items.map((i) => (
          <div key={i.productId} className="flex items-center gap-3">
            <img
              src={`${BASE_URL}${i.imageUrl}`}
              alt=""
              className="size-10 shrink-0 rounded-md bg-neutral-900 object-cover"
            />
            <span className="min-w-0 flex-1 truncate text-sm text-text">
              {i.name} <span className="text-neutral-500">×{i.quantity}</span>
            </span>
            <span className="whitespace-nowrap text-sm tabular-nums text-text">
              {price.format(i.unitPrice * i.quantity)}
            </span>
          </div>
        ))}
      </div>

      {/* Meta */}
      <div className="flex flex-col gap-2 border-t border-divider pt-3">
        {[
          ["Total", price.format(o.total)],
          [
            "Payment",
            o.paymentMethod === "COD" ? "Cash on delivery" : "Card, paid",
          ],
          ["City", cityLabel(o.deliveryCity) || "—"],
          ["Placed", day.format(new Date(o.createdAt))],
          ...(o.closedAt ? [["Closed", day.format(new Date(o.closedAt))]] : []),
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4 text-sm">
            <span className="text-neutral-500">{label}</span>
            <span className="tabular-nums text-text">{value}</span>
          </div>
        ))}
        {o.deliveryDetails ? (
          <div className="flex justify-between gap-4 text-sm">
            <span className="text-neutral-500">Address</span>
            <span className="text-right text-text">{o.deliveryDetails}</span>
          </div>
        ) : (
          o.status === "PENDING" && (
            <p className="text-2xs text-neutral-500">
              The full address appears after you accept the order.
            </p>
          )
        )}
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="text-neutral-500">Status</span>
          <Tag label={s.label} cls={s.cls} />
        </div>
      </div>

      {/* Actions */}
      {actions.length > 0 && (
        <div className="grid grid-cols-2 gap-2.5">
          {actions.map((a, idx) => (
            <button
              key={a.path}
              type="button"
              disabled={pending}
              onClick={() => onAction(a.path)}
              className={`h-10 rounded-md px-3 text-sm font-medium disabled:opacity-60 ${btn[a.style]} ${
                actions.length % 2 === 1 && idx === 0 ? "col-span-2" : ""
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>
      )}

      {error && (
        <p className="rounded-md bg-critical-bg px-3 py-2 text-xs text-critical-text">
          {error}
        </p>
      )}
    </div>
  );
}

/* ---------- page ---------- */

const cols =
  "grid grid-cols-[110px_minmax(0,1fr)_110px_70px_150px_130px] items-center gap-x-3";

export default function IncomingOrdersPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<RiskFilter>("ALL");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const {
    data: orders,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["store-orders"],
    queryFn: () => api<StoreOrder[]>("/api/store/orders"),
  });

  const action = useMutation({
    mutationFn: ({ id, path }: { id: number; path: string }) =>
      api<StoreOrder>(`/api/store/orders/${id}/${path}`, { method: "PATCH" }),
    onSuccess: (updated) => {
      queryClient.setQueryData<StoreOrder[]>(["store-orders"], (old) =>
        old?.map((o) => (o.id === updated.id ? updated : o)),
      );
    },
  });

  const shown =
    orders?.filter(
      (o) => filter === "ALL" || riskOf(o.scoreAtOrder) === filter,
    ) ?? [];

  useEffect(() => {
    if (orders && selectedId === null && orders.length > 0) {
      setSelectedId(
        (orders.find((o) => o.status === "PENDING") ?? orders[0]).id,
      );
    }
  }, [orders, selectedId]);

  const selected = orders?.find((o) => o.id === selectedId) ?? null;

  function select(id: number) {
    setSelectedId(id);
    action.reset();
    setSheetOpen(true);
  }

  const detail = selected && (
    <OrderDetail
      o={selected}
      pending={action.isPending}
      error={action.isError ? action.error.message : null}
      onAction={(path) => action.mutate({ id: selected.id, path })}
    />
  );

  const filterKeys: RiskFilter[] = ["ALL", "HIGH", "MODERATE", "LOW", "RISKY"];

  return (
    <main className="min-h-[calc(100dvh-68px)] bg-bg pb-16">
      <div className="container-page flex flex-col gap-5 pt-8">
        <div className="flex flex-col gap-1.5">
          <h1 className="font-display text-h2 font-semibold leading-[1.15] text-text">
            Incoming orders
          </h1>
          <p className="text-sm text-neutral-500">
            Check the commitment score before confirming a cash-on-delivery
            order.
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
            <p className="text-sm text-text">No orders yet.</p>
            <p className="mt-1 text-xs text-neutral-500">
              New orders show up here with the customer&apos;s commitment score.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            {/* List */}
            <div className="flex min-w-0 flex-1 flex-col gap-4">
              {/* Risk filter */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-neutral-500">Risk</span>
                <div className="overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden">
                  <div className="flex h-8.5 w-max overflow-hidden rounded-md border border-divider bg-surface">
                    {filterKeys.map((k) => {
                      const active = filter === k;
                      return (
                        <button
                          key={k}
                          type="button"
                          onClick={() => setFilter(k)}
                          aria-pressed={active}
                          className={`whitespace-nowrap border-r border-divider px-3 text-sm last:border-r-0 ${
                            active
                              ? "bg-cream font-medium text-accent"
                              : "text-text hover:text-accent"
                          }`}
                        >
                          {k === "ALL" ? "All" : risk[k].label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {shown.length === 0 ? (
                <p
                  className={`px-5 py-10 text-center text-sm text-neutral-500 ${panel}`}
                >
                  No orders in this risk group.
                </p>
              ) : (
                <>
                  {/* Mobile + tablet: cards */}
                  <div className="flex flex-col gap-3 lg:hidden">
                    {shown.map((o) => {
                      const s = statusTag(o);
                      return (
                        <button
                          key={o.id}
                          type="button"
                          onClick={() => select(o.id)}
                          className={`flex flex-col gap-3 p-4 text-left ${panel}`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex flex-col gap-0.5">
                              <span className="font-mono text-xs font-medium text-text">
                                {orderCode(o.id)}
                              </span>
                              <span className="text-xs text-neutral-500">
                                {o.customerLabel} ·{" "}
                                {o.deliveryCity &&
                                  `${cityLabel(o.deliveryCity)} · `}
                                {day.format(new Date(o.createdAt))}
                              </span>
                            </div>
                            <Tag label={s.label} cls={s.cls} />
                          </div>
                          <div className="flex items-center justify-between gap-3 border-t border-divider pt-3">
                            <Score o={o} />
                            <span className="flex items-center gap-2">
                              <PayTag o={o} />
                              <span className="text-body font-medium tabular-nums text-text">
                                {price.format(o.total)}
                              </span>
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Desktop: table */}
                  <div className="hidden lg:block">
                    <div
                      className={`${cols} border-b border-divider px-2 pb-2 text-3xs font-medium uppercase tracking-wider text-neutral-500`}
                    >
                      <span>Order</span>
                      <span>Customer</span>
                      <span>Total</span>
                      <span>Pay</span>
                      <span>Score</span>
                      <span>Status</span>
                    </div>
                    {shown.map((o) => {
                      const s = statusTag(o);
                      const active = o.id === selectedId;
                      return (
                        <button
                          key={o.id}
                          type="button"
                          onClick={() => select(o.id)}
                          className={`${cols} w-full rounded-md border px-2 py-2.5 text-left ${
                            active
                              ? "border-accent bg-cream"
                              : "border-transparent border-b-divider hover:bg-surface/60"
                          }`}
                        >
                          <span className="font-mono text-xs text-neutral-300">
                            {orderCode(o.id)}
                          </span>
                          <span className="truncate text-body text-text">
                            {o.customerLabel}
                          </span>
                          <span className="text-body tabular-nums text-text">
                            {price.format(o.total)}
                          </span>
                          <span>
                            <PayTag o={o} />
                          </span>
                          <Score o={o} />
                          <span>
                            <Tag label={s.label} cls={s.cls} />
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              <p className="text-2xs text-neutral-500">
                {shown.length} of {orders.length} orders shown
              </p>
            </div>

            {/* Desktop detail */}
            <aside
              className={`sticky top-6 hidden w-95 shrink-0 lg:block ${panel}`}
            >
              {detail}
            </aside>
          </div>
        )}
      </div>

      {/* Mobile detail: bottom sheet */}
      {sheetOpen && selected && (
        <div
          className="fixed inset-0 z-50 flex items-end bg-black/40 lg:hidden"
          onClick={() => setSheetOpen(false)}
        >
          <div
            className="relative max-h-[85dvh] w-full overflow-y-auto rounded-t-xl bg-surface"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close"
              onClick={() => setSheetOpen(false)}
              className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-md text-neutral-500 hover:bg-bg"
            >
              <CloseIcon sx={{ fontSize: 18 }} />
            </button>
            {detail}
          </div>
        </div>
      )}
    </main>
  );
}
