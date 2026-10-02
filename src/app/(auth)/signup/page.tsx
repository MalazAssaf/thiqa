"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CheckIcon from "@mui/icons-material/Check";
import SignupInfo from "@/src/components/auth/SignupInfo";

const heading =
  "font-[family-name:var(--font-outfit)] font-semibold text-[#303030]";
const fieldLabel = "text-xs leading-[1.3] text-[#616161]";
const control =
  "h-10 w-full min-w-0 rounded-lg border border-[#e3e3e3] bg-white px-2.5 text-base text-[#303030] placeholder:text-[#757575] outline-none focus:border-[#0f6b5f] focus:ring-2 focus:ring-[#0f6b5f]/15 sm:h-9 sm:text-sm";

export default function CustomerSignupPage() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(true);
  const [signUpInfo, setSignUpInfo] = useState({
    fullName: "",
    password: "",
    city: "",
    email: "",
    phoneNumber: "",
  });

  function goToVerify() {
    router.push(`/signup/verify?phone=${signUpInfo.phoneNumber}`);
  }

  return (
    <main className="min-h-[calc(100dvh-68px)] bg-[#f1f1f1] font-(family-name:--font-inter)">
      <div className="mx-auto flex w-full max-w-360 flex-col gap-8 px-4 py-6 sm:px-6 sm:py-8 lg:flex-row items-center justify-center lg:gap-14 lg:px-15 lg:py-10">
        <SignupInfo />

        {/* Card */}
        <section className="flex w-full flex-col gap-3 rounded-xl bg-white p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.07)] sm:max-w-120 sm:p-6 lg:w-100 lg:max-w-none lg:shrink-0">
          {/* Log in / Sign up */}
          <div className="flex w-full overflow-hidden rounded-lg border border-[#e3e3e3] bg-white">
            <Link
              href="/login"
              className="flex flex-1 items-center justify-center px-3.5 py-2 text-[13px] leading-normal text-[#303030]"
            >
              Log in
            </Link>
            <span
              aria-current="page"
              className="flex flex-1 items-center justify-center border border-[#0f6b5f] bg-accent-900 px-3.5 py-2 text-[13px] leading-normal text-[#0f6b5f]"
            >
              Sign up
            </span>
          </div>

          <h2 className={`${heading} text-h3 leading-[1.2] tracking-[-0.22px]`}>
            Create your account
          </h2>

          <div className="flex flex-col gap-1.25">
            <label htmlFor="fullName" className={fieldLabel}>
              Full name
            </label>
            <input
              id="fullName"
              placeholder="Maha Alharbi"
              value={signUpInfo.fullName}
              onChange={(e) =>
                setSignUpInfo({ ...signUpInfo, fullName: e.target.value })
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
              value={signUpInfo.password}
              onChange={(e) =>
                setSignUpInfo({ ...signUpInfo, password: e.target.value })
              }
              className={control}
            />
          </div>

          <div className="flex flex-col gap-1.25">
            <label htmlFor="city" className={fieldLabel}>
              City
            </label>
            <input
              id="city"
              placeholder="Riyadh"
              value={signUpInfo.city}
              onChange={(e) =>
                setSignUpInfo({ ...signUpInfo, city: e.target.value })
              }
              className={control}
            />
          </div>

          <div className="flex flex-col gap-1.25">
            <label htmlFor="email" className={fieldLabel}>
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="example@gmail.com"
              value={signUpInfo.email}
              onChange={(e) =>
                setSignUpInfo({ ...signUpInfo, email: e.target.value })
              }
              className={control}
            />
          </div>

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
                value={signUpInfo.phoneNumber}
                onChange={(e) =>
                  setSignUpInfo({ ...signUpInfo, phoneNumber: e.target.value })
                }
                className={control}
              />
            </div>
          </div>

          <label className="flex cursor-pointer items-start gap-2">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="peer sr-only"
            />
            <span
              aria-hidden
              className={`mt-px flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${
                agreed
                  ? "border-[#0f6b5f] bg-[#0f6b5f]"
                  : "border-[#e3e3e3] bg-white"
              }`}
            >
              {agreed && <CheckIcon sx={{ fontSize: 18, color: "white" }} />}
            </span>
            <span className="text-xs leading-[1.45] text-neutral-500 sm:max-w-75">
              I understand my delivery outcomes build a commitment score that
              stores can see.
            </span>
          </label>

          <button
            type="button"
            onClick={goToVerify}
            className="flex h-11 w-full items-center justify-center rounded-lg border border-[#0f6b5f] bg-[#0f6b5f] px-3 text-sm font-medium leading-[1.2] text-cream hover:bg-[#0c5a50] sm:h-9"
          >
            Send verification code
          </button>

          <p className="text-3xs leading-[1.4] text-neutral-600 sm:max-w-85">
            We&apos;ll text you a 4-digit code to verify your Email.
          </p>
        </section>
      </div>
    </main>
  );
}
