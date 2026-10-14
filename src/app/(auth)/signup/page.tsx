"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import CheckIcon from "@mui/icons-material/Check";
import ErrorIcon from "@mui/icons-material/Error";
import SignupInfo from "@/src/components/auth/SignupInfo";
import Dropdown from "@/src/components/ui/Dropdown";
import { cities } from "@/src/data/cities";
import { api } from "@/src/lib/api";

const heading =
  "font-[family-name:var(--font-outfit)] font-semibold text-[#303030]";
const fieldLabel = "text-xs leading-[1.3] text-[#616161]";
const control =
  "h-10 w-full min-w-0 rounded-lg border border-[#e3e3e3] bg-white px-2.5 text-base text-[#303030] placeholder:text-[#757575] outline-none focus:border-[#0f6b5f] focus:ring-2 focus:ring-[#0f6b5f]/15 sm:h-9 sm:text-sm";
const controlError =
  "border-critical-text focus:border-critical-text focus:ring-critical-text/15";
const errorText = "text-xs leading-normal text-critical-text";

type Field = "fullName" | "password" | "city" | "email" | "phoneNumber";

// "55 123 4567" -> "0551234567"
function toLocalPhone(input: string) {
  return "0" + input.replace(/\D/g, "").replace(/^0/, "");
}

export default function CustomerSignupPage() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(true);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [signUpInfo, setSignUpInfo] = useState({
    fullName: "",
    password: "",
    city: "",
    email: "",
    phoneNumber: "",
  });

  const signup = useMutation({
    mutationFn: () =>
      api("/api/auth/customer/signup", {
        method: "POST",
        body: JSON.stringify({
          fullName: signUpInfo.fullName.trim(),
          email: signUpInfo.email.trim(),
          phone: toLocalPhone(signUpInfo.phoneNumber),
          city: signUpInfo.city,
          password: signUpInfo.password,
        }),
      }),
    onSuccess: () =>
      router.push(
        `/signup/verify?email=${encodeURIComponent(signUpInfo.email.trim())}`,
      ),
  });

  function update(field: Field, value: string) {
    setSignUpInfo({ ...signUpInfo, [field]: value });
    setErrors({ ...errors, [field]: undefined });
    signup.reset();
  }

  function validate() {
    const e: Partial<Record<Field, string>> = {};
    if (signUpInfo.fullName.trim().length < 3)
      e.fullName = "Enter your full name.";
    if (signUpInfo.password.length < 6)
      e.password = "Password must be at least 6 characters.";
    if (!signUpInfo.city) e.city = "Select your city.";
    if (!/^\S+@\S+\.\S+$/.test(signUpInfo.email.trim()))
      e.email = "Enter a valid email.";
    if (!/^05\d{8}$/.test(toLocalPhone(signUpInfo.phoneNumber)))
      e.phoneNumber = "Enter a valid mobile number.";
    setErrors(e);
    return Object.keys(e).length === 0;
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
              onChange={(e) => update("fullName", e.target.value)}
              aria-invalid={!!errors.fullName}
              className={`${control} ${errors.fullName ? controlError : ""}`}
            />
            {errors.fullName && <p className={errorText}>{errors.fullName}</p>}
          </div>

          <div className="flex flex-col gap-1.25">
            <label htmlFor="password" className={fieldLabel}>
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="At least 6 characters"
              value={signUpInfo.password}
              onChange={(e) => update("password", e.target.value)}
              aria-invalid={!!errors.password}
              className={`${control} ${errors.password ? controlError : ""}`}
            />
            {errors.password && <p className={errorText}>{errors.password}</p>}
          </div>

          <div className="flex flex-col gap-1.25">
            <Dropdown
              id="city"
              label="City"
              placeholder="Select a city"
              options={cities}
              value={signUpInfo.city}
              onChange={(value) => update("city", value)}
            />
            {errors.city && <p className={errorText}>{errors.city}</p>}
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
              onChange={(e) => update("email", e.target.value)}
              aria-invalid={!!errors.email}
              className={`${control} ${errors.email ? controlError : ""}`}
            />
            {errors.email && <p className={errorText}>{errors.email}</p>}
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
                inputMode="numeric"
                placeholder="55 123 4567"
                value={signUpInfo.phoneNumber}
                onChange={(e) => update("phoneNumber", e.target.value)}
                aria-invalid={!!errors.phoneNumber}
                className={`${control} ${errors.phoneNumber ? controlError : ""}`}
              />
            </div>
            {errors.phoneNumber && (
              <p className={errorText}>{errors.phoneNumber}</p>
            )}
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

          {signup.error && (
            <p
              role="alert"
              className={`flex items-center gap-1.5 ${errorText}`}
            >
              <ErrorIcon sx={{ fontSize: 16 }} />
              {signup.error.message}
            </p>
          )}

          <button
            type="button"
            onClick={() => validate() && signup.mutate()}
            disabled={!agreed || signup.isPending}
            className="flex h-11 w-full items-center justify-center rounded-lg border border-[#0f6b5f] bg-[#0f6b5f] px-3 text-sm font-medium leading-[1.2] text-cream hover:bg-[#0c5a50] disabled:opacity-60 sm:h-9"
          >
            {signup.isPending ? "Sending code..." : "Send verification code"}
          </button>

          <p className="text-3xs leading-[1.4] text-neutral-600 sm:max-w-85">
            We&apos;ll email you a 4-digit code to verify your email.
          </p>
        </section>
      </div>
    </main>
  );
}
