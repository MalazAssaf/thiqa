"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import ErrorIcon from "@mui/icons-material/Error";
import SignupInfo from "@/src/components/auth/SignupInfo";
import { api } from "@/src/lib/api";
import { isValidPhone, toLocalPhone } from "@/src/lib/phone";

const heading = "font-display font-semibold text-text";
const fieldLabel = "text-xs leading-[1.3] text-neutral-500";
const control =
  "h-10 w-full min-w-0 rounded-md border border-divider bg-surface px-2.5 text-base text-text placeholder:text-neutral-600 outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 sm:h-9 sm:text-sm";
const controlError =
  "border-critical-text focus:border-critical-text focus:ring-critical-text/15";
const errorText = "text-xs leading-normal text-critical-text";

type Field = "phoneNumber" | "password";

export default function LoginPage() {
  const router = useRouter();
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [loginInfo, setLoginInfo] = useState({
    phoneNumber: "",
    password: "",
  });

  const login = useMutation({
    mutationFn: () =>
      api<{ email: string; emailVerified: boolean }>(
        "/api/auth/customer/login",
        {
          method: "POST",
          body: JSON.stringify({
            phone: toLocalPhone(loginInfo.phoneNumber),
            password: loginInfo.password,
          }),
        },
      ),
    onSuccess: (customer) => {
      if (!customer.emailVerified) {
        router.push(
          `/signup/verify?email=${encodeURIComponent(customer.email)}`,
        );
      } else {
        router.push("/customer/stores");
      }
    },
  });

  function update(field: Field, value: string) {
    setLoginInfo({ ...loginInfo, [field]: value });
    setErrors({ ...errors, [field]: undefined });
    login.reset();
  }

  function validate() {
    const e: Partial<Record<Field, string>> = {};
    if (!isValidPhone(loginInfo.phoneNumber))
      e.phoneNumber = "Enter a valid mobile number.";
    if (!loginInfo.password) e.password = "Enter your password.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) login.mutate();
  }

  return (
    <main className="min-h-[calc(100dvh-78px)] bg-bg font-sans">
      <div className="mx-auto flex w-full max-w-360 flex-col items-center justify-center gap-8 px-4 py-6 sm:px-6 sm:py-8 lg:flex-row lg:gap-14 lg:px-15 lg:py-10">
        <SignupInfo />

        {/* Card */}
        <form
          onSubmit={onSubmit}
          noValidate
          className="flex w-full flex-col gap-3 rounded-lg bg-surface p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.07)] sm:max-w-120 sm:p-6 lg:w-100 lg:max-w-none lg:shrink-0"
        >
          {/* Log in / Sign up */}
          <div className="flex w-full overflow-hidden rounded-md border border-divider bg-surface">
            <span
              aria-current="page"
              className="flex flex-1 items-center justify-center border border-accent bg-accent-900 px-3.5 py-2 text-xs leading-normal text-accent"
            >
              Log in
            </span>
            <Link
              href="/signup"
              className="flex flex-1 items-center justify-center px-3.5 py-2 text-xs leading-normal text-text"
            >
              Sign up
            </Link>
          </div>

          <h2 className={`${heading} text-h3 leading-[1.2] tracking-[-0.22px]`}>
            Welcome back
          </h2>

          <div className="flex flex-col gap-1.25">
            <label htmlFor="phone" className={fieldLabel}>
              Mobile number
            </label>
            <div className="flex gap-1.5" dir="ltr">
              <span className="flex h-10 w-15.5 shrink-0 items-center justify-center rounded-md border border-divider bg-surface text-sm text-neutral-500 sm:h-9">
                +966
              </span>
              <input
                id="phone"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                autoComplete="tel-national"
                placeholder="55 123 4567"
                value={loginInfo.phoneNumber}
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
            <div className="flex items-center justify-between">
              <label htmlFor="password" className={fieldLabel}>
                Password
              </label>
              <Link href="/forgot-password" className="text-xs text-accent">
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={loginInfo.password}
              onChange={(e) => update("password", e.target.value)}
              aria-invalid={!!errors.password}
              className={`${control} ${errors.password ? controlError : ""}`}
            />
            {errors.password && <p className={errorText}>{errors.password}</p>}
          </div>

          {login.error && (
            <p
              role="alert"
              className={`flex items-center gap-1.5 ${errorText}`}
            >
              <ErrorIcon sx={{ fontSize: 16 }} />
              {login.error.message}
            </p>
          )}

          <button
            type="submit"
            disabled={login.isPending}
            className="flex h-11 w-full items-center justify-center rounded-md border border-accent bg-accent px-3 text-sm font-medium leading-[1.2] text-cream hover:bg-accent-300 disabled:opacity-60 sm:h-9"
          >
            {login.isPending ? "Logging in..." : "Log in"}
          </button>
        </form>
      </div>
    </main>
  );
}
