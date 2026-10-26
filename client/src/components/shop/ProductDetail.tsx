"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Heart, Minus, Plus, ShoppingBag, Star } from "lucide-react";

import { ButtonLink } from "@/components/ui/ButtonLink";
import { ChoiceButton } from "@/components/ui/ChoiceButton";
import { productColors, productConditions, productStorage } from "@/data/products";
import { routes } from "@/data/site";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

const views = ["Back", "Front", "Side", "Camera"];

export function ProductDetail({ product }: { product: Product }) {
  const colors = productColors[product.id] ?? productColors.default;
  const [color, setColor] = useState(0);
  const [condition, setCondition] = useState(0);
  const [storage, setStorage] = useState(0);
  const [view, setView] = useState(0);
  const [qty, setQty] = useState(1);
  const [liked, setLiked] = useState(false);

  return (
    <div className="flex flex-wrap items-start gap-6">
      {/* Gallery */}
      <section aria-label="Product photos" className="flex min-w-0 flex-[1_1_520px] flex-col gap-3">
        <div className="relative flex h-[clamp(420px,52vw,600px)] items-center justify-center overflow-hidden rounded-panel bg-surface ring-1 ring-line">
          <div aria-hidden className="absolute left-1/2 top-1/2 size-[640px] -translate-x-1/2 -translate-y-1/2 animate-spin-slow rounded-full border border-dashed border-ink/8" />
          <div
            aria-hidden
            className={cn(
              "absolute left-1/2 top-1/2 size-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-45 blur-[80px] transition-colors duration-700",
              colors[color].glow,
            )}
          />
          <span className="absolute left-5 top-5 rounded-full bg-accent px-3 py-1.5 text-xs font-bold text-ink">{product.badge}</span>
          <button
            type="button"
            aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={liked}
            onClick={() => setLiked((v) => !v)}
            className="absolute right-3.5 top-3.5 grid size-12 place-items-center rounded-full border border-line bg-white"
          >
            <Heart className={cn("size-5 text-ink", liked && "fill-accent text-brand")} aria-hidden />
          </button>

          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
              className="relative animate-float"
            >
              <Image
                src={product.image}
                alt={`${product.name} — ${views[view]} view`}
                width={420}
                height={520}
                priority
                className="h-[clamp(300px,36vw,440px)] w-auto drop-shadow-[0_40px_50px_rgb(0_0_0/0.6)]"
              />
            </motion.div>
          </AnimatePresence>

          <span className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full border border-line bg-white px-3.5 py-2 text-[13px] font-medium text-ink">
            {colors[color].name} · {productStorage[storage]}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {views.map((label, index) => (
            <button
              key={label}
              type="button"
              aria-label={`Show ${label.toLowerCase()} view`}
              aria-pressed={view === index}
              onClick={() => setView(index)}
              className={cn(
                "flex h-[110px] items-center justify-center rounded-[18px] border-2 bg-white transition-colors",
                view === index ? "border-brand" : "border-line hover:border-[#d4d4d8]",
              )}
            >
              <Image src={product.image} alt="" width={80} height={100} className="h-[84px] w-auto" />
            </button>
          ))}
        </div>
      </section>

      {/* Buy box */}
      <section aria-label="Buy" className="flex min-w-0 flex-[1_1_420px] flex-col gap-5 rounded-panel bg-white p-6 ring-1 ring-line sm:p-9">
        <div className="flex flex-col gap-2">
          <span className="text-[13px] font-semibold text-muted">{product.brand}</span>
          <h1 className="animate-fade-up text-[clamp(2rem,3.6vw,2.875rem)] font-bold leading-[1.05]">{product.name}</h1>
          <span className="flex items-center gap-2 text-sm text-muted">
            <span className="flex" aria-hidden>
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} className="size-4 fill-amber-500 text-amber-500" />
              ))}
            </span>
            [RATING] · [COUNT] reviews
          </span>
        </div>

        <div className="flex flex-wrap items-baseline gap-3 border-y border-line py-[18px]">
          <b className="font-display text-4xl">{product.price}</b>
          {product.compareAtPrice && <s className="text-base text-[#6b7080]">{product.compareAtPrice}</s>}
          {product.compareAtPrice && (
            <span className="rounded-full bg-rose-100 px-2.5 py-1 text-xs font-bold text-rose-700">Save R [X]</span>
          )}
        </div>

        <fieldset>
          <legend className="mb-2.5 text-sm font-semibold">
            Colour: <span className="font-medium text-muted">{colors[color].name}</span>
          </legend>
          <div className="flex gap-2.5">
            {colors.map((c, index) => (
              <button
                key={c.name}
                type="button"
                aria-label={c.name}
                aria-pressed={color === index}
                onClick={() => setColor(index)}
                className={cn(
                  "size-12 rounded-full border-2 bg-white p-1 transition-colors",
                  color === index ? "border-brand" : "border-line",
                )}
              >
                <span className="block size-full rounded-full shadow-[inset_0_0_0_1px_rgb(0_0_0/0.12)]" style={{ background: c.hex }} />
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-2.5 text-sm font-semibold">Condition</legend>
          <div className="grid grid-cols-3 gap-2">
            {productConditions.map((c, index) => (
              <ChoiceButton key={c.label} selected={condition === index} onClick={() => setCondition(index)} className="min-h-14 text-center">
                <b className="block text-sm">{c.label}</b>
                <span className="block text-xs font-normal opacity-70">{c.description}</span>
              </ChoiceButton>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-2.5 text-sm font-semibold">Storage</legend>
          <div className="grid grid-cols-4 gap-2">
            {productStorage.map((s, index) => (
              <ChoiceButton key={s} selected={storage === index} onClick={() => setStorage(index)} className="min-h-14 px-2">
                {s}
              </ChoiceButton>
            ))}
          </div>
        </fieldset>

        <div className="flex gap-2.5">
          <div className="flex items-center overflow-hidden rounded-[14px] border border-[#d4d4d8]">
            <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-[54px] w-11 place-items-center bg-surface">
              <Minus className="size-4" aria-hidden />
            </button>
            <span className="w-11 text-center font-bold" aria-live="polite">
              {qty}
            </span>
            <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(9, q + 1))} className="grid h-[54px] w-11 place-items-center bg-surface">
              <Plus className="size-4" aria-hidden />
            </button>
          </div>
          <ButtonLink href={routes.cart} className="min-h-[54px] flex-1 text-base">
            <ShoppingBag className="size-[18px]" aria-hidden /> Add to cart
          </ButtonLink>
        </div>
        <ButtonLink href={routes.cart} variant="accent" className="min-h-[54px] text-base">
          Buy now
        </ButtonLink>

        <div className="flex items-center gap-3.5 rounded-[18px] bg-surface p-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand font-display font-bold text-white">3×</span>
          <span className="text-sm leading-normal">
            <b>Pay in 3 with Payflex</b> — 3 interest-free payments of <b>R [AMOUNT]</b>. No fees when you pay on time.
          </span>
        </div>

        <ul className="grid grid-cols-2 gap-2.5 text-sm">
          {["In stock · collect today", "Delivery in [X] days", "Genuine & not blacklisted", "Trade-in accepted"].map((item) => (
            <li key={item} className="flex items-center gap-2">
              <Check className="size-[18px] text-green-600" strokeWidth={2.4} aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
