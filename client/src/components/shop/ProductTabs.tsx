"use client";

import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";

import { cn } from "@/lib/utils";
import type { Product } from "@/types";

const tabs = ["Overview", "Specifications", "What's in the box", "Warranty"] as const;

export function ProductTabs({ product }: { product: Product }) {
  const [active, setActive] = useState<(typeof tabs)[number]>("Overview");

  const specs = [
    ["Model", product.name],
    ["Configuration", product.spec],
    ["Display", "[SIZE & TYPE]"],
    ["Chip", "[CHIP]"],
    ["Camera", "[CAMERA SPEC]"],
    ["Battery", "[BATTERY]"],
    ["Network", "5G · eSIM"],
    ["Brand", product.brand],
  ];

  return (
    <section className="mt-6 rounded-panel bg-white p-6 ring-1 ring-line sm:p-12" aria-label="Product details">
      <LayoutGroup id="product-tabs">
        <div role="tablist" className="flex w-fit max-w-full flex-wrap gap-1.5 rounded-2xl bg-surface p-1.5">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={active === tab}
              onClick={() => setActive(tab)}
              className={cn("relative min-h-11 rounded-xl px-[18px] text-sm font-semibold", active === tab ? "text-white" : "text-ink")}
            >
              {active === tab && (
                <motion.span layoutId="product-tab" className="absolute inset-0 rounded-xl bg-brand" transition={{ type: "spring", stiffness: 380, damping: 32 }} />
              )}
              <span className="relative">{tab}</span>
            </button>
          ))}
        </div>
      </LayoutGroup>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          role="tabpanel"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
          className="mt-7"
        >
          {active === "Overview" && (
            <div className="grid gap-4 md:grid-cols-3">
              {[
                ["Pro-level performance", "[Short benefit copy from the manufacturer spec sheet.]"],
                ["All-day battery", "[Battery life figure and charging details.]"],
                ["Checked by us", "Every device is tested, IMEI-checked and reset before it leaves the store."],
              ].map(([title, body]) => (
                <div key={title} className="rounded-[20px] bg-surface p-6">
                  <b className="font-display text-xl">{title}</b>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">{body}</p>
                </div>
              ))}
            </div>
          )}
          {active === "Specifications" && (
            <dl className="grid gap-x-8 md:grid-cols-2">
              {specs.map(([key, value]) => (
                <div key={key} className="flex justify-between gap-4 border-b border-line py-3.5 text-[15px]">
                  <dt className="text-muted">{key}</dt>
                  <dd className="text-right font-semibold">{value}</dd>
                </div>
              ))}
            </dl>
          )}
          {active === "What's in the box" && (
            <ul className="list-disc pl-5 text-[15px] leading-loose">
              <li>{product.name}</li>
              <li>USB-C charge cable</li>
              <li>Documentation</li>
              <li>VoltEdge warranty card</li>
            </ul>
          )}
          {active === "Warranty" && (
            <p className="max-w-[680px] text-[15px] leading-relaxed text-muted">
              New devices carry the manufacturer&apos;s warranty. Pre-owned devices include a [X]-month VoltEdge warranty.
              Repairs are covered for 90 days, parts and labour. See our refund policy for returns.
            </p>
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
