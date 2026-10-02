import CheckRounded from "@mui/icons-material/CheckRounded";
import Button from "../ui/button";

const customerBenefits = [
  {
    title: "Cash on delivery at every store",
    body: "Every store on Thiqa accepts it, so you pay when the parcel arrives.",
  },
  {
    title: "Card or cash, your call",
    body: "Both sit side by side at checkout. Your score only ever affects the cash option.",
  },
  {
    title: "See your score and what moved it",
    body: "Think an outcome is wrong? Challenge it, and a resolved dispute corrects your score.",
  },
  {
    title: "Private by design",
    body: "Stores see a score and a category. Never your name, address history or orders from other stores.",
  },
];

const storeBenefits = [
  {
    title: "A score on every cash order",
    body: "Each order arrives with a 0–100 score and a clear category, from High to Risky.",
  },
  {
    title: "Set your own threshold",
    body: "Decide where you stop accepting cash. Card orders are always confirmed.",
  },
  {
    title: "Know what to do next",
    body: "Ship as usual, call to confirm, ask for a deposit, or offer card instead.",
  },
  {
    title: "See what you recover",
    body: "Return-to-origin rates by category and city, and the revenue saved by screening cash orders.",
  },
];

function Check({ dark }: { dark?: boolean }) {
  return (
    <span
      className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full ${
        dark ? "bg-accent2-500 text-section-base" : "bg-accent-900 text-accent"
      }`}
    >
      <CheckRounded sx={{ fontSize: 14 }} />
    </span>
  );
}

function SideCard({
  id,
  dark,
  eyebrow,
  title,
  summary,
  benefits,
  cta,
  href,
}: {
  id: string;
  dark?: boolean;
  eyebrow: string;
  title: string;
  summary: string;
  benefits: { title: string; body: string }[];
  cta: string;
  href: string;
}) {
  return (
    <article
      id={id}
      className={`flex scroll-mt-8 flex-col gap-7 rounded-lg p-8 lg:p-10 ${
        dark ? "bg-section-base" : "border border-divider bg-surface"
      }`}
    >
      <div className="flex flex-col gap-3">
        <span
          className={`text-kicker font-medium tracking-[0.16em] ${
            dark ? "text-accent2-500" : "text-accent"
          }`}
        >
          {eyebrow}
        </span>
        <h3
          className={`font-display text-h3 ${dark ? "text-accent-900" : "text-text"}`}
        >
          {title}
        </h3>
        <p
          className={`text-sm ${dark ? "text-accent-700" : "text-neutral-500"}`}
        >
          {summary}
        </p>
      </div>

      <hr className={dark ? "border-section-glow" : "border-divider"} />

      <ul className="flex flex-col gap-5">
        {benefits.map((b) => (
          <li key={b.title} className="flex gap-3">
            <Check dark={dark} />
            <div className="flex flex-col gap-1">
              <span
                className={`text-body font-medium ${
                  dark ? "text-accent-900" : "text-text"
                }`}
              >
                {b.title}
              </span>
              <span
                className={`text-xs ${dark ? "text-accent-700" : "text-neutral-500"}`}
              >
                {b.body}
              </span>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-auto">
        <Button href={href} variant={dark ? "brand" : "onLight"} size="md">
          {cta}
        </Button>
      </div>
    </article>
  );
}

function Heading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 text-center">
      <span className="text-kicker font-medium tracking-[0.16em] text-accent">
        {eyebrow}
      </span>
      <h2 className="font-display text-h2 text-text lg:text-h1">{title}</h2>
      <p className="text-lead text-neutral-500">{subtitle}</p>
    </div>
  );
}

function ThiqaValues() {
  return (
    <div className="bg-bg">
      <div className="container-page flex flex-col gap-12 py-24">
        <Heading
          eyebrow="WHAT YOU GET"
          title="What Thiqa gives each side"
          subtitle="Customers keep paying the way they prefer. Stores stop guessing."
        />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <SideCard
            id="customers"
            eyebrow="FOR CUSTOMERS"
            title="Keep paying the way you trust"
            summary="Shop at any store and choose how you pay, without giving up your privacy."
            benefits={customerBenefits}
            cta="Start shopping"
            href="#"
          />
          <SideCard
            id="stores"
            dark
            eyebrow="FOR STORES"
            title="Ship cash orders with your eyes open"
            summary="Accept cash on delivery without the guesswork."
            benefits={storeBenefits}
            cta="Sell on Thiqa"
            href="#"
          />
        </div>
      </div>
    </div>
  );
}

export default ThiqaValues;
