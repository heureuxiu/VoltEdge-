import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { TradeInEstimator } from "@/components/trade-in/TradeInEstimator";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { routes } from "@/data/site";
import { tradeInChecklist, tradeInGrades, tradeInSteps } from "@/data/trade-in";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Trade-in",
  description: "Get an instant estimate for your old phone and put the credit towards your upgrade.",
};

/** Pastel card colours for the trade-in steps: blue, mint, yellow. */
const stepTones = [
  "bg-[#e4ebff] ring-[#d3defc]",
  "bg-[#dff4e8] ring-[#c7e8d6]",
  "bg-[#fff1b8] ring-[#f3dd8a]",
];

export default function TradeInPage() {
  return (
    <Container className="pt-6">
      <section className="relative flex flex-wrap items-center gap-10 overflow-hidden rounded-panel bg-white p-6 text-ink ring-1 ring-line sm:p-12 lg:p-16">
        <div aria-hidden className="absolute -bottom-72 -left-56 size-[640px] animate-spin-slow rounded-full border border-dashed border-accent/40" />
        <div className="relative flex flex-[1_1_400px] flex-col gap-5">
          <Breadcrumbs items={[{ label: "Home", href: routes.home }, { label: "Trade-in" }]} tone="light" />
          <h1 className="animate-fade-up text-[clamp(2.625rem,5.4vw,4.75rem)] font-bold leading-[0.98]">
            Old phone?
            <br />
            <span className="text-hero">Instant credit.</span>
          </h1>
          <p className="max-w-[460px] text-lg leading-relaxed text-muted">
            Answer a few quick questions for an estimate, bring your device in for a quick check, and put the value
            straight towards your upgrade.
          </p>
          <div className="relative h-[220px] max-w-[420px]">
            <Image
              src="/images/products/iphone-15-pro.webp"
              alt=""
              width={130}
              height={195}
              className="absolute left-5 top-5 h-[190px] w-auto -rotate-6 animate-float-soft drop-shadow-[0_30px_30px_rgb(0_0_0/0.6)]"
            />
            <span aria-hidden className="absolute left-[150px] top-[90px] grid size-16 place-items-center rounded-full bg-white">
              <ArrowRight className="size-7 text-ink" strokeWidth={2.4} />
            </span>
            <Image
              src="/images/products/iphone-17-pro-max.webp"
              alt=""
              width={140}
              height={210}
              className="absolute left-[230px] top-0 h-[210px] w-auto animate-float drop-shadow-[0_30px_30px_rgb(0_0_0/0.6)]"
            />
          </div>
        </div>
        <TradeInEstimator />
      </section>

      <section className="mt-24" aria-labelledby="steps-title">
        <div className="mb-8 text-center">
          <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-brand">How trade-in works</span>
          <h2 id="steps-title" className="mt-2 text-[clamp(1.875rem,3.8vw,2.875rem)] font-bold">
            Three steps to your upgrade
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {tradeInSteps.map((step, index) => (
            <Reveal
              key={step.title}
              delay={index * 0.08}
              className={cn(
                "flex flex-col gap-3.5 rounded-card p-7 ring-1 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_48px_-24px_rgb(17_17_17/0.3)]",
                stepTones[index % stepTones.length],
              )}
            >
              <span className="grid size-[52px] place-items-center rounded-2xl bg-ink font-display text-xl font-bold text-white">{index + 1}</span>
              <b className="font-display text-xl">{step.title}</b>
              <span className="leading-normal text-ink/65">{step.description}</span>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mt-24 rounded-panel bg-white p-6 ring-1 ring-line sm:p-12" aria-labelledby="grades-title">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-brand">Grading guide</span>
            <h2 id="grades-title" className="mt-2 text-[clamp(1.75rem,3.4vw,2.625rem)] font-bold">
              How we grade devices
            </h2>
          </div>
          <Link href="#" className="font-semibold hover:text-brand">
            Read the full trade-in policy →
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {tradeInGrades.map((g) => (
            <div key={g.grade} className="flex flex-col gap-3 rounded-card bg-surface p-6">
              <span className={cn("self-start rounded-full px-3 py-1.5 text-xs font-bold", g.badgeClassName)}>{g.grade}</span>
              <b className="font-display text-xl">{g.title}</b>
              <span className="text-[15px] leading-relaxed text-muted">{g.description}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-4 flex flex-wrap gap-4">
        <div className="flex-[1_1_420px] rounded-panel bg-white p-6 ring-1 ring-line sm:p-10">
          <h2 className="mb-[18px] text-[28px] font-bold">What to bring</h2>
          <ul className="flex flex-col gap-3.5 text-base">
            {tradeInChecklist.map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="grid size-7 place-items-center rounded-lg bg-accent text-ink">
                  <Check className="size-4" strokeWidth={3} aria-hidden />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative flex flex-[1_1_420px] flex-col justify-between gap-5 overflow-hidden rounded-panel bg-hero-soft p-6 text-ink ring-1 ring-line sm:p-10">
          <div aria-hidden className="absolute -right-28 -top-28 size-80 animate-spin-slow rounded-full border border-dashed border-ink/15" />
          <b className="relative font-display text-[34px] leading-[1.05]">Already know what you want next?</b>
          <p className="relative text-base leading-relaxed text-muted">
            Pick your new phone and we&apos;ll take your trade-in off the price at checkout.
          </p>
          <ButtonLink href={routes.shop} variant="light" className="relative self-start">
            Shop phones
          </ButtonLink>
        </div>
      </section>
    </Container>
  );
}
