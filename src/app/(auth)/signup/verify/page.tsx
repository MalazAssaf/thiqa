"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SignupInfo from "@/src/components/auth/SignupInfo";

const CODE_LENGTH = 4;

const heading =
  "font-[family-name:var(--font-outfit)] font-semibold text-[#303030]";
const card =
  "flex w-full flex-col gap-3 rounded-xl bg-white p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.07)] sm:max-w-120 sm:p-6 lg:w-100 lg:max-w-none lg:shrink-0";

export default function VerifyPage() {
  return (
    <main className="min-h-[calc(100dvh-68px)] bg-[#f1f1f1] pb-12 font-(family-name:--font-inter) lg:pb-16">
      <div className="mx-auto flex w-full max-w-360 flex-col gap-8 px-4 py-6 sm:px-6 sm:py-8 lg:flex-row lg:items-center justify-center lg:gap-14 lg:px-15 lg:py-10">
        <SignupInfo />
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

  const shownEmail = searchParams.get("email") || "example@gmail.com";

  return (
    <section className={card}>
      <p className="text-kicker font-medium uppercase leading-[1.3] tracking-[0.6px] text-[#0f6b5f]">
        Step 2 of 2
      </p>
      <h2 className={`${heading} text-h3 leading-[1.2] tracking-[-0.22px]`}>
        Enter the code
      </h2>
      <p className="text-[13px] leading-normal text-neutral-400">
        Sent to{" "}
        <span dir="ltr" className="whitespace-nowrap">
          {shownEmail}
        </span>
      </p>

      <div className="flex flex-col gap-1.25">
        <label htmlFor="otp" className="text-xs leading-[1.3] text-neutral-500">
          {CODE_LENGTH}-digit code
        </label>
        <input
          id="otp"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={CODE_LENGTH}
          autoFocus
          placeholder={"•".repeat(CODE_LENGTH)}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          dir="ltr"
          className={`h-12 w-full rounded-lg border border-[#0f6b5f] bg-white pl-2.5 text-center ${heading} text-xl leading-[1.2] tracking-[10px] placeholder:text-[#c4c4c4] outline-none focus:ring-2 focus:ring-[#0f6b5f]/15`}
        />
      </div>

      <button
        type="button"
        className="flex h-11 w-full items-center justify-center rounded-lg border border-[#0f6b5f] bg-[#0f6b5f] px-3 text-sm font-medium leading-[1.2] text-cream hover:bg-[#0c5a50] sm:h-9"
      >
        Verify and create account
      </button>
      <button
        type="button"
        onClick={() => router.back()}
        className="flex h-11 w-full items-center justify-center rounded-lg px-1 text-sm font-medium leading-[1.2] text-[#0f6b5f] hover:bg-accent-900 sm:h-9"
      >
        Change Email
      </button>
    </section>
  );
}
