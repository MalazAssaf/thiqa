import Link from "next/link";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import CategoryIcon from "./CategoryIcon";
import { getCategoryLabel } from "@/src/data/categories";
import { getCityLabel } from "@/src/data/cities";

export type StoreCardData = {
  id: number;
  name: string;
  category: string; // "PERFUMES", "CLOTHING", …
  city: string; // "RIYADH", "JEDDAH", …
};

export default function StoreCard({ store }: { store: StoreCardData }) {
  return (
    <Link
      href={`/customer/stores/${store.id}`}
      className="flex flex-col overflow-hidden rounded-lg bg-surface shadow-[0_1px_0_0_rgba(0,0,0,0.05),0_0_0_1px_rgba(0,0,0,0.07)] transition-shadow hover:shadow-[0_4px_12px_0_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.07)]"
    >
      {/* Header */}
      <div className="flex h-27.5 items-end justify-between bg-linear-[157deg] from-accent2-800 to-accent-800 to-64% px-3.5 py-3">
        <CategoryIcon category={store.category} />
        <span className="rounded-md border border-accent px-2.5 py-0.75 text-3xs font-medium text-accent">
          {getCategoryLabel(store.category)}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-2 px-4 py-3.5">
        <h3 className="font-display text-h5 font-semibold leading-[1.2] text-text">
          {store.name}
        </h3>

        <div className="mt-auto flex items-center gap-1.5 pt-0.5 text-3xs">
          <PlaceOutlinedIcon
            sx={{ fontSize: 13 }}
            className="text-neutral-500"
          />
          <span className="text-neutral-500">{getCityLabel(store.city)}</span>
          <span className="ml-auto font-medium text-accent">
            Cash on delivery
          </span>
        </div>
      </div>
    </Link>
  );
}
