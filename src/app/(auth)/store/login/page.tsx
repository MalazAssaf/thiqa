"use client";

import { useState } from "react";
import Link from "next/link";
import StoreSignupInfo from "@/src/components/auth/StoreSignUpInfo";

const fieldLabel = "text-2xs leading-[1.3] text-neutral-500";
const control =
  "h-10 w-full min-w-0 rounded-md border border-divider bg-surface px-2.5 text-base text-text placeholder:text-neutral-600 outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 sm:h-9 sm:text-sm";

export default function StoreLoginPage() {
  const [loginInfo, setLoginInfo] = useState({ email: "", password: "" });

  return (
    <main className="min-h-[calc(100dvh-68px)] bg-bg pb-12 lg:pb-16">
      <div className="mx-auto flex w-full max-w-360 flex-col gap-8 px-4 py-6 sm:px-6 sm:py-8 lg:flex-row items-center justify-center lg:gap-14 lg:px-15 lg:py-10">
        <StoreSignupInfo />

        {/* Card */}
        <section className="flex w-full flex-col gap-3 rounded-lg bg-surface p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.07)] sm:max-w-120 sm:p-6 lg:w-100 lg:max-w-none lg:shrink-0">
          {/* Log in / Create a store account */}
          <div className="flex w-full overflow-hidden rounded-md border border-divider bg-surface">
            <span
              aria-current="page"
              className="flex flex-1 items-center justify-center border border-accent bg-accent-900 px-3.5 py-2 text-[13px] text-accent"
            >
              Log in
            </span>
            <Link
              href="/store/signup"
              className="flex flex-1 items-center justify-center px-3.5 py-2 text-[13px] text-text"
            >
              Create a store account
            </Link>
          </div>

          <h2 className="text-h3 font-semibold leading-[1.2] tracking-[-0.22px] text-text">
            Merchant log in
          </h2>

          <div className="flex flex-col gap-1.25">
            <label htmlFor="email" className={fieldLabel}>
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="owner@gmail.com"
              value={loginInfo.email}
              onChange={(e) =>
                setLoginInfo({ ...loginInfo, email: e.target.value })
              }
              className={control}
            />
          </div>

          <div className="flex flex-col gap-1.25">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className={fieldLabel}>
                Password
              </label>
              <Link
                href="/store/forgot-password"
                className="text-xs text-[#0f6b5f]"
              >
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={loginInfo.password}
              onChange={(e) =>
                setLoginInfo({ ...loginInfo, password: e.target.value })
              }
              className={control}
            />
          </div>

          <button
            type="button"
            className="flex h-11 w-full items-center justify-center rounded-md bg-accent px-3 text-sm font-medium text-cream hover:bg-accent-300 sm:h-9"
          >
            Log in
          </button>

          <Link
            href="/store/signup"
            className="flex h-9 items-center justify-center text-sm font-medium text-accent"
          >
            No account yet? Create one
          </Link>
        </section>
      </div>
    </main>
  );
}
