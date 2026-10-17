import Link from "next/link";

const steps = ["Store details", "COD policy", "Verify owner"];

export default function StoreSignupSteps({ current }: { current: number }) {
  return (
    <>
      {/* Log in / Create a store account */}
      <div className="flex w-full overflow-hidden rounded-md border border-divider bg-surface">
        <Link
          href="/store/login"
          className="flex flex-1 items-center justify-center px-3.5 py-2 text-xs text-text"
        >
          Log in
        </Link>
        <span
          aria-current="page"
          className="flex flex-1 items-center justify-center border border-accent bg-accent-900 px-3.5 py-2 text-xs text-accent"
        >
          Create a store account
        </span>
      </div>

      {/* Progress */}
      <div className="flex gap-2 pt-1">
        {steps.map((step, i) => (
          <div key={step} className="flex flex-1 flex-col gap-1.5">
            <div
              className={`h-0.75 rounded-full ${i <= current ? "bg-accent" : "bg-neutral-800"}`}
            />
            <span
              className={`text-3xs ${i <= current ? "text-accent" : "text-neutral-600"}`}
            >
              {step}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
