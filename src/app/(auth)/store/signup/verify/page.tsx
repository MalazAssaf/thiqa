"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import StoreSignupInfo from "@/src/components/auth/StoreSignUpInfo";

const steps = ["Store details", "Verify owner", "COD policy"];
const currentStep = 1;

const card =
  "flex w-full flex-col gap-3 rounded-lg bg-surface p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.07)] sm:max-w-120 sm:p-6 lg:w-100 lg:max-w-none lg:shrink-0";

export default function StoreVerifyPage() {
  return (
    <main className="min-h-[calc(100dvh-68px)] bg-bg pb-12 lg:pb-16">
      <div className="mx-auto flex w-full max-w-360 flex-col gap-8 px-4 py-6 sm:px-6 sm:py-8 lg:flex-row items-center justify-center lg:gap-14 lg:px-15 lg:py-10">
        <StoreSignupInfo />
        {/* useSearchParams needs a Suspense boundary in Next.js */}
        <Suspense fallback={<section className={card} />}>
          <VerifyCard />
        </Suspense>
      </div>
    </main>
  );
}

function VerifyCard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [code, setCode] = useState("");

  const email = searchParams.get("email") || "owner@ateliernoor.sa";

  return (
    <section className={card}>
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
              className={`h-0.75 rounded-full ${i <= currentStep ? "bg-accent" : "bg-neutral-800"}`}
            />
            <span
              className={`text-3xs ${i <= currentStep ? "text-accent" : "text-neutral-600"}`}
            >
              {step}
            </span>
          </div>
        ))}
      </div>

      <h2 className="text-h3 font-semibold leading-[1.2] tracking-[-0.22px] text-text">
        Verify the owner
      </h2>
      <p className="text-xs leading-[1.45] text-neutral-500">
        We sent a 4-digit code to{" "}
        <span className="font-medium text-text">{email}</span>. Check your inbox
        and spam folder.
      </p>

      <div className="flex flex-col gap-1.25">
        <label
          htmlFor="otp"
          className="text-2xs leading-[1.3] text-neutral-500"
        >
          4-digit code
        </label>
        <input
          id="otp"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={4}
          autoFocus
          placeholder="••••"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          dir="ltr"
          className="h-12 w-full rounded-md border border-accent bg-surface pl-2.5 text-center font-display text-xl font-semibold tracking-[10px] text-text placeholder:text-neutral-700 outline-none focus:ring-2 focus:ring-accent/15"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => router.push("/store/signup/policy")}
          className="flex h-11 flex-1 items-center justify-center rounded-md bg-accent px-3 text-sm font-medium text-cream hover:bg-accent-300 sm:h-9"
        >
          Verify
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="flex h-11 flex-1 items-center justify-center rounded-md text-sm font-medium text-accent hover:bg-accent-900 sm:h-9"
        >
          Back
        </button>
      </div>
    </section>
  );
}
