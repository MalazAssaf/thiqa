"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import StoreSignupInfo from "@/src/components/auth/StoreSignUpInfo";
import Dropdown from "@/src/components/ui/dropdown";
import { cities } from "@/src/data/cities";

const fieldLabel = "text-2xs leading-[1.3] text-neutral-500";
const control =
  "h-10 w-full min-w-0 rounded-md border border-divider bg-surface px-2.5 text-base text-text placeholder:text-neutral-600 outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 sm:h-9 sm:text-sm";

const steps = ["Store details", "Verify owner", "COD policy"];
export const categories = [
  { value: "clothing", label: "Clothing" },
  { value: "perfumes", label: "Perfumes & Oud" },
  { value: "beauty", label: "Beauty & Skincare" },
  { value: "electronics", label: "Electronics" },
  { value: "home", label: "Home & Kitchen" },
  { value: "sweets", label: "Sweets & Dates" },
  { value: "coffee", label: "Coffee & Tea" },
  { value: "gifts", label: "Gifts & Flowers" },
];

export default function StoreSignupPage() {
  const router = useRouter();
  const [storeInfo, setStoreInfo] = useState({
    storeName: "",
    category: "",
    city: "",
    phoneNumber: "",
    email: "",
    password: "",
  });

  function goToVerify() {
    router.push(
      `/store/signup/verify?email=${encodeURIComponent(storeInfo.email)}`,
    );
  }

  return (
    <main className="min-h-[calc(100dvh-68px)] bg-bg pb-12 lg:pb-16">
      <div className="mx-auto flex w-full max-w-360 flex-col gap-8 px-4 py-6 sm:px-6 sm:py-8 lg:flex-row items-center justify-center lg:gap-14 lg:px-15 lg:py-10">
        <StoreSignupInfo />

        {/* Card */}
        <section className="flex w-full flex-col gap-3 rounded-lg bg-surface p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.07)] sm:max-w-120 sm:p-6 lg:w-100 lg:max-w-none lg:shrink-0">
          {/* Log in / Create a store account */}
          <div className="flex w-full overflow-hidden rounded-md border border-divider bg-surface">
            <Link
              href="/store/login"
              className="flex flex-1 items-center justify-center px-3.5 py-2 text-[13px] text-text"
            >
              Log in
            </Link>
            <span
              aria-current="page"
              className="flex flex-1 items-center justify-center border border-accent bg-accent-900 px-3.5 py-2 text-[13px] text-accent"
            >
              Create a store account
            </span>
          </div>

          {/* Progress */}
          <div className="flex gap-2 pt-1">
            {steps.map((step, i) => (
              <div key={step} className="flex flex-1 flex-col gap-1.5">
                <div
                  className={`h-0.75 rounded-full ${i === 0 ? "bg-accent" : "bg-neutral-800"}`}
                />
                <span
                  className={`text-3xs ${i === 0 ? "text-accent" : "text-neutral-600"}`}
                >
                  {step}
                </span>
              </div>
            ))}
          </div>

          <h2 className="text-h3 font-semibold leading-[1.2] tracking-[-0.22px] text-text">
            Store details
          </h2>

          <div className="flex flex-col gap-1.25">
            <label htmlFor="storeName" className={fieldLabel}>
              Store name
            </label>
            <input
              id="storeName"
              placeholder="Atelier Noor"
              value={storeInfo.storeName}
              onChange={(e) =>
                setStoreInfo({ ...storeInfo, storeName: e.target.value })
              }
              className={control}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex flex-1 flex-col gap-1.25">
              <div className="flex-1">
                <Dropdown
                  id="category"
                  label="Category"
                  placeholder="Select a category"
                  options={categories}
                  value={storeInfo.category}
                  onChange={(value) =>
                    setStoreInfo({ ...storeInfo, category: value })
                  }
                />
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-1.25">
              <div className="flex-1">
                <Dropdown
                  id="city"
                  label="City"
                  placeholder="Select a City"
                  options={cities}
                  value={storeInfo.city}
                  onChange={(value) =>
                    setStoreInfo({ ...storeInfo, city: value })
                  }
                />
              </div>
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
                placeholder="55 004 1188"
                value={storeInfo.phoneNumber}
                onChange={(e) =>
                  setStoreInfo({ ...storeInfo, phoneNumber: e.target.value })
                }
                className={control}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.25">
            <label htmlFor="email" className={fieldLabel}>
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="owner@ateliernoor.sa"
              value={storeInfo.email}
              onChange={(e) =>
                setStoreInfo({ ...storeInfo, email: e.target.value })
              }
              className={control}
            />
          </div>

          <div className="flex flex-col gap-1.25">
            <label htmlFor="password" className={fieldLabel}>
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="At least 8 characters"
              value={storeInfo.password}
              onChange={(e) =>
                setStoreInfo({ ...storeInfo, password: e.target.value })
              }
              className={control}
            />
          </div>

          <button
            type="button"
            onClick={goToVerify}
            className="flex h-11 w-full items-center justify-center rounded-md bg-accent px-3 text-sm font-medium text-cream hover:bg-accent-300 sm:h-9"
          >
            Continue
          </button>
        </section>
      </div>
    </main>
  );
}
