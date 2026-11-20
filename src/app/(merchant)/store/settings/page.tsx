"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ErrorIcon from "@mui/icons-material/Error";
import Snackbar from "@/src/components/ui/Snackbar";
import Dropdown from "@/src/components/ui/Dropdown";
import { cities } from "@/src/data/cities";
import { categories } from "@/src/data/categories";
import { api } from "@/src/lib/api";

type StoreMe = {
  id: number;
  name: string;
  category: string;
  city: string;
  email: string;
  phone: string;
  emailVerified: boolean;
  autoReject: boolean;
  rejectThreshold: number;
};

const kicker = "text-3xs font-medium uppercase tracking-[0.6px] text-accent";
const fieldLabel = "text-2xs leading-[1.3] text-neutral-500";
const control =
  "h-10 w-full min-w-0 rounded-md border border-divider bg-surface px-2.5 text-base text-text outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 sm:h-9 sm:text-sm";

export default function StoreSettingsPage() {
  const {
    data: store,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["store", "me"],
    queryFn: () => api<StoreMe>("/api/store/me"),
  });

  return (
    <main className="min-h-[calc(100dvh-68px)] bg-bg pb-16">
      <div className="container-page flex flex-col gap-4 pt-8">
        <h1 className="font-display text-h2 font-semibold leading-[1.15] text-text">
          Settings
        </h1>

        {isLoading ? (
          <div className="h-96 max-w-165 animate-pulse rounded-lg bg-surface" />
        ) : error ? (
          <p className="text-sm text-critical-text">{error.message}</p>
        ) : (
          store && <SettingsForm store={store} />
        )}
      </div>
    </main>
  );
}

function SettingsForm({ store }: { store: StoreMe }) {
  const queryClient = useQueryClient();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: store.name,
    category: store.category,
    city: store.city,
    autoReject: store.autoReject,
    rejectThreshold: store.rejectThreshold,
  });

  const save = useMutation({
    mutationFn: () =>
      api<StoreMe>("/api/store/settings", {
        method: "PUT",
        body: JSON.stringify({ ...form, name: form.name.trim() }),
      }),
    onSuccess: () => {
      setSaved(true);
      queryClient.invalidateQueries({ queryKey: ["store", "me"] });
    },
  });

  function update<K extends keyof typeof form>(
    field: K,
    value: (typeof form)[K],
  ) {
    setForm({ ...form, [field]: value });
    save.reset();
  }

  const t = form.rejectThreshold;

  const changed =
    form.name.trim() !== store.name ||
    form.category !== store.category ||
    form.city !== store.city ||
    form.autoReject !== store.autoReject ||
    form.rejectThreshold !== store.rejectThreshold;

  const canSave = changed && !!form.name.trim() && !save.isPending;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (canSave) save.mutate();
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="flex w-full max-w-165 flex-col gap-3.5 rounded-lg bg-surface p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.07)] sm:p-6"
    >
      {/* COD lock */}
      <p className={kicker}>Cash on delivery lock</p>

      <label className="flex cursor-pointer items-center gap-2 text-sm text-text">
        <input
          type="checkbox"
          checked={form.autoReject}
          onChange={(e) => update("autoReject", e.target.checked)}
          className="size-4 accent-accent"
        />
        Lock cash on delivery below a score
      </label>

      <div
        className={`flex flex-col gap-2.5 ${form.autoReject ? "" : "opacity-40"}`}
      >
        <label htmlFor="threshold" className={fieldLabel}>
          Lock COD below <span className="tabular-nums">{t}</span>
        </label>
        <input
          id="threshold"
          type="range"
          min={0}
          max={100}
          step={5}
          value={t}
          disabled={!form.autoReject}
          onChange={(e) => update("rejectThreshold", Number(e.target.value))}
          className="w-full accent-accent disabled:cursor-not-allowed"
        />
      </div>

      <p className="text-sm text-neutral-400">
        {form.autoReject
          ? `Customers scoring below ${t} can still order from you, but cash on delivery is greyed out — they pay by card at checkout. Prepaid orders carry no return-to-origin cost.`
          : "Every customer can choose cash on delivery. You review each COD order's score before accepting it."}
      </p>

      <hr className="border-divider" />

      {/* Store */}
      <p className={kicker}>Store</p>

      <div className="flex flex-col gap-1.25">
        <label htmlFor="name" className={fieldLabel}>
          Store name
        </label>
        <input
          id="name"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          aria-invalid={!form.name.trim()}
          className={`${control} ${form.name.trim() ? "" : "border-critical-text"}`}
        />
        {!form.name.trim() && (
          <p className="text-xs text-critical-text">Enter the store name.</p>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <Dropdown
            id="category"
            label="Category"
            options={categories}
            value={form.category}
            onChange={(v) => update("category", v)}
            disabled={save.isPending}
          />
        </div>
        <div className="flex-1">
          <Dropdown
            id="city"
            label="City"
            options={cities}
            value={form.city}
            onChange={(v) => update("city", v)}
            disabled={save.isPending}
          />
        </div>
      </div>

      {save.error && (
        <p
          role="alert"
          className="flex items-center gap-1.5 text-xs text-critical-text"
        >
          <ErrorIcon sx={{ fontSize: 16 }} />
          {save.error.message}
        </p>
      )}

      <button
        type="submit"
        disabled={!canSave}
        className="mt-1 flex h-11 items-center justify-center rounded-md bg-accent px-3 text-sm font-medium text-cream hover:bg-accent-300 disabled:cursor-not-allowed disabled:opacity-60 sm:h-9 sm:self-start sm:px-5"
      >
        {save.isPending ? "Saving..." : "Save changes"}
      </button>

      {saved && (
        <Snackbar
          type="success"
          message="Settings saved."
          onClose={() => setSaved(false)}
        />
      )}
    </form>
  );
}
