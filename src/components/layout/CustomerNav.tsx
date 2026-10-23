"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutButton from "../auth/LogoutButton";
import { useCart } from "../cart/CartProvider";

const links = [
  { label: "Stores", href: "/customer/stores" },
  { label: "My orders", href: "/customer/orders" },
  { label: "My score", href: "/customer/score" },
];

const pill =
  "flex items-center gap-1.5 rounded-[7px] border px-3 py-1.75 text-sm text-cream";
const active = "border-cream/50 bg-cream/14 font-medium";
const inactive = "border-transparent text-cream/70 hover:text-cream";

export default function CustomerNav() {
  const pathname = usePathname();
  const { count: cartCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <header className="bg-section-base">
      <div className="container-page flex h-17 items-center gap-4">
        {/* Brand */}
        <Link href="/customer/stores" className="flex items-center gap-2.5">
          <Image src="/Logo-light.svg" alt="" width={24} height={24} />
          <span className="font-display text-lg font-semibold text-cream">
            Thiqa
          </span>
          <span className="hidden text-kicker font-medium tracking-[1.2px] text-accent2-500 sm:inline">
            COD COMMITMENT
          </span>
        </Link>

        {/* Links (desktop) */}
        <nav className="ml-8 hidden gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`${pill} ${isActive(l.href) ? active : inactive}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex-1" />

        {/* Cart */}
        <Link
          href="/customer/cart"
          aria-label={`Cart, ${cartCount} ${cartCount === 1 ? "item" : "items"}`}
          className={`${pill} gap-2 text-xs ${isActive("/customer/cart") ? active : "border-cream/28 hover:bg-cream/8"}`}
        >
          <ShoppingCartOutlinedIcon sx={{ fontSize: 16 }} />
          <span className="hidden sm:inline">Cart</span>
          {cartCount > 0 && (
            <span className="rounded-full bg-accent2-500 px-1.5 text-3xs font-medium tabular-nums text-accent-100">
              {cartCount}
            </span>
          )}
        </Link>

        {/* Account */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setAccountOpen(!accountOpen)}
            aria-expanded={accountOpen}
            className={`flex items-center gap-1 rounded-full border p-1 pr-2 text-cream ${
              isActive("/customer/profile")
                ? "border-cream/50 bg-cream/14"
                : "border-transparent hover:bg-cream/8"
            }`}
          >
            <span className="flex size-7 items-center justify-center rounded-full bg-accent2-500 text-3xs font-medium text-accent-100">
              MA
            </span>
            <KeyboardArrowDownIcon sx={{ fontSize: 16 }} />
          </button>

          {accountOpen && (
            <div className="absolute right-0 top-full z-30 mt-2 flex w-40 flex-col rounded-md border border-divider bg-surface p-1 shadow-[0_1px_2px_0_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.07)]">
              <Link
                href="/customer/profile"
                onClick={() => setAccountOpen(false)}
                className="rounded-sm px-2.5 py-2 text-sm text-text hover:bg-accent-800"
              >
                Profile
              </Link>
              <LogoutButton
                redirectTo="/login"
                className="flex w-full items-center gap-2 rounded-sm px-2.5 py-2 text-sm text-critical-text hover:bg-critical-bg/50 disabled:opacity-60"
              />
            </div>
          )}
        </div>

        {/* Menu button (mobile) */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
          className="flex size-9 items-center justify-center rounded-md text-cream hover:bg-cream/8 md:hidden"
        >
          <MenuIcon sx={{ fontSize: 20 }} />
        </button>
      </div>

      {/* Links (mobile) */}
      {menuOpen && (
        <nav className="container-page flex flex-col gap-1 pb-4 md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className={`${pill} ${isActive(l.href) ? active : inactive}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
