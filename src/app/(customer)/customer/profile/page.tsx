"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ErrorIcon from "@mui/icons-material/Error";
import Dropdown from "@/src/components/ui/Dropdown";
import { cities } from "@/src/data/cities";
import { api } from "@/src/lib/api";
import { category } from "@/src/data/score";

type Me = {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  city: string | null;
  emailVerified: boolean;
};

type ScoreBreakdown = {
  score: number | null;
  received: number;
  prepaid: number;
  delayed: number;
  cancelled: number;
  refused: number;
  total: number;
};

type Address = {
  id: number;
  label: string;
  city: string;
  details: string;
  defaultAddress: boolean;
};

const MAX_ADDRESSES = 3;
const emptyForm = { label: "", city: "", details: "" };

const card =
  "flex flex-col gap-3 rounded-lg bg-surface p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.07)] sm:p-6";
const kicker = "text-3xs font-medium uppercase tracking-[0.6px] text-accent";
const fieldLabel = "text-2xs leading-[1.3] text-neutral-500";
const control =
  "h-10 w-full min-w-0 rounded-md border border-divider bg-surface px-2.5 text-base text-text placeholder:text-neutral-600 outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 sm:h-9 sm:text-sm";

function formatPhone(phone: string) {
  const d = phone.replace(/\D/g, "").slice(-9); // 5XXXXXXXX
  return `+966 ${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5)}`;
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

const cityLabel = (v: string) => cities.find((c) => c.value === v)?.label ?? v;

export default function ProfilePage() {
  return (
    <main className="min-h-[calc(100dvh-68px)] bg-bg pb-16">
      <div className="container-page flex flex-col gap-4 pt-8">
        <h1 className="font-display text-h2 font-semibold leading-[1.15] text-text">
          Profile
        </h1>
        <div className="grid items-start gap-6 lg:grid-cols-2">
          <AccountCard />
          <AddressesCard />
        </div>
      </div>
    </main>
  );
}

function AccountCard() {
  const me = useQuery({
    queryKey: ["customer", "me"],
    queryFn: () => api<Me>("/api/customer/me"),
  });
  const score = useQuery({
    queryKey: ["customer-score"], // same key as the C-10 page, so the cache is shared
    queryFn: () => api<ScoreBreakdown>("/api/customer/score"),
  });

  if (me.isLoading)
    return <div className="h-56 animate-pulse rounded-lg bg-surface" />;
  if (me.error)
    return <p className="text-sm text-critical-text">{me.error.message}</p>;
  if (!me.data) return null;

  const s = score.data?.score;

  return (
    <section className={card}>
      <p className={kicker}>Account</p>

      <div className="flex items-center gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent-900 text-sm font-semibold text-accent">
          {initials(me.data.fullName)}
        </div>
        <div className="flex flex-col">
          <span className="text-h5 tabular-nums text-text">
            {formatPhone(me.data.phone)}
          </span>
          {me.data.emailVerified && (
            <span className="flex items-center gap-1 text-xs text-accent">
              <VerifiedOutlinedIcon sx={{ fontSize: 14 }} />
              Verified identifier
            </span>
          )}
        </div>
      </div>

      <p className="max-w-125 text-sm text-neutral-400">
        This number is the unique identifier for your commitment record. A
        second account on the same number is not possible.
      </p>

      <div className="flex flex-col gap-3 text-sm">
        <div className="flex justify-between">
          <span className="text-text">Commitment score</span>
          <span className="tabular-nums text-text">
            {s == null ? "No score yet" : `${s} · ${category(s).label}`}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-text">Orders on record</span>
          <span className="tabular-nums text-text">
            {score.data?.total ?? 0}
          </span>
        </div>
      </div>
    </section>
  );
}

function AddressesCard() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);

  const { data: addresses = [], isLoading } = useQuery({
    queryKey: ["customer", "addresses"],
    queryFn: () => api<Address[]>("/api/customer/addresses"),
  });

  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: ["customer", "addresses"] });

  function reset() {
    setForm(emptyForm);
    setEditingId(null);
  }

  const save = useMutation({
    mutationFn: () => {
      const body = JSON.stringify({
        label: form.label.trim(),
        city: form.city,
        details: form.details.trim(),
      });
      return editingId
        ? api<Address>(`/api/customer/addresses/${editingId}`, {
            method: "PUT",
            body,
          })
        : api<Address>("/api/customer/addresses", { method: "POST", body });
    },
    onSuccess: () => {
      reset();
      refresh();
    },
  });

  const remove = useMutation({
    mutationFn: (id: number) =>
      api(`/api/customer/addresses/${id}`, { method: "DELETE" }),
    onSuccess: (_, id) => {
      if (id === editingId) reset();
      refresh();
    },
  });

  const makeDefault = useMutation({
    mutationFn: (id: number) =>
      api(`/api/customer/addresses/${id}/default`, { method: "PATCH" }),
    onSuccess: refresh,
  });

  function startEdit(a: Address) {
    setEditingId(a.id);
    setForm({ label: a.label, city: a.city, details: a.details });
    save.reset();
  }

  const editing = addresses.find((a) => a.id === editingId);
  const changed =
    !editing ||
    form.label.trim() !== editing.label ||
    form.city !== editing.city ||
    form.details.trim() !== editing.details;

  const canSave =
    !!form.label.trim() &&
    !!form.city &&
    !!form.details.trim() &&
    changed &&
    !save.isPending;

  const showForm = editingId !== null || addresses.length < MAX_ADDRESSES;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (canSave) save.mutate();
  }

  const error = save.error ?? remove.error ?? makeDefault.error;

  return (
    <section className={card}>
      <p className={kicker}>Addresses</p>

      {isLoading ? (
        <div className="h-24 animate-pulse rounded-md bg-neutral-900" />
      ) : addresses.length === 0 ? (
        <p className="text-sm text-neutral-400">
          No addresses yet. Add one below to use it at checkout.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {addresses.map((a) => (
            <li
              key={a.id}
              className={`flex items-start gap-2 rounded-md ${
                a.id === editingId ? "-mx-2 bg-accent-900 px-2 py-1" : ""
              }`}
            >
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-text">{a.label}</span>
                  {a.defaultAddress && (
                    <span className="rounded-sm bg-accent-800 px-1.75 py-0.5 text-3xs font-medium text-accent-100">
                      Default
                    </span>
                  )}
                </div>
                <span className="truncate text-sm text-neutral-400">
                  {a.details}, {cityLabel(a.city)}
                </span>
              </div>

              {!a.defaultAddress && (
                <button
                  type="button"
                  onClick={() => makeDefault.mutate(a.id)}
                  disabled={makeDefault.isPending}
                  className="h-8 rounded-md px-2.5 text-sm font-medium text-accent hover:bg-accent-900 disabled:opacity-60"
                >
                  Set default
                </button>
              )}
              <button
                type="button"
                aria-label={`Edit ${a.label}`}
                onClick={() => startEdit(a)}
                className="flex size-8 items-center justify-center rounded-md text-neutral-500 hover:bg-accent-900 hover:text-accent"
              >
                <EditOutlinedIcon sx={{ fontSize: 16 }} />
              </button>
              <button
                type="button"
                aria-label={`Delete ${a.label}`}
                onClick={() => remove.mutate(a.id)}
                disabled={remove.isPending}
                className="flex size-8 items-center justify-center rounded-md text-neutral-500 hover:bg-critical-bg/50 hover:text-critical-text disabled:opacity-60"
              >
                <DeleteOutlineIcon sx={{ fontSize: 16 }} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <hr className="border-divider" />

      {showForm ? (
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-3">
          {editingId && (
            <p className="text-2xs font-medium text-accent">
              Editing {editing?.label}
            </p>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex flex-col gap-1.25 sm:w-32">
              <label htmlFor="label" className={fieldLabel}>
                Label
              </label>
              <input
                id="label"
                placeholder="Office"
                maxLength={30}
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
                className={control}
              />
            </div>
            <div className="sm:w-40">
              <Dropdown
                id="address-city"
                label="City"
                options={cities}
                value={form.city}
                onChange={(v) => setForm({ ...form, city: v })}
                placeholder="Select city"
              />
            </div>
          </div>

          <div className="flex items-end gap-2">
            <div className="flex flex-1 flex-col gap-1.25">
              <label htmlFor="details" className={fieldLabel}>
                Address
              </label>
              <input
                id="details"
                placeholder="King Fahd Rd, 12311"
                maxLength={200}
                value={form.details}
                onChange={(e) => setForm({ ...form, details: e.target.value })}
                className={control}
              />
            </div>
            {editingId && (
              <button
                type="button"
                onClick={reset}
                className="h-10 rounded-md px-3 text-sm font-medium text-neutral-500 hover:text-text sm:h-9"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={!canSave}
              className="h-10 rounded-md bg-accent px-4 text-sm font-medium text-cream hover:bg-accent-300 disabled:cursor-not-allowed disabled:opacity-60 sm:h-9"
            >
              {save.isPending ? "Saving..." : editingId ? "Save" : "Add"}
            </button>
          </div>
        </form>
      ) : (
        <p className="text-sm text-neutral-400">
          You&apos;ve saved {MAX_ADDRESSES} addresses. Delete one to add
          another.
        </p>
      )}

      {error && (
        <p
          role="alert"
          className="flex items-center gap-1.5 text-xs text-critical-text"
        >
          <ErrorIcon sx={{ fontSize: 16 }} />
          {error.message}
        </p>
      )}
    </section>
  );
}
