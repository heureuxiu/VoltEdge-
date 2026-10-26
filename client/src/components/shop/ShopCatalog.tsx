"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BadgeCheck, ChevronLeft, ChevronRight } from "lucide-react";

import { ProductCard } from "@/components/product/ProductCard";
import { ChoiceButton } from "@/components/ui/ChoiceButton";
import { inputClassName } from "@/components/ui/Field";
import { PageHero } from "@/components/ui/PageHero";
import { products } from "@/data/products";
import { routes } from "@/data/site";


const brandsInCatalog = Array.from(new Set(products.map((p) => p.brand)));
const storageOptions = ["128GB", "256GB", "512GB", "1TB"];

/** Floating product collage for the shop banner. */
function ShopBannerArt() {
  return (
    <div aria-hidden className="relative mx-auto h-[250px] w-full max-w-[460px] flex-[1_1_380px] sm:h-[290px]">
      <div className="absolute inset-x-6 bottom-2 h-12 rounded-[50%] bg-ink/25 blur-2xl" />
      <Image
        src="/images/products/macbook-air.webp"
        alt=""
        width={260}
        height={200}
        className="absolute bottom-6 left-0 w-[52%] -rotate-3 animate-float-soft drop-shadow-[0_24px_28px_rgb(17_17_17/0.28)] [animation-delay:-2s]"
      />
      <Image
        src="/images/products/galaxy-s25-ultra.webp"
        alt=""
        width={160}
        height={260}
        className="absolute bottom-3 right-2 h-[78%] w-auto rotate-6 animate-float-soft drop-shadow-[0_24px_28px_rgb(17_17_17/0.3)] [animation-delay:-4s]"
      />
      <Image
        src="/images/products/iphone-17-pro-max.webp"
        alt=""
        width={170}
        height={280}
        priority
        className="absolute bottom-2 left-[34%] z-10 h-[92%] w-auto -rotate-6 animate-float-soft drop-shadow-[0_28px_32px_rgb(17_17_17/0.35)]"
      />
      <span className="absolute left-2 top-2 z-20 flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-[13px] font-semibold shadow-[0_14px_28px_-14px_rgb(17_17_17/0.45)]">
        <BadgeCheck className="size-4" aria-hidden />
        Genuine stock only
      </span>
      <span className="absolute bottom-1 right-0 z-20 rounded-full bg-accent px-3.5 py-2 text-[13px] font-bold text-ink shadow-[0_14px_28px_-14px_rgb(17_17_17/0.45)]">
        Pay in 3 · Payflex
      </span>
    </div>
  );
}

export function ShopCatalog() {
  const [hiddenBrands, setHiddenBrands] = useState<string[]>([]);
  const [storage, setStorage] = useState("256GB");

  const results = useMemo(() => {
    return products.filter((p) => !hiddenBrands.includes(p.brand));
  }, [hiddenBrands]);

  const toggleBrand = (brand: string) =>
    setHiddenBrands((prev) => (prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]));

  const clearFilters = () => {
    setHiddenBrands([]);
  };

  return (
    <>
      <PageHero
        breadcrumbs={[{ label: "Home", href: routes.home }, { label: "Shop" }]}
        title={
          <>
            Shop all <span className="text-hero">tech.</span>
          </>
        }
        description="New and certified pre-owned phones, laptops and gadgets — every device checked, never blacklisted, and available with Pay in 3."
        aside={<ShopBannerArt />}
      />

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
            className="flex flex-col gap-2.5 rounded-card bg-accent p-6 text-ink transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_48px_-24px_rgb(17_17_17/0.35)]"
          >
            <span className="text-xs font-bold uppercase tracking-[0.06em]">Trade-in</span>
            <b className="font-display text-[22px] leading-tight">Upgrade for less with your old phone.</b>
            <span className="text-sm font-semibold">Get an estimate →</span>
          </Link>
        </aside>

        {/* Results */}
        <section aria-label="Products" className="flex min-w-0 flex-[999_1_560px] flex-col gap-4">
          <p className="px-1 text-sm text-muted" aria-live="polite">
            Showing <b className="text-ink">{results.length}</b> products
          </p>

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
            <div className="flex flex-col items-center gap-3 rounded-card border border-dashed border-[#d4d4d8] bg-white p-12 text-center">
              <b className="font-display text-xl">No products match those filters</b>
              <button type="button" onClick={clearFilters} className="min-h-11 rounded-xl bg-brand px-5 font-semibold text-white">
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
                className={n === 1 ? "size-11 rounded-xl bg-brand font-semibold text-white" : "size-11 rounded-xl bg-white font-semibold ring-1 ring-line"}
              >
                {n}
              </button>
            ))}
            <button type="button" aria-label="Next page" className="grid size-11 place-items-center rounded-xl bg-accent">
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
