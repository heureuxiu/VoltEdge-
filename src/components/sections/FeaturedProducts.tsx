"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";

import { ProductCard } from "@/components/product/ProductCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { productFilters, products } from "@/data/products";
import { cn } from "@/lib/utils";
import type { ProductCategory } from "@/types";

type Filter = ProductCategory | "all";

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
            <div role="tablist" aria-label="Filter products" className="flex flex-wrap gap-1.5 rounded-2xl bg-white p-1.5 ring-1 ring-line">
              {productFilters.map((option) => {
                const active = option.value === filter;
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setFilter(option.value)}
                    className={cn(
                      "relative min-h-10 rounded-[10px] px-4 text-sm font-semibold transition-colors",
                      active ? "text-white" : "text-ink hover:bg-surface",
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="active-filter"
                        className="absolute inset-0 rounded-[10px] bg-ink"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className="relative">{option.label}</span>
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
