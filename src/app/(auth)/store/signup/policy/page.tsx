"use client";

import { useState } from "react";
import Link from "next/link";
import CheckIcon from "@mui/icons-material/Check";
import StoreSignupInfo from "@/src/components/auth/StoreSignUpInfo";

const steps = ["Store details", "Verify owner", "COD policy"];
const currentStep = 2;

export default function StorePolicyPage() {
  const [autoReject, setAutoReject] = useState(false);
  const [threshold, setThreshold] = useState(40);

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
            COD policy
          </h2>
          <p className="text-xs leading-normal text-neutral-400">
            Set a rule now, change it any time in settings.
          </p>

          {/* Checkbox */}
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
                <CheckIcon sx={{ fontSize: 12, color: "white" }} />
              )}
            </span>
            <span className="text-sm text-text">
              Automatically reject cash on delivery orders from customers with a
              score below:
            </span>
          </label>

          {/* Slider */}
          <div
            className={`flex flex-col gap-2.5 ${autoReject ? "" : "opacity-50"}`}
          >
            <label
              htmlFor="threshold"
              className="text-2xs leading-[1.3] text-neutral-500"
            >
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

          <Link
            href="/store"
            className="flex h-11 w-full items-center justify-center rounded-md bg-accent px-3 text-sm font-medium text-cream hover:bg-accent-300 sm:h-9"
          >
            Open my dashboard
          </Link>
        </section>
      </div>
    </main>
  );
}
