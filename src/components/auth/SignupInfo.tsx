import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ScoreIcon from "@mui/icons-material/Score";

const points = [
  { icon: <PhoneAndroidIcon />, text: "One phone number, one account" },
  {
    icon: <VisibilityOffIcon />,
    text: "Stores never see your personal details",
  },
  { icon: <ScoreIcon />, text: "Only a commitment score is shared" },
];

export default function SignupInfo() {
  return (
    <section className="flex flex-col gap-3 lg:max-w-155 lg:flex-1">
      <h1 className="max-w-140 font-(family-name:--font-outfit) text-[32px] font-semibold leading-[1.12] tracking-[-0.64px] text-[#303030] sm:text-[36px] lg:text-h1 lg:tracking-[-0.84px]">
        Pay when it arrives.
      </h1>
      <p className="max-w-130 text-sm leading-[1.55] text-neutral-400 sm:text-body">
        Order from any Thiqa store with cash on delivery. Your account is tied
        to one verified phone number, so your commitment record follows you.
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
