import QueryStatsIcon from "@mui/icons-material/QueryStats";
import TuneIcon from "@mui/icons-material/Tune";
import MoveDownIcon from "@mui/icons-material/MoveDown";

const points = [
  { icon: <QueryStatsIcon />, text: "A commitment score on every cash order" },
  { icon: <TuneIcon />, text: "You decide where to stop accepting cash" },
  { icon: <MoveDownIcon />, text: "See the returns you avoid" },
];

export default function StoreSignupInfo() {
  return (
    <section className="flex flex-col gap-3 lg:max-w-155 lg:flex-1">
      <h1 className="max-w-140 text-[32px] font-semibold leading-[1.12] tracking-[-0.64px] text-text sm:text-[36px] lg:text-h1 lg:tracking-[-0.84px]">
        Sell with cash on delivery, minus the returns.
      </h1>
      <p className="max-w-130 text-sm leading-[1.55] text-neutral-400 sm:text-body">
        Three steps and your store can see a commitment score on every incoming
        COD order.
      </p>
      <ul className="flex flex-col gap-2.5 pt-2">
        {points.map((p) => (
          <li
            key={p.text}
            className="flex items-center gap-2 text-[13px] leading-normal text-neutral-400"
          >
            {p.icon}
            {p.text}
          </li>
        ))}
      </ul>
    </section>
  );
}
