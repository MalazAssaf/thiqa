const factors = [
  {
    sign: "+",
    style: "bg-accent2-800 text-accent2-300",
    title: "Order received on arrival",
    body: "The commitment you made was kept",
  },
  {
    sign: "+",
    style: "bg-accent2-800 text-accent2-300",
    title: "Paid by card up front",
    body: "Counts immediately, the fastest way back up",
  },
  {
    sign: "−",
    style: "bg-tag-risky-bg text-tag-risky-text",
    title: "Delivery delayed by the buyer",
    body: "Rescheduled more than once",
  },
  {
    sign: "−",
    style: "bg-tag-risky-bg text-tag-risky-text",
    title: "Refused at the door",
    body: "The order returns to origin at the store’s cost",
  },
  {
    sign: "±",
    style: "bg-accent-900 text-accent",
    title: "Dispute resolved in your favour",
    body: "The outcome is reversed and the score corrected",
  },
];

const tiers = [
  { name: "Risky", bar: "bg-tag-risky-bg" },
  { name: "Low", bar: "bg-tag-low-bg" },
  { name: "Moderate", bar: "bg-accent-700" },
  { name: "High", bar: "bg-accent2-500" },
];

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
function TheScore() {
  return (
    <div id="score" className="scroll-mt-8 bg-surface">
      <div className={`container-page flex flex-col gap-12 pb-12`}>
        <Heading
          eyebrow="THE SCORE"
          title="One number, earned by delivery"
          subtitle="It moves on what actually happened to your orders, and nothing else."
        />
        <div className="grid grid-cols-1 overflow-hidden rounded-lg border border-divider lg:grid-cols-[520px_1fr]">
          <div className="flex flex-col justify-evenly gap-8 bg-section-base p-8 lg:p-10">
            <div className="flex flex-col gap-6">
              <span className="text-kicker font-medium tracking-[0.16em] text-accent2-500">
                YOUR COMMITMENT SCORE
              </span>
              <p className="flex items-baseline gap-2">
                <span className="font-display text-score leading-none text-accent-900 lg:text-[96px]">
                  92
                </span>
                <span className="font-display text-h3 text-accent-700">
                  / 100
                </span>
              </p>
              <span className="w-fit rounded-full bg-accent2-500 px-3 py-1.5 text-xs font-semibold text-section-base">
                High commitment
              </span>
            </div>
            <div className="flex flex-col gap-2.5">
              <div className="grid grid-cols-4 gap-1">
                {tiers.map((t) => (
                  <span
                    key={t.name}
                    className={`h-2 rounded-full ${t.bar} ${t.name === "High" ? "" : "opacity-75"}`}
                  />
                ))}
              </div>
              <div className="grid grid-cols-4 gap-1">
                {tiers.map((t) => (
                  <span
                    key={t.name}
                    className={`text-2xs ${t.name === "High" ? "font-semibold text-accent-900" : "text-accent-700"}`}
                  >
                    {t.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <ul className="flex flex-col justify-between bg-surface px-6 py-2 lg:px-10">
            {factors.map((f) => (
              <li
                key={f.title}
                className="flex items-center gap-4 border-b border-divider py-5 last:border-b-0"
              >
                <span
                  className={`flex size-9 shrink-0 items-center justify-center rounded-full text-h5 font-semibold ${f.style}`}
                >
                  {f.sign}
                </span>
                <div className="flex flex-col gap-1">
                  <span className="text-body font-medium text-text">
                    {f.title}
                  </span>
                  <span className="text-xs text-neutral-500">{f.body}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default TheScore;
