import Button from "../ui/button";

const stats = [
  { value: "31%", label: "of cash orders come back refused" },
  { value: "14 days", label: "capital tied up in every refusal" },
  { value: "Nothing", label: "a store knows before it ships today" },
];

function Hero() {
  return (
    <div className="bg-section-base">
      <div
        className={`container-page flex flex-col items-center gap-16 pt-16 pb-28`}
      >
        <div className="flex max-w-250 flex-col items-center gap-10 text-center">
          <div className="flex flex-col items-center gap-5">
            <span className="text-kicker font-medium tracking-[0.16em] text-accent2-500">
              THE COD PROBLEM, SOLVED
            </span>
            <h1 className="font-display text-[40px] leading-[1.05] text-accent-900 lg:text-display">
              Shop online. Pay cash on delivery.
              <br className="hidden sm:block" /> Without anyone losing.
            </h1>
            <p className="max-w-170 text-lead text-accent-700">
              Thiqa is a marketplace where every store accepts cash on delivery,
              because a commitment score shows how reliably each buyer receives
              their orders.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button href="/customers"> Start shopping</Button>
            <Button href="stores" variant="onDark">
              I run a store
            </Button>
          </div>
        </div>
        <div className="grid w-full max-w-250 grid-cols-1 gap-6 sm:grid-cols-3">
          {stats.map((s) => (
            <div
              key={s.value}
              className="flex flex-col gap-1.5 rounded-lg border border-section-glow bg-accent-200 p-6"
            >
              <span className="font-display text-[36px] leading-tight text-accent2-500">
                {s.value}
              </span>
              <span className="text-sm text-accent-700">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Hero;
