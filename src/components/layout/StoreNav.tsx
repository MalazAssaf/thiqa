"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { api } from "@/src/lib/api";
import LogoutButton from "../auth/LogoutButton";

type StoreMe = {
  name: string;
  autoReject: boolean;
  rejectThreshold: number;
};

const links = [
  { href: "/store", label: "Orders" },
  { href: "/store/insights", label: "Insights" },
  { href: "/store/settings", label: "Settings" },
];

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

export default function StoreNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { data: store } = useQuery({
    queryKey: ["store", "me"],
    queryFn: () => api<StoreMe>("/api/store/me"),
  });

  // Close the account menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    function onClick(e: MouseEvent) {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [menuOpen]);

  function isActive(href: string) {
    return href === "/store"
      ? pathname === "/store"
      : pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-40 bg-section-base">
      <div className="mx-auto flex h-17 w-full max-w-360 items-center gap-4 px-4 sm:px-6 lg:px-15">
        {/* Brand */}
        <Link href="/store" className="flex shrink-0 items-baseline gap-2.25">
          <span className="font-display text-xl font-semibold text-surface">
            Thiqa
          </span>
          <span className="hidden text-3xs font-medium uppercase tracking-[1.2px] text-accent2-500 sm:inline">
            COD commitment
          </span>
        </Link>

        {/* Links */}
        <nav className="ml-2 flex min-w-0 gap-1 overflow-x-auto lg:ml-8">
          {links.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`shrink-0 rounded-md border px-3 py-1.5 text-sm transition-colors ${
                  active
                    ? "border-surface/30 bg-surface/15 text-surface"
                    : "border-transparent text-neutral-700 hover:text-surface"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex-1" />

        {/* Policy chip */}
        {store && (
          <Link
            href="/store/settings"
            className="hidden h-8 shrink-0 items-center gap-2 rounded-md border border-surface/25 px-3 text-xs text-surface/90 hover:bg-surface/10 md:flex"
          >
            <span
              className={`size-2 rounded-full ${store.autoReject ? "bg-accent-2" : "bg-neutral-600"}`}
            />
            {store.autoReject
              ? `Auto-reject below ${store.rejectThreshold}`
              : "Auto-reject off"}
          </Link>
        )}

        {/* Account */}
        <div ref={menuRef} className="relative shrink-0">
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className={`flex h-9 items-center gap-1.5 rounded-full border px-1 pr-2 transition-colors ${
              menuOpen
                ? "border-surface/30 bg-surface/15"
                : "border-transparent hover:bg-surface/10"
            }`}
          >
            <span className="flex size-7 items-center justify-center rounded-full bg-accent-2 text-2xs font-semibold text-accent-100">
              {store ? initials(store.name) : ""}
            </span>
            <span className="hidden max-w-40 truncate text-sm font-medium text-surface sm:inline">
              {store?.name}
            </span>
            <KeyboardArrowDownIcon
              sx={{ fontSize: 16 }}
              className={`text-surface transition-transform ${menuOpen ? "rotate-180" : ""}`}
            />
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-11 w-48 overflow-hidden rounded-md border border-divider bg-surface py-1 shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
            >
              <Link
                href="/store/settings"
                role="menuitem"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-text  hover:bg-accent-800"
              >
                <SettingsOutlinedIcon
                  sx={{ fontSize: 18 }}
                  className="text-neutral-500"
                />
                Settings
              </Link>
              <LogoutButton redirectTo="/store/login" />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
