"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import ErrorIcon from "@mui/icons-material/Error";
import StoreSignupInfo from "@/src/components/auth/StoreSignUpInfo";
import StoreSignupSteps from "@/src/components/auth/StoreSignupSteps";
import Snackbar from "@/src/components/ui/Snackbar";
import { api } from "@/src/lib/api";

const CODE_LENGTH = 4;

const card =
  "flex w-full flex-col gap-3 rounded-lg bg-surface p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.07)] sm:max-w-120 sm:p-6 lg:w-100 lg:max-w-none lg:shrink-0";

export default function StoreVerifyPage() {
  return (
    <main className="min-h-[calc(100dvh-68px)] bg-bg pb-12 lg:pb-16">
      <div className="mx-auto flex w-full max-w-360 flex-col items-center justify-center gap-8 px-4 py-6 sm:px-6 sm:py-8 lg:flex-row lg:gap-14 lg:px-15 lg:py-10">
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

  // Always provided: by signup, or by store login when the account isn't verified yet.
  const email = searchParams.get("email") ?? "";

  const verify = useMutation({
    mutationFn: () =>
      api(`/api/auth/verify?email=${encodeURIComponent(email)}&code=${code}`, {
        method: "POST",
      }),
    onSuccess: () => router.push("/store/login"),
  });

  const resend = useMutation({
    mutationFn: () =>
      api(`/api/auth/resend-code?email=${encodeURIComponent(email)}`, {
        method: "POST",
      }),
  });

  const error = verify.error ?? resend.error;

  return (
    <section className={card}>
      <StoreSignupSteps current={2} />

      <h2 className="font-display text-h3 font-semibold leading-[1.2] tracking-[-0.22px] text-text">
        Verify the owner
      </h2>
      <p className="text-xs leading-[1.45] text-neutral-500">
        We sent a 4-digit code to{" "}
        <span dir="ltr" className="font-medium text-text">
          {email}
        </span>
        . Check your inbox and spam folder.
      </p>

      <div className="flex flex-col gap-1.25">
        <label
          htmlFor="otp"
          className="text-2xs leading-[1.3] text-neutral-500"
        >
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
          onChange={(e) => {
            setCode(e.target.value.replace(/\D/g, ""));
            verify.reset();
          }}
          aria-invalid={!!verify.error}
          dir="ltr"
          className={`h-12 w-full rounded-md border bg-surface pl-2.5 text-center font-display text-xl font-semibold tracking-[10px] text-text placeholder:text-neutral-700 outline-none focus:ring-2 ${
            verify.error
              ? "border-critical-text focus:ring-critical-text/15"
              : "border-accent focus:ring-accent/15"
          }`}
        />
        {error && (
          <p
            role="alert"
            className="flex items-center gap-1.5 text-xs leading-normal text-critical-text"
          >
            <ErrorIcon sx={{ fontSize: 16 }} />
            {error.message}
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => verify.mutate()}
          disabled={code.length !== CODE_LENGTH || verify.isPending}
          className="flex h-11 flex-1 items-center justify-center rounded-md bg-accent px-3 text-sm font-medium text-cream hover:bg-accent-300 disabled:opacity-60 sm:h-9"
        >
          {verify.isPending ? "Verifying..." : "Verify"}
        </button>
        <button
          type="button"
          onClick={() => {
            setCode("");
            verify.reset();
            resend.mutate();
          }}
          disabled={resend.isPending}
          className="flex h-11 flex-1 items-center justify-center rounded-md text-sm font-medium text-accent hover:bg-accent-900 disabled:opacity-60 sm:h-9"
        >
          {resend.isPending ? "Sending..." : "Resend code"}
        </button>
      </div>

      {resend.isSuccess && (
        <Snackbar
          type="success"
          message="A new code was sent to your email."
          onClose={resend.reset}
        />
      )}
    </section>
  );
}
