"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { Headphones, LayoutGrid, Smartphone, type LucideIcon } from "lucide-react";

import { ProductCard } from "@/components/product/ProductCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { productFilters, products } from "@/data/products";
import { cn } from "@/lib/utils";
import type { ProductCategory } from "@/types";

type Filter = ProductCategory | "all";

/** Tab icons — iPhone uses the Apple logo, the rest are generic glyphs. */
const filterIcons: Partial<Record<Filter, LucideIcon | "apple">> = {
  all: LayoutGrid,
  iphone: "apple",
  samsung: Smartphone,
  gadgets: Headphones,
};

export function FeaturedProducts() {
  const [filter, setFilter] = useState<Filter>("all");

  const visible = useMemo(
    () => (filter === "all" ? products : products.filter((p) => p.category === filter)),
    [filter],
  );

  return (
    <section id="shop" className="mt-24 scroll-mt-28" aria-labelledby="featured-title">
      <SectionHeading
        eyebrow="Featured"
        title={<span id="featured-title">Trending right now</span>}
        action={
          <LayoutGroup id="product-filters">
            <div
              role="tablist"
              aria-label="Filter products"
              className="flex max-w-full gap-1 overflow-x-auto rounded-full bg-white p-1.5 shadow-[0_8px_24px_-12px_rgb(17_17_17/0.18)] ring-1 ring-line"
            >
              {productFilters.map((option) => {
                const active = option.value === filter;
                const icon = filterIcons[option.value];
                const Icon = icon && icon !== "apple" ? icon : null;
                const count = option.value === "all" ? products.length : products.filter((p) => p.category === option.value).length;
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setFilter(option.value)}
                    className={cn(
                      "relative flex min-h-11 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors",
                      active ? "text-white" : "text-ink hover:bg-surface",
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="active-filter"
                        className="absolute inset-0 rounded-full bg-brand shadow-[0_8px_16px_-8px_rgb(17_17_17/0.6)]"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    {icon === "apple" ? (
                      <Image
                        src="/images/brands/apple.svg"
                        alt=""
                        width={16}
                        height={16}
                        unoptimized
                        className={cn("relative size-4", active && "invert")}
                      />
                    ) : (
                      Icon && <Icon className="relative size-4" strokeWidth={2.2} aria-hidden />
                    )}
                    <span className="relative">{option.label}</span>
                    <span
                      className={cn(
                        "relative grid min-w-5 place-items-center rounded-full px-1.5 py-0.5 text-[11px] font-bold leading-none",
                        active ? "bg-white/20 text-white" : "bg-surface text-muted",
                      )}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </LayoutGroup>
        }
      />

      <motion.div layout className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {visible.map((product) => (
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
    </section>
  );
}
