"use client";

import { useState } from "react";
import Link from "next/link";
import SignupInfo from "@/src/components/auth/SignupInfo";

const heading =
  "font-[family-name:var(--font-outfit)] font-semibold text-[#303030]";
const fieldLabel = "text-xs leading-[1.3] text-[#616161]";
const control =
  "h-10 w-full min-w-0 rounded-lg border border-[#e3e3e3] bg-white px-2.5 text-base text-[#303030] placeholder:text-[#757575] outline-none focus:border-[#0f6b5f] focus:ring-2 focus:ring-[#0f6b5f]/15 sm:h-9 sm:text-sm";

export default function LoginPage() {
  const [loginInfo, setLoginInfo] = useState({
    phoneNumber: "",
    password: "",
  });

  return (
    <main className="min-h-[calc(100dvh-78px)] bg-[#f1f1f1] font-(family-name:--font-inter)">
      <div className="mx-auto flex w-full max-w-360 flex-col gap-8 px-4 py-6 sm:px-6 sm:py-8 lg:flex-row items-center justify-center lg:gap-14 lg:px-15 lg:py-10">
        <SignupInfo />

        {/* Card */}
        <section className="flex w-full flex-col gap-3 rounded-xl bg-white p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.07)] sm:max-w-120 sm:p-6 lg:w-100 lg:max-w-none lg:shrink-0">
          {/* Log in / Sign up */}
          <div className="flex w-full overflow-hidden rounded-lg border border-[#e3e3e3] bg-white">
            <span
              aria-current="page"
              className="flex flex-1 items-center justify-center border border-[#0f6b5f] bg-accent-900 px-3.5 py-2 text-[13px] leading-normal text-[#0f6b5f]"
            >
              Log in
            </span>
            <Link
              href="/signup"
              className="flex flex-1 items-center justify-center px-3.5 py-2 text-[13px] leading-normal text-[#303030]"
            >
              Sign up
            </Link>
          </div>

          <h2 className={`${heading} text-h3 leading-[1.2] tracking-[-0.22px]`}>
            Welcome back
          </h2>
          <p className="max-w-85 text-xs leading-[1.45] text-neutral-500">
            Log in with the phone number linked to your account.
          </p>

          <div className="flex flex-col gap-1.25">
            <label htmlFor="phone" className={fieldLabel}>
              Mobile number
            </label>
            <div className="flex gap-1.5" dir="ltr">
              <span className="flex h-10 w-15.5 shrink-0 items-center justify-center rounded-lg border border-[#e3e3e3] bg-white text-sm text-neutral-500 sm:h-9">
                +966
              </span>
              <input
                id="phone"
                type="tel"
                placeholder="55 123 4567"
                value={loginInfo.phoneNumber}
                onChange={(e) =>
                  setLoginInfo({ ...loginInfo, phoneNumber: e.target.value })
                }
                className={control}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.25">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className={fieldLabel}>
                Password
              </label>
              <Link href="/forgot-password" className="text-xs text-[#0f6b5f]">
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
            className="flex h-11 w-full items-center justify-center rounded-lg border border-[#0f6b5f] bg-[#0f6b5f] px-3 text-sm font-medium leading-[1.2] text-cream hover:bg-[#0c5a50] sm:h-9"
          >
            Log in
          </button>
        </section>
      </div>
    </main>
  );
}
