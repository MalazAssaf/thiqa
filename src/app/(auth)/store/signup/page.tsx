"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import CheckIcon from "@mui/icons-material/Check";
import ErrorIcon from "@mui/icons-material/Error";
import StoreSignupInfo from "@/src/components/auth/StoreSignUpInfo";
import StoreSignupSteps from "@/src/components/auth/StoreSignupSteps";
import Dropdown from "@/src/components/ui/Dropdown";
import { cities } from "@/src/data/cities";
import { categories } from "@/src/data/categories";
import { api } from "@/src/lib/api";
import { isValidPhone, toLocalPhone } from "@/src/lib/phone";

const heading =
  "font-display text-h3 font-semibold leading-[1.2] tracking-[-0.22px] text-text";
const fieldLabel = "text-2xs leading-[1.3] text-neutral-500";
const control =
  "h-10 w-full min-w-0 rounded-md border border-divider bg-surface px-2.5 text-base text-text placeholder:text-neutral-600 outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 sm:h-9 sm:text-sm";
const controlError =
  "border-critical-text focus:border-critical-text focus:ring-critical-text/15";
const errorText = "text-xs leading-normal text-critical-text";
const primaryButton =
  "flex h-11 flex-1 items-center justify-center rounded-md bg-accent px-3 text-sm font-medium text-cream hover:bg-accent-300 disabled:opacity-60 sm:h-9";
const ghostButton =
  "flex h-11 flex-1 items-center justify-center rounded-md text-sm font-medium text-accent hover:bg-accent-900 sm:h-9";

type Field =
  | "storeName"
  | "category"
  | "city"
  | "phoneNumber"
  | "email"
  | "password";

export default function StoreSignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<0 | 1>(0);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [storeInfo, setStoreInfo] = useState({
    storeName: "",
    category: "",
    city: "",
    phoneNumber: "",
    email: "",
    password: "",
  });
  const [autoReject, setAutoReject] = useState(false);
  const [threshold, setThreshold] = useState(40);

  const signup = useMutation({
    mutationFn: () =>
      api("/api/auth/store/signup", {
        method: "POST",
        body: JSON.stringify({
          name: storeInfo.storeName.trim(),
          category: storeInfo.category,
          city: storeInfo.city,
          phone: toLocalPhone(storeInfo.phoneNumber),
          email: storeInfo.email.trim(),
          password: storeInfo.password,
          autoReject,
          rejectThreshold: autoReject ? threshold : null,
        }),
      }),
    onSuccess: () =>
      router.push(
        `/store/signup/verify?email=${encodeURIComponent(storeInfo.email.trim())}`,
      ),
  });

  function update(field: Field, value: string) {
    setStoreInfo({ ...storeInfo, [field]: value });
    setErrors({ ...errors, [field]: undefined });
    signup.reset();
  }

  function validate() {
    const e: Partial<Record<Field, string>> = {};
    if (storeInfo.storeName.trim().length < 2)
      e.storeName = "Enter your store name.";
    if (!storeInfo.category) e.category = "Select a category.";
    if (!storeInfo.city) e.city = "Select your city.";
    if (!isValidPhone(storeInfo.phoneNumber))
      e.phoneNumber = "Enter a valid mobile number.";
    if (!/^\S+@\S+\.\S+$/.test(storeInfo.email.trim()))
      e.email = "Enter a valid email.";
    if (storeInfo.password.length < 6)
      e.password = "Password must be at least 6 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  return (
    <main className="min-h-[calc(100dvh-68px)] bg-bg pb-12 lg:pb-16">
      <div className="mx-auto flex w-full max-w-360 flex-col items-center justify-center gap-8 px-4 py-6 sm:px-6 sm:py-8 lg:flex-row lg:gap-14 lg:px-15 lg:py-10">
        <StoreSignupInfo />

        {/* Card */}
        <section className="flex w-full flex-col gap-3 rounded-lg bg-surface p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.07)] sm:max-w-120 sm:p-6 lg:w-100 lg:max-w-none lg:shrink-0">
          <StoreSignupSteps current={step} />

          {step === 0 ? (
            <>
              {/* ─── Step 1: Store details ─── */}
              <h2 className={heading}>Store details</h2>

              <div className="flex flex-col gap-1.25">
                <label htmlFor="storeName" className={fieldLabel}>
                  Store name
                </label>
                <input
                  id="storeName"
                  autoComplete="organization"
                  placeholder="Atelier Noor"
                  value={storeInfo.storeName}
                  onChange={(e) => update("storeName", e.target.value)}
                  aria-invalid={!!errors.storeName}
                  className={`${control} ${errors.storeName ? controlError : ""}`}
                />
                {errors.storeName && (
                  <p className={errorText}>{errors.storeName}</p>
                )}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="flex flex-1 flex-col gap-1.25">
                  <Dropdown
                    id="category"
                    label="Category"
                    placeholder="Select a category"
                    options={categories}
                    value={storeInfo.category}
                    onChange={(value) => update("category", value)}
                  />
                  {errors.category && (
                    <p className={errorText}>{errors.category}</p>
                  )}
                </div>

                <div className="flex flex-1 flex-col gap-1.25">
                  <Dropdown
                    id="city"
                    label="City"
                    placeholder="Select a city"
                    options={cities}
                    value={storeInfo.city}
                    onChange={(value) => update("city", value)}
                  />
                  {errors.city && <p className={errorText}>{errors.city}</p>}
                </div>
              </div>

              <div className="flex flex-col gap-1.25">
                <label htmlFor="phone" className={fieldLabel}>
                  Owner mobile number
                </label>
                <div className="flex gap-1.5" dir="ltr">
                  <span className="flex h-10 w-15.5 shrink-0 items-center justify-center rounded-md border border-divider bg-surface text-sm text-neutral-500 sm:h-9">
                    +966
                  </span>
                  <input
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    placeholder="55 004 1188"
                    value={storeInfo.phoneNumber}
                    onChange={(e) => update("phoneNumber", e.target.value)}
                    aria-invalid={!!errors.phoneNumber}
                    className={`${control} ${errors.phoneNumber ? controlError : ""}`}
                  />
                </div>
                {errors.phoneNumber && (
                  <p className={errorText}>{errors.phoneNumber}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.25">
                <label htmlFor="email" className={fieldLabel}>
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="owner@ateliernoor.sa"
                  value={storeInfo.email}
                  onChange={(e) => update("email", e.target.value)}
                  aria-invalid={!!errors.email}
                  className={`${control} ${errors.email ? controlError : ""}`}
                />
                {errors.email && <p className={errorText}>{errors.email}</p>}
              </div>

              <div className="flex flex-col gap-1.25">
                <label htmlFor="password" className={fieldLabel}>
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="At least 6 characters"
                  value={storeInfo.password}
                  onChange={(e) => update("password", e.target.value)}
                  aria-invalid={!!errors.password}
                  className={`${control} ${errors.password ? controlError : ""}`}
                />
                {errors.password && (
                  <p className={errorText}>{errors.password}</p>
                )}
              </div>

              <div className="flex">
                <button
                  type="button"
                  onClick={() => validate() && setStep(1)}
                  className={primaryButton}
                >
                  Continue
                </button>
              </div>
            </>
          ) : (
            <>
              {/* ─── Step 2: COD policy ─── */}
              <h2 className={heading}>COD policy</h2>
              <p className="text-xs leading-normal text-neutral-400">
                Set a rule now, change it any time in settings.
              </p>

              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={autoReject}
                  onChange={(e) => setAutoReject(e.target.checked)}
                  className="peer sr-only"
                />
                <span
                  aria-hidden
                  className={`flex size-4 shrink-0 items-center justify-center rounded-full border-[1.5px] peer-focus-visible:ring-2 peer-focus-visible:ring-accent/30 ${
                    autoReject
                      ? "border-accent bg-accent"
                      : "border-divider bg-surface"
                  }`}
                >
                  {autoReject && (
                    <CheckIcon sx={{ fontSize: 12 }} className="text-surface" />
                  )}
                </span>
                <span className="text-sm text-text">
                  Automatically reject cash on delivery orders from customers
                  with a score below:
                </span>
              </label>

              <div
                className={`flex flex-col gap-2.5 ${autoReject ? "" : "opacity-50"}`}
              >
                <label htmlFor="threshold" className={fieldLabel}>
                  Reject below {threshold}
                </label>
                <input
                  id="threshold"
                  type="range"
                  min={0}
                  max={100}
                  value={threshold}
                  disabled={!autoReject}
                  onChange={(e) => setThreshold(Number(e.target.value))}
                  style={{
                    background: `linear-gradient(to right, var(--color-accent) ${threshold}%, var(--color-neutral-800) ${threshold}%)`,
                  }}
                  className="h-1 w-full cursor-pointer appearance-none rounded-full disabled:cursor-not-allowed
                    [&::-webkit-slider-thumb]:size-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:ring-2 [&::-webkit-slider-thumb]:ring-surface
                    [&::-moz-range-thumb]:size-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-accent"
                />
              </div>

              {signup.error && (
                <p
                  role="alert"
                  className={`flex items-center gap-1.5 ${errorText}`}
                >
                  <ErrorIcon sx={{ fontSize: 16 }} />
                  {signup.error.message}
                </p>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => signup.mutate()}
                  disabled={signup.isPending}
                  className={primaryButton}
                >
                  {signup.isPending ? "Creating..." : "Create account"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    signup.reset();
                    setStep(0);
                  }}
                  className={ghostButton}
                >
                  Back
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
