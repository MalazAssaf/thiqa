"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import PersonIcon from "@mui/icons-material/Person";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";

type TopNavProps = {
  minimal?: boolean; // true: logo only
};

export default function TopNav({ minimal = false }: TopNavProps) {
  const pathname = usePathname();
  const viewing = pathname.startsWith("/store") ? "store" : "customer";

  const option =
    "flex items-center gap-1.5 rounded-[7px] border px-3 py-1.75 text-[13px] text-cream";
  const active = "border-cream/50 bg-cream/14";
  const inactive = "border-transparent hover:bg-cream/8";

  return (
    <header className="bg-section-base">
      <div className="container-page flex h-17 items-center gap-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/Logo-light.svg" alt="" width={24} height={24} />
          <span className="font-display text-lg font-semibold text-cream">
            Thiqa
          </span>
          <span className="hidden text-kicker font-medium tracking-[1.2px] text-accent2-500 sm:inline">
            COD COMMITMENT
          </span>
        </Link>

        <div className="flex-1" />

        {!minimal && (
          <>
            <span className="hidden text-2xs text-cream/70 md:inline">
              Viewing as
            </span>

            {/* Role switch */}
            <div className="flex rounded-md border border-cream/28">
              <Link
                href="/login"
                className={`${option} ${viewing === "customer" ? active : inactive}`}
              >
                <PersonIcon sx={{ fontSize: 15 }} />
                Customer
              </Link>
              <Link
                href="/store/login"
                className={`${option} ${viewing === "store" ? active : inactive}`}
              >
                <StorefrontOutlinedIcon sx={{ fontSize: 15 }} />
                Store
              </Link>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
