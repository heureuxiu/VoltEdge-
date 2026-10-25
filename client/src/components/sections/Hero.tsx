"use client";

import Image from "next/image";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Clock,
  MessageCircle,
  ShieldCheck,
  BadgeCheck,
} from "lucide-react";

import { ButtonLink } from "@/components/ui/ButtonLink";
import { Marquee } from "@/components/ui/Marquee";
import { heroSlides } from "@/data/content";
import { brands, siteConfig } from "@/data/site";
import { cn, wrapIndex } from "@/lib/utils";

const AUTOPLAY_MS = 5500;
const ease = [0.2, 0.7, 0.2, 1] as const;

export function Hero() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const slide = heroSlides[active];

  const go = useCallback((index: number) => setActive(wrapIndex(index, heroSlides.length)), []);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => setActive((i) => wrapIndex(i + 1, heroSlides.length)), AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [paused]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="surface-glow relative overflow-hidden rounded-panel text-ink ring-1 ring-line"
    >
      {/* Decorative rings + colour wash */}
      <div aria-hidden className="absolute -right-24 -top-28 size-[460px] rounded-full bg-brand opacity-[0.1] blur-[100px]" />
      <div aria-hidden className="absolute -bottom-20 -left-16 size-[380px] rounded-full bg-lime opacity-[0.18] blur-[100px]" />
      <div aria-hidden className="absolute -right-56 -top-56 size-[760px] animate-spin-slow rounded-full border border-dashed border-brand/10" />
      <div aria-hidden className="absolute -right-20 -top-20 size-[480px] rounded-full border border-brand/8" />

      <div className="relative flex flex-wrap items-center gap-10 px-6 pb-10 pt-8 sm:px-12 lg:px-[72px] lg:pt-[72px]">
        {/* Copy */}
        <div className="flex min-w-0 flex-[1_1_440px] flex-col gap-6">
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-line bg-surface py-2 pl-2.5 pr-3.5 text-[13px] font-medium">
              <span className="size-2 animate-pulse-dot rounded-full bg-lime" />
              Open now · Walk-ins welcome
            </span>
            <span
              className={cn(
                "inline-flex min-w-[150px] items-center justify-center rounded-full px-3.5 py-2 text-[13px] font-semibold transition-colors duration-500",
                slide.tagClassName,
              )}
            >
              {slide.tag}
            </span>
          </div>

          {/* Fixed-height copy block: slides swap in place without resizing the hero */}
          <div className="relative h-[calc(2em+4.8*18px+24px)] text-[clamp(2.25rem,4.6vw,4.125rem)]">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.55, ease }}
                className="absolute inset-0 flex flex-col gap-6"
              >
                <h1 className="font-display text-[1em] font-bold leading-none">
                  <span className="block whitespace-nowrap">{slide.titleTop}</span>
                  <span className="block whitespace-nowrap text-lime-dark">{slide.titleBottom}</span>
                </h1>
                <p className="line-clamp-3 max-w-[480px] font-sans text-lg leading-[1.6] text-muted">
                  {slide.body}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex flex-wrap gap-3">
            <ButtonLink href={slide.cta.href} variant="lime" className="min-w-[196px] min-h-[54px]">
              {slide.cta.label}
              <ArrowRight className="size-[18px]" strokeWidth={2.2} aria-hidden />
            </ButtonLink>
            <ButtonLink href={siteConfig.whatsappUrl} variant="outline-dark" className="min-h-[54px]">
              <MessageCircle className="size-[18px] text-green-400" aria-hidden />
              Chat on WhatsApp
            </ButtonLink>
          </div>

          <SliderControls active={active} onSelect={go} />

          <ul className="flex flex-wrap gap-x-7 gap-y-3 border-t border-line pt-4 text-sm text-muted">
            <li className="flex items-center gap-2"><ShieldCheck className="size-[18px] text-lime-dark" aria-hidden />90-day warranty</li>
            <li className="flex items-center gap-2"><Clock className="size-[18px] text-lime-dark" aria-hidden />Same-day repairs</li>
            <li className="flex items-center gap-2"><BadgeCheck className="size-[18px] text-lime-dark" aria-hidden />Genuine stock only</li>
          </ul>
        </div>

        {/* Stage */}
        <div className="relative h-[460px] min-w-0 flex-[1_1_420px] sm:h-[540px]">
          <div
            aria-hidden
            className={cn(
              "absolute left-1/2 top-1/2 size-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-[80px] transition-colors duration-700",
              slide.glow,
            )}
          />
          <div aria-hidden className="absolute bottom-6 left-1/2 h-10 w-80 -translate-x-1/2 rounded-[50%] bg-black/70 blur-xl" />

          <AnimatePresence mode="popLayout">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, x: 60, rotate: 6, scale: 0.92 }}
              animate={{ opacity: 1, x: 0, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, x: -60, rotate: -6, scale: 0.92 }}
              transition={{ duration: 0.8, ease }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="animate-float">
                <Image
                  src={slide.image}
                  alt={slide.imageAlt}
                  width={375}
                  height={480}
                  priority={active === 0}
                  className="h-[380px] w-auto drop-shadow-[0_40px_50px_rgb(0_0_0/0.55)] sm:h-[470px]"
                />
              </div>
            </motion.div>
          </AnimatePresence>

          <FloatingCard className="right-0 top-4 w-[240px]">
            <span className="grid size-[52px] shrink-0 place-items-center overflow-hidden rounded-[14px] bg-surface">
              <Image src={slide.image} alt="" width={52} height={66} className="h-12 w-auto" />
            </span>
            <span className="flex min-w-0 flex-col">
              <b className="text-sm">{slide.card.title}</b>
              <span className="text-xs text-muted">{slide.card.subtitle}</span>
            </span>
          </FloatingCard>

          <FloatingCard className="bottom-20 right-1.5 [animation-delay:2.2s]">
            <span className="grid size-9 place-items-center rounded-[10px] bg-ink">
              <ShieldCheck className="size-[18px] text-lime" aria-hidden />
            </span>
            <span className="flex flex-col">
              <b className="text-sm">90-day warranty</b>
              <span className="text-xs text-muted">On every repair</span>
            </span>
          </FloatingCard>

          <div className="absolute bottom-6 left-1 animate-float-soft rounded-full bg-lime px-4 py-2.5 text-[13px] font-bold text-ink shadow-[0_20px_40px_-16px_rgb(212_255_58/0.5)] [animation-delay:1.2s]">
            Pay in 3 · Payflex
          </div>
        </div>
      </div>

      {/* Brand strip */}
      <div className="border-t border-line py-5">
        <Marquee
          items={brands}
          duration={40}
          trackClassName="gap-16 pr-16"
          renderItem={(brand) => (
            <span className="font-display text-[22px] font-semibold text-ink/35">{brand}</span>
          )}
        />
      </div>
    </section>
  );
}

function FloatingCard({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        "absolute flex animate-float-soft items-center gap-3 rounded-[18px] bg-white p-3 pr-4 text-ink ring-1 ring-line shadow-[0_24px_48px_-18px_rgb(11_12_16/0.18)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

function SliderControls({ active, onSelect }: { active: number; onSelect: (index: number) => void }) {
  return (
    <div className="flex items-center gap-4">
      <span className="min-w-14 font-display text-sm text-muted">
        <b className="text-ink">0{active + 1}</b> / 0{heroSlides.length}
      </span>
      <div className="flex items-center gap-2">
        {heroSlides.map((s, index) => (
          <button
            key={s.id}
            type="button"
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === active}
            onClick={() => onSelect(index)}
            className="flex h-11 items-center"
          >
            <span
              className={cn(
                "block h-1 rounded-full transition-all duration-500",
                index === active ? "w-10 bg-lime" : "w-4 bg-ink/15",
              )}
            />
          </button>
        ))}
      </div>
      <div className="ml-auto flex gap-2">
        <button
          type="button"
          aria-label="Previous slide"
          onClick={() => onSelect(active - 1)}
          className="grid size-11 place-items-center rounded-full border border-line text-ink transition-transform hover:-translate-y-0.5 hover:bg-surface"
        >
          <ChevronLeft className="size-[18px]" aria-hidden />
        </button>
        <button
          type="button"
          aria-label="Next slide"
          onClick={() => onSelect(active + 1)}
          className="grid size-11 place-items-center rounded-full bg-ink text-white transition-transform hover:-translate-y-0.5"
        >
          <ChevronRight className="size-[18px]" aria-hidden />
        </button>
      </div>
    </div>
  );
}
