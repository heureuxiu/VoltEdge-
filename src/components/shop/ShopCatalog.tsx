"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

import { ProductCard } from "@/components/product/ProductCard";
import { ChoiceButton } from "@/components/ui/ChoiceButton";
import { inputClassName } from "@/components/ui/Field";
import { PageHero } from "@/components/ui/PageHero";
import { productTypes, products } from "@/data/products";
import { routes } from "@/data/site";
import type { ProductType } from "@/types";

type TypeFilter = ProductType | "all";
type SortKey = "featured" | "name-asc" | "name-desc";

const brandsInCatalog = Array.from(new Set(products.map((p) => p.brand)));
const storageOptions = ["128GB", "256GB", "512GB", "1TB"];

export function ShopCatalog() {
  const [type, setType] = useState<TypeFilter>("all");
  const [hiddenBrands, setHiddenBrands] = useState<string[]>([]);
  const [storage, setStorage] = useState("256GB");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("featured");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = products.filter(
      (p) =>
        (type === "all" || p.type === type) &&
        !hiddenBrands.includes(p.brand) &&
        (!q || `${p.brand} ${p.name}`.toLowerCase().includes(q)),
    );
    if (sort === "name-asc") return [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "name-desc") return [...list].sort((a, b) => b.name.localeCompare(a.name));
    return list;
  }, [type, hiddenBrands, query, sort]);

  const toggleBrand = (brand: string) =>
    setHiddenBrands((prev) => (prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]));

  const clearFilters = () => {
    setType("all");
    setHiddenBrands([]);
    setQuery("");
  };

  return (
    <>
      <PageHero
        breadcrumbs={[{ label: "Home", href: routes.home }, { label: "Shop" }]}
        title={
          <>
            Shop all <span className="text-lime">tech.</span>
          </>
        }
        description="New and certified pre-owned phones, laptops and gadgets — every device checked, never blacklisted, and available with Pay in 3."
        aside={
          <form
            role="search"
            onSubmit={(e) => e.preventDefault()}
            className="flex w-full max-w-[460px] flex-[1_1_380px] gap-2 rounded-[18px] border border-white/14 bg-white/8 p-1.5"
          >
            <label className="flex flex-1 items-center gap-2.5 px-3">
              <Search className="size-[18px] text-muted-dark" aria-hidden />
              <span className="sr-only">Search products</span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search iPhone, Galaxy, AirPods…"
                className="h-11 flex-1 bg-transparent text-[15px] text-white placeholder:text-white/45 focus:outline-none"
              />
            </label>
            <button type="submit" className="h-12 rounded-[13px] bg-lime px-5 font-bold text-ink transition-transform hover:-translate-y-0.5">
              Search
            </button>
          </form>
        }
      >
        <div className="flex flex-wrap gap-2">
          {productTypes.map((option) => (
            <ChoiceButton
              key={option.value}
              variant="pill"
              onDark
              selected={type === option.value}
              onClick={() => setType(option.value)}
            >
              {option.label}{" "}
              <span className="font-medium opacity-60">
                {option.value === "all" ? products.length : products.filter((p) => p.type === option.value).length}
              </span>
            </ChoiceButton>
          ))}
        </div>
      </PageHero>

      <div className="mt-6 flex flex-wrap items-start gap-6">
        {/* Filters */}
        <aside aria-label="Filters" className="flex max-w-full flex-[1_1_260px] flex-col gap-4">
          <div className="flex flex-col gap-6 rounded-card bg-white p-6 ring-1 ring-line">
            <div className="flex items-center justify-between">
              <b className="font-display text-lg">Filters</b>
              <button type="button" onClick={clearFilters} className="min-h-11 text-[13px] font-semibold text-brand">
                Clear all
              </button>
            </div>

            <FilterGroup legend="Brand">
              {brandsInCatalog.map((brand) => (
                <label key={brand} className="flex cursor-pointer items-center justify-between gap-2.5 text-[15px]">
                  <span className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={!hiddenBrands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
                      className="size-[18px] accent-ink"
                    />
                    {brand}
                  </span>
                  <span className="text-[13px] text-muted">{products.filter((p) => p.brand === brand).length}</span>
                </label>
              ))}
            </FilterGroup>

            <FilterGroup legend="Condition">
              {["Brand new", "Pre-owned · Grade A", "Pre-owned · Grade B"].map((label, i) => (
                <label key={label} className="flex items-center gap-2.5 text-[15px]">
                  <input type="checkbox" defaultChecked={i < 2} className="size-[18px] accent-ink" />
                  {label}
                </label>
              ))}
            </FilterGroup>

            <FilterGroup legend="Storage" row>
              {storageOptions.map((s) => (
                <ChoiceButton key={s} selected={storage === s} onClick={() => setStorage(s)} className="min-h-10 text-[13px]">
                  {s}
                </ChoiceButton>
              ))}
            </FilterGroup>

            <FilterGroup legend="Price">
              <div className="grid grid-cols-2 gap-2">
                <label className="flex flex-col gap-1 text-xs text-muted">
                  Min
                  <input placeholder="R 0" className={`${inputClassName} h-11 text-sm`} />
                </label>
                <label className="flex flex-col gap-1 text-xs text-muted">
                  Max
                  <input placeholder="R [MAX]" className={`${inputClassName} h-11 text-sm`} />
                </label>
              </div>
            </FilterGroup>

            <label className="flex items-center justify-between gap-3 border-t border-line pt-4 text-[15px] font-medium">
              Pay in 3 eligible
              <input type="checkbox" defaultChecked className="size-[18px] accent-ink" />
            </label>
          </div>

          <Link
            href={routes.tradeIn}
            className="flex flex-col gap-2.5 rounded-card bg-lime p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_48px_-24px_rgb(11_12_16/0.35)]"
          >
            <span className="text-xs font-bold uppercase tracking-[0.06em]">Trade-in</span>
            <b className="font-display text-[22px] leading-tight">Upgrade for less with your old phone.</b>
            <span className="text-sm font-semibold">Get an estimate →</span>
          </Link>
        </aside>

        {/* Results */}
        <section aria-label="Products" className="flex min-w-0 flex-[999_1_560px] flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-[18px] bg-white py-2.5 pl-[18px] pr-2.5 ring-1 ring-line">
            <span className="text-sm text-muted" aria-live="polite">
              Showing <b className="text-ink">{results.length}</b> products
            </span>
            <label className="flex items-center gap-2 text-sm text-muted">
              Sort by
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="h-11 rounded-xl border border-[#d5d8df] bg-surface px-3 text-sm text-ink"
              >
                <option value="featured">Featured</option>
                <option value="name-asc">Name: A–Z</option>
                <option value="name-desc">Name: Z–A</option>
              </select>
            </label>
          </div>

          <motion.div layout className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
            <AnimatePresence mode="popLayout">
              {results.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {results.length === 0 && (
            <div className="flex flex-col items-center gap-3 rounded-card border border-dashed border-[#d5d8df] bg-white p-12 text-center">
              <b className="font-display text-xl">No products match those filters</b>
              <button type="button" onClick={clearFilters} className="min-h-11 rounded-xl bg-ink px-5 font-semibold text-white">
                Clear filters
              </button>
            </div>
          )}

          <nav aria-label="Pagination" className="mt-3 flex justify-center gap-2">
            <button type="button" aria-label="Previous page" className="grid size-11 place-items-center rounded-xl bg-white ring-1 ring-line">
              <ChevronLeft className="size-[18px]" aria-hidden />
            </button>
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                type="button"
                aria-current={n === 1 ? "page" : undefined}
                className={n === 1 ? "size-11 rounded-xl bg-ink font-semibold text-white" : "size-11 rounded-xl bg-white font-semibold ring-1 ring-line"}
              >
                {n}
              </button>
            ))}
            <button type="button" aria-label="Next page" className="grid size-11 place-items-center rounded-xl bg-lime">
              <ChevronRight className="size-[18px]" aria-hidden />
            </button>
          </nav>
        </section>
      </div>
    </>
  );
}

function FilterGroup({ legend, row, children }: { legend: string; row?: boolean; children: ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-3 text-xs font-bold uppercase tracking-[0.06em] text-muted">{legend}</legend>
      <div className={row ? "flex flex-wrap gap-2" : "flex flex-col gap-2.5"}>{children}</div>
    </fieldset>
  );
}
