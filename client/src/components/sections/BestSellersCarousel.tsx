"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { motion, useReducedMotion, type PanInfo } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { bestSellers } from "@/data/products";
import { circularOffset, cn, wrapIndex } from "@/lib/utils";
import type { Product } from "@/types";

const AUTOPLAY_MS = 3200;
const VISIBLE_DEPTH = 3;
const SWIPE_THRESHOLD = 60;

/** Per-depth styling for the cards: index 0 = centre card. */
const depthScale = [1, 0.86, 0.75, 0.66];
const depthOpacity = [1, 0.92, 0.7, 0.4];

const spring = { type: "spring", stiffness: 140, damping: 22, mass: 0.9 } as const;

export function BestSellersCarousel() {
  const count = bestSellers.length;
  const [active, setActive] = useState(Math.floor(count / 2) - 1);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();

  const go = useCallback((index: number) => setActive(wrapIndex(index, count)), [count]);

  useEffect(() => {
    if (paused || reduceMotion) return;
    const timer = setInterval(() => setActive((i) => wrapIndex(i + 1, count)), AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [paused, reduceMotion, count]);

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x < -SWIPE_THRESHOLD) go(active + 1);
    else if (info.offset.x > SWIPE_THRESHOLD) go(active - 1);
  }

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Best sellers"
      className="surface-glow-strong relative mt-4 overflow-hidden rounded-panel pb-8 pt-12 text-ink ring-1 ring-line sm:pt-[72px]"
    >
      {/* Ambient decoration */}
      <div aria-hidden className="absolute left-1/2 top-1/2 size-[900px] -translate-x-1/2 -translate-y-[42%] animate-spin-slow rounded-full border border-dashed border-brand/10" />
      <div aria-hidden className="absolute left-1/2 top-1/2 size-[620px] -translate-x-1/2 -translate-y-[39%] rounded-full border border-brand/8" />
      <div aria-hidden className="absolute left-[18%] top-[20%] size-[360px] rounded-full bg-brand opacity-[0.12] blur-[100px]" />
      <div aria-hidden className="absolute left-1/2 top-[52%] size-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime opacity-40 blur-[90px]" />

      <Container className="relative flex flex-wrap items-end justify-between gap-5 lg:px-[72px]">
        <div className="flex flex-col gap-2.5">
          <span className="inline-flex items-center gap-2 self-start rounded-full border border-line bg-surface py-[7px] pl-[9px] pr-3 text-xs font-semibold uppercase tracking-[0.06em]">
            <span className="size-[7px] animate-pulse-dot rounded-full bg-lime" />
            Best sellers
          </span>
          <h2 className="text-[clamp(2rem,4.2vw,3.5rem)] font-bold leading-none">
            This week&apos;s <span className="text-lime-dark">favourites.</span>
          </h2>
        </div>
        <p className="max-w-[340px] text-base leading-relaxed text-muted">
          Our most-loved devices, checked and ready to go — all with Pay in 3.
        </p>
      </Container>

      <div
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="relative mt-3 h-[540px] [perspective:1700px] [perspective-origin:50%_45%]"
      >
        <motion.div
          className="absolute inset-0 touch-pan-y [transform-style:preserve-3d]"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragEnd={handleDragEnd}
        >
          {bestSellers.map((product, index) => (
            <CoverflowCard
              key={product.id}
              product={product}
              offset={circularOffset(index, active, count)}
              onSelect={() => go(index)}
            />
          ))}
        </motion.div>

        <button
          type="button"
          aria-label="Previous product"
          onClick={() => go(active - 1)}
          className="absolute left-3 top-1/2 z-40 grid size-[52px] -translate-y-1/2 place-items-center rounded-full border border-line bg-white text-ink shadow-md backdrop-blur-md transition-transform hover:-translate-y-[calc(50%+2px)] sm:left-[6vw] xl:left-24"
        >
          <ChevronLeft className="size-5" aria-hidden />
        </button>
        <button
          type="button"
          aria-label="Next product"
          onClick={() => go(active + 1)}
          className="absolute right-3 top-1/2 z-40 grid size-[52px] -translate-y-1/2 place-items-center rounded-full bg-lime text-ink shadow-[0_14px_32px_-12px_rgb(212_255_58/0.6)] transition-transform hover:-translate-y-[calc(50%+2px)] sm:right-[6vw] xl:right-24"
        >
          <ChevronRight className="size-5" strokeWidth={2.4} aria-hidden />
        </button>
      </div>

      <div className="relative flex justify-center gap-1" role="tablist" aria-label="Choose product">
        {bestSellers.map((product, index) => {
          const isActive = index === active;
          return (
            <button
              key={product.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`Show ${product.name}`}
              onClick={() => go(index)}
              className="flex h-11 min-w-6 items-center justify-center px-1"
            >
              <span
                className={cn(
                  "block h-2 rounded-full transition-all duration-500",
                  isActive ? "w-8 bg-lime" : "w-2 bg-ink/15",
                )}
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}

interface CoverflowCardProps {
  product: Product;
  offset: number;
  onSelect: () => void;
}

function CoverflowCard({ product, offset, onSelect }: CoverflowCardProps) {
  const depth = Math.min(Math.abs(offset), VISIBLE_DEPTH);
  const visible = Math.abs(offset) <= VISIBLE_DEPTH;
  const isActive = offset === 0;

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      aria-label={isActive ? `${product.name}, selected` : `Show ${product.name}`}
      aria-current={isActive}
      initial={false}
      animate={{
        x: `${offset * 56}%`,
        z: -depth * 90,
        rotateY: offset === 0 ? 0 : offset > 0 ? -16 : 16,
        scale: depthScale[depth],
        opacity: visible ? depthOpacity[depth] : 0,
      }}
      transition={spring}
      style={{ zIndex: 20 - depth, pointerEvents: visible ? "auto" : "none" }}
      className={cn(
        "absolute left-1/2 top-6 -ml-[140px] flex w-[280px] origin-[50%_60%] flex-col overflow-hidden rounded-[26px] border text-center backdrop-blur-md transition-[background-color,border-color,box-shadow] duration-500",
        isActive
          ? "border-lime bg-lime-soft shadow-[0_50px_100px_-40px_rgb(212_255_58/0.5),inset_0_1px_0_rgb(255_255_255/0.6)]"
          : "border-line bg-white shadow-[0_30px_60px_-30px_rgb(11_12_16/0.18)]",
      )}
    >
      <span
        className={cn(
          "relative flex h-[280px] items-center justify-center transition-[background] duration-500",
          isActive
            ? "bg-[radial-gradient(circle_at_50%_62%,rgb(212_255_58/0.35),rgb(244_255_208/0.1)_62%)]"
            : "bg-[radial-gradient(circle_at_50%_62%,rgb(11_12_16/0.04),transparent_62%)]",
        )}
      >
        <span
          className={cn(
            "absolute left-3.5 top-3.5 z-10 rounded-full px-2.5 py-1.5 text-xs font-bold transition-colors duration-500",
            isActive ? "bg-lime text-ink" : "bg-surface text-ink ring-1 ring-line",
          )}
        >
          {isActive ? "Hot deal" : product.badge}
        </span>
        <motion.span
          animate={{ y: isActive ? -6 : 0, scale: isActive ? 1.04 : 1 }}
          transition={spring}
          className="flex h-full items-center justify-center"
        >
          <Image
            src={product.image}
            alt=""
            width={240}
            height={300}
            draggable={false}
            className="h-[210px] w-auto max-w-[86%] object-contain drop-shadow-[0_26px_30px_rgb(0_0_0/0.6)]"
          />
        </motion.span>
      </span>

      <span
        className={cn(
          "flex flex-col items-center gap-[7px] px-4 pb-6 pt-[18px] transition-opacity duration-500",
          isActive ? "opacity-100" : "opacity-75",
        )}
      >
        <span className="text-xs font-medium tracking-[0.02em] text-muted">
          {product.brand} · {product.spec}
        </span>
        <span className="text-lg font-semibold text-ink">{product.name}</span>
        <span className="flex items-baseline gap-2">
          {product.compareAtPrice && <s className="text-[13px] text-muted">{product.compareAtPrice}</s>}
          <span className="font-display text-[22px] font-bold text-lime-dark">{product.price}</span>
        </span>
        <span className="inline-flex items-center gap-[7px] rounded-full border border-line bg-surface px-3 py-[7px] text-xs font-semibold text-ink">
          <span className="size-1.5 rounded-full bg-lime" />
          Pay in 3 with Payflex
        </span>
      </span>
    </motion.button>
  );
}
