"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Heart, Minus, Plus, ShoppingBag, Star } from "lucide-react";
import {
  ArrowsClockwise,
  BatteryFull,
  Camera,
  CreditCard,
  Cpu,
  Package,
  SealCheck,
  Storefront,
} from "@phosphor-icons/react";

import { ButtonLink } from "@/components/ui/ButtonLink";
import { productColors, productConditions, productStorage } from "@/data/products";
import { routes } from "@/data/site";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

const views = ["Back", "Front", "Side", "Camera"];

const perks = [
  { icon: Storefront, label: "In stock · collect today" },
  { icon: Package, label: "Delivery in [X] days" },
  { icon: SealCheck, label: "Genuine & not blacklisted" },
  { icon: ArrowsClockwise, label: "Trade-in accepted" },
  { icon: CreditCard, label: "Pay in 3 · R [AMOUNT] each" },
];

const callouts = [
  { icon: Cpu, label: "Flagship chip", className: "left-[15%] top-[60%]" },
  { icon: Camera, label: "Pro camera system", className: "right-[6%] top-[24%]" },
  { icon: BatteryFull, label: "All-day battery", className: "right-[9%] bottom-[26%]" },
];

function Step({ n, title, hint, children }: { n: number; title: string; hint?: string; children: ReactNode }) {
  return (
    <fieldset className="flex flex-col gap-5 rounded-[26px] bg-white p-6 ring-1 ring-line">
      <legend className="sr-only">{title}</legend>
      <div className="flex items-center gap-3">
        <span className="grid size-8 place-items-center rounded-full bg-ink font-display text-sm font-bold text-white">{n}</span>
        <b className="font-display text-lg">{title}</b>
        {hint && <span className="ml-auto text-sm text-muted">{hint}</span>}
      </div>
      {children}
    </fieldset>
  );
}

/**
 * Immersive product page: a colour-reactive stage, three configuration steps, and a sticky buy bar.
 * `children` (details, related products) render between the steps and the bar so the bar stays pinned
 * while the whole page is scrolled.
 */
export function ProductDetail({ product, children }: { product: Product; children?: ReactNode }) {
  const colors = productColors[product.id] ?? productColors.default;
  const [color, setColor] = useState(0);
  const [condition, setCondition] = useState(0);
  const [storage, setStorage] = useState(0);
  const [view, setView] = useState(0);
  const [qty, setQty] = useState(1);
  const [liked, setLiked] = useState(false);
  const selected = colors[color];

  return (
    <div className="flex flex-col gap-4">
      {/* Stage */}
      <section
        aria-label="Product"
        className="relative flex min-h-[clamp(480px,46vw,600px)] items-center justify-center overflow-hidden rounded-panel ring-1 ring-line transition-[background] duration-700"
        style={{
          background: `radial-gradient(55% 62% at 50% 58%, ${selected.hex}40, transparent 72%), linear-gradient(180deg, #fffdf4 0%, #fff4cc 100%)`,
        }}
      >
        {/* Giant ghost title */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-[12%] select-none whitespace-nowrap text-center font-display text-[clamp(4rem,12vw,11rem)] font-bold uppercase leading-none tracking-tight text-ink/[0.06]"
        >
          {product.name.replace(/^(iPhone|Galaxy|MacBook|AirPods)\s*/i, "") || product.name}
        </span>
        <div aria-hidden className="absolute left-1/2 top-[56%] size-[520px] -translate-x-1/2 -translate-y-1/2 animate-spin-slow rounded-full border border-dashed border-ink/10" />

        {/* Top row */}
        <div className="absolute inset-x-5 top-5 flex items-start justify-between">
          <div className="flex flex-col gap-2">
            <span className="w-fit rounded-full bg-ink px-3.5 py-1.5 text-xs font-bold text-white">{product.badge}</span>
            <span className="w-fit rounded-full bg-white/80 px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-muted">{product.brand}</span>
            <h1 className="mt-3 animate-fade-up font-display text-[clamp(1.75rem,3.2vw,2.75rem)] font-bold leading-none">{product.name}</h1>
            <span className="flex items-center gap-2 text-sm text-muted">
              <span className="flex" aria-hidden>
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className="size-4 fill-[#ffb400] text-[#ffb400]" />
                ))}
              </span>
              [RATING] · [COUNT] reviews
            </span>
            <span className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
              <b className="font-display text-3xl">{product.price}</b>
              {product.compareAtPrice && <s className="text-sm text-ink/50">{product.compareAtPrice}</s>}
              {product.compareAtPrice && <span className="rounded-full bg-ink px-2.5 py-1 text-xs font-bold text-white">Save R [X]</span>}
            </span>
          </div>
          <button
            type="button"
            aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={liked}
            onClick={() => setLiked((v) => !v)}
            className="grid size-12 place-items-center rounded-full bg-white shadow-[0_10px_24px_-12px_rgb(17_17_17/0.45)] transition-transform hover:scale-110 active:scale-95"
          >
            <Heart className={cn("size-5 transition-colors", liked && "fill-[#e5484d] text-[#e5484d]")} aria-hidden />
          </button>
        </div>

        {/* Views rail */}
        <div className="absolute bottom-16 left-5 hidden flex-col gap-2 md:flex">
          {views.map((label, index) => (
            <button
              key={label}
              type="button"
              aria-label={`Show ${label.toLowerCase()} view`}
              aria-pressed={view === index}
              onClick={() => setView(index)}
              className={cn(
                "grid size-14 place-items-center rounded-2xl bg-white/90 transition-all",
                view === index ? "ring-2 ring-ink" : "ring-1 ring-line hover:ring-[#b8b8c0]",
              )}
            >
              <Image src={product.image} alt="" width={40} height={50} className="h-9 w-auto" />
            </button>
          ))}
        </div>

        {/* Colour rail */}
        <div className="absolute right-5 top-1/2 flex -translate-y-1/2 flex-col gap-3">
          {colors.map((c, index) => (
            <button
              key={c.name}
              type="button"
              aria-label={c.name}
              aria-pressed={color === index}
              onClick={() => setColor(index)}
              className={cn(
                "size-10 rounded-full bg-white p-1 transition-all",
                color === index ? "ring-2 ring-ink" : "ring-1 ring-line hover:scale-110",
              )}
            >
              <span className="block size-full rounded-full shadow-[inset_0_0_0_1px_rgb(0_0_0/0.15)]" style={{ background: c.hex }} />
            </button>
          ))}
        </div>

        {/* Feature callouts */}
        {callouts.map(({ icon: Icon, label, className }) => (
          <span
            key={label}
            className={cn(
              "absolute hidden items-center gap-2 rounded-full bg-white py-2 pl-2 pr-4 text-[13px] font-semibold shadow-[0_14px_28px_-14px_rgb(17_17_17/0.4)] lg:flex",
              className,
            )}
          >
            <span className="grid size-8 place-items-center rounded-full bg-ink text-white">
              <Icon className="size-4" aria-hidden />
            </span>
            {label}
          </span>
        ))}

        {/* Product */}
        <div aria-hidden className="absolute bottom-[14%] left-1/2 h-7 w-56 -translate-x-1/2 rounded-[50%] bg-ink/25 blur-xl" />
        <AnimatePresence mode="wait">
          <motion.div
            key={`${view}-${color}`}
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -14, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
            className="relative z-10 animate-float will-change-transform"
          >
            <Image
              src={product.image}
              alt={`${product.name} in ${selected.name} — ${views[view]} view`}
              width={420}
              height={520}
              priority
              className="h-[clamp(270px,31vw,390px)] w-auto drop-shadow-[0_30px_32px_rgb(0_0_0/0.32)]"
            />
          </motion.div>
        </AnimatePresence>

        {/* Selection chip */}
        <span className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white px-4 py-2 text-[13px] font-semibold shadow-[0_10px_24px_-12px_rgb(17_17_17/0.45)]">
          <span className="size-3 rounded-full ring-1 ring-black/15" style={{ background: selected.hex }} />
          {selected.name} · {productStorage[storage]}
        </span>
      </section>

      {/* Reassurance strip */}
      <ul className="flex flex-wrap justify-center gap-x-6 gap-y-3 rounded-full bg-surface px-6 py-4 text-sm font-medium ring-1 ring-line">
        {perks.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-2">
            <Icon className="size-5 shrink-0" aria-hidden />
            {label}
          </li>
        ))}
      </ul>

      {/* Configuration steps */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Step n={1} title="Colour" hint={selected.name}>
          <div className="flex flex-wrap gap-3">
            {colors.map((c, index) => (
              <button
                key={c.name}
                type="button"
                aria-pressed={color === index}
                onClick={() => setColor(index)}
                className={cn(
                  "flex items-center gap-2.5 rounded-full py-2 pl-2 pr-4 text-sm font-semibold transition-all",
                  color === index ? "bg-ink text-white" : "bg-surface ring-1 ring-line hover:ring-[#b8b8c0]",
                )}
              >
                <span className="size-6 rounded-full shadow-[inset_0_0_0_1px_rgb(0_0_0/0.18)]" style={{ background: c.hex }} />
                {c.name}
              </button>
            ))}
          </div>
        </Step>

        <Step n={2} title="Condition">
          <div className="flex flex-col gap-2.5">
            {productConditions.map((c, index) => (
              <button
                key={c.label}
                type="button"
                aria-pressed={condition === index}
                onClick={() => setCondition(index)}
                className={cn(
                  "flex items-center justify-between rounded-2xl px-4 py-3 text-left transition-all",
                  condition === index ? "bg-ink text-white" : "bg-surface ring-1 ring-line hover:ring-[#b8b8c0]",
                )}
              >
                <b className="text-sm">{c.label}</b>
                <span className={cn("text-xs", condition === index ? "text-white/70" : "text-muted")}>{c.description}</span>
              </button>
            ))}
          </div>
        </Step>

        <Step n={3} title="Storage" hint={productStorage[storage]}>
          <div className="grid grid-cols-2 gap-2.5">
            {productStorage.map((s, index) => (
              <button
                key={s}
                type="button"
                aria-pressed={storage === index}
                onClick={() => setStorage(index)}
                className={cn(
                  "rounded-2xl px-4 py-4 text-left transition-all",
                  storage === index ? "bg-ink text-white" : "bg-surface ring-1 ring-line hover:ring-[#b8b8c0]",
                )}
              >
                <b className="block font-display text-lg">{s}</b>
                <span className={cn("text-xs", storage === index ? "text-white/70" : "text-muted")}>+ R [X]</span>
              </button>
            ))}
          </div>
        </Step>
      </div>

      {children}

      {/* Sticky buy bar */}
      <div className="sticky bottom-4 z-30 mx-auto mt-2 w-full max-w-[940px]">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 rounded-[30px] bg-ink p-2.5 pl-3 text-white shadow-[0_24px_48px_-16px_rgb(17_17_17/0.6)] sm:rounded-full">
          <span className="grid size-14 shrink-0 place-items-center rounded-full bg-white">
            <Image src={product.image} alt="" width={40} height={50} className="h-10 w-auto" />
          </span>
          <span className="min-w-0 flex-1">
            <b className="block truncate text-sm">{product.name}</b>
            <span className="block truncate text-xs text-white/60">
              {selected.name} · {productStorage[storage]} · {productConditions[condition].label}
            </span>
          </span>
          <span className="flex items-baseline gap-2">
            <b className="font-display text-2xl">{product.price}</b>
            {product.compareAtPrice && <s className="text-xs text-white/50">{product.compareAtPrice}</s>}
          </span>
          <div className="flex items-center rounded-full bg-white/10 p-1">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="grid size-10 place-items-center rounded-full transition-colors hover:bg-white/15"
            >
              <Minus className="size-4" aria-hidden />
            </button>
            <span className="w-6 text-center text-sm font-bold" aria-live="polite">
              {qty}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => setQty((q) => Math.min(9, q + 1))}
              className="grid size-10 place-items-center rounded-full transition-colors hover:bg-white/15"
            >
              <Plus className="size-4" aria-hidden />
            </button>
          </div>
          <ButtonLink href={routes.cart} variant="light" className="min-h-12 rounded-full px-5 text-sm">
            <ShoppingBag className="size-4" aria-hidden /> Add to cart
          </ButtonLink>
          <ButtonLink href={routes.cart} variant="accent" className="min-h-12 rounded-full bg-accent px-5 text-sm text-ink hover:bg-[#ffd24d]">
            Buy now
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
