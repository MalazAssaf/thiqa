"use client";

import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import StoreCard from "@/src/components/shared/StoreCard";
import { stores } from "@/src/data/stores";
import { categories } from "@/src/data/categories";

export default function StoresPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const query = search.trim().toLowerCase();
  const filtered = stores.filter((s) => {
    const matchesCategory = category === "all" || s.category === category;
    const matchesSearch =
      !query ||
      s.name.toLowerCase().includes(query) ||
      s.description.toLowerCase().includes(query) ||
      s.products.some((p) => p.toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  });

  const filterOptions = [{ value: "all", label: "All" }, ...categories];

  return (
    <main className="min-h-[calc(100dvh-68px)] bg-bg pb-16">
      <div className="container-page flex flex-col gap-6 pt-8">
        {/* Heading */}
        <div className="flex flex-col gap-1.5">
          <h1 className="text-h2 font-semibold leading-[1.15] text-text">
            Stores
          </h1>
          <p className="text-sm text-neutral-400">
            Cash on delivery available at every store on Thiqa.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="flex h-10 w-full items-center gap-2 rounded-md border border-divider bg-surface px-2.5 focus-within:border-accent sm:h-9 lg:w-85 lg:shrink-0">
            <SearchIcon sx={{ fontSize: 16 }} className="text-neutral-600" />
            <input
              type="search"
              placeholder="Search stores and products"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-base text-text placeholder:text-neutral-600 outline-none sm:text-sm"
            />
          </label>

          <div className="overflow-x-auto scrollbar-none">
            <div className="flex w-max overflow-hidden rounded-md border border-divider bg-surface">
              {filterOptions.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setCategory(c.value)}
                  className={`whitespace-nowrap border px-3 py-2 text-[13px] ${
                    category === c.value
                      ? "border-accent bg-accent-900 text-accent"
                      : "border-transparent text-text hover:bg-neutral-900"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((s) => (
              <StoreCard key={s.slug} store={s} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-divider bg-surface px-6 py-12 text-center">
            <p className="text-sm text-text">No stores match your search.</p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategory("all");
              }}
              className="mt-2 text-sm font-medium text-accent"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
