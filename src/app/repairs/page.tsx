import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, ShieldCheck, Wrench } from "lucide-react";

import { RepairPriceList } from "@/components/repairs/RepairPriceList";
import { Accordion } from "@/components/ui/Accordion";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { repairFaqs, repairProcess } from "@/data/repairs";
import { routes } from "@/data/site";

export const metadata: Metadata = {
  title: "Repairs",
  description: "Same-day phone, tablet and laptop repairs with a 90-day warranty.",
};

export default function RepairsPage() {
  return (
    <Container className="pt-6">
      {/* Hero */}
      <section className="relative flex flex-wrap items-center gap-10 overflow-hidden rounded-panel bg-ink p-6 text-white sm:p-12 lg:p-16">
        <div aria-hidden className="absolute -right-52 -top-56 size-[720px] animate-spin-slow rounded-full border border-dashed border-white/12" />
        <div className="relative flex flex-[1_1_440px] flex-col gap-5">
          <Breadcrumbs items={[{ label: "Home", href: routes.home }, { label: "Repairs" }]} />
          <span className="inline-flex items-center gap-2.5 self-start rounded-full border border-white/12 bg-white/8 py-2 pl-2.5 pr-3.5 text-[13px] font-medium">
            <span className="size-2 animate-pulse-dot rounded-full bg-lime" />
            Technicians in store today
          </span>
          <h1 className="animate-fade-up text-[clamp(2.625rem,5.6vw,5rem)] font-bold leading-[0.98]">
            Broken today.
            <br />
            <span className="text-lime">Fixed today.</span>
          </h1>
          <p className="max-w-[480px] text-lg leading-relaxed text-muted-dark">
            Phones, tablets, laptops and MacBooks repaired by certified technicians with quality parts — and a 90-day
            warranty on every job.
          </p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href={routes.bookRepair} variant="lime" className="min-h-[54px]">
              Book a repair <ArrowRight className="size-[18px]" aria-hidden />
            </ButtonLink>
            <ButtonLink href="#prices" variant="ghost" className="min-h-[54px]">
              See repair prices
            </ButtonLink>
          </div>
        </div>

        <div className="relative h-[440px] min-w-0 flex-[1_1_380px]">
          <div aria-hidden className="absolute left-1/2 top-1/2 size-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500 opacity-35 blur-[80px]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src="/images/products/iphone-15-pro.webp"
              alt="iPhone ready for repair"
              width={260}
              height={390}
              priority
              className="h-[380px] w-auto animate-float drop-shadow-[0_40px_50px_rgb(0_0_0/0.6)]"
            />
          </div>
          <FloatingNote className="right-0 top-7" icon={<Wrench className="size-[18px] text-repair" aria-hidden />} iconBg="bg-repair-soft" title="Free diagnosis" subtitle="Quote before we start" />
          <FloatingNote className="bottom-10 left-0 [animation-delay:1.5s]" icon={<ShieldCheck className="size-[18px] text-lime" aria-hidden />} iconBg="bg-ink" title="90-day warranty" subtitle="Parts & labour" />
        </div>
      </section>

      <RepairPriceList />

      {/* Process */}
      <section className="mt-24" aria-labelledby="process-title">
        <div className="mb-8 text-center">
          <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-brand">How it works</span>
          <h2 id="process-title" className="mt-2 text-[clamp(1.875rem,3.8vw,2.875rem)] font-bold">
            Four simple steps
          </h2>
        </div>
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {repairProcess.map((step, index) => (
            <Reveal key={step.title} delay={index * 0.08}>
              <li className="flex h-full flex-col gap-3.5 rounded-card bg-white p-7 ring-1 ring-line transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_48px_-24px_rgb(11_12_16/0.35)]">
                <span className="font-display text-[56px] font-bold leading-none text-line">0{index + 1}</span>
                <b className="font-display text-xl">{step.title}</b>
                <span className="text-[15px] leading-normal text-muted">{step.description}</span>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* FAQ + CTA */}
      <section className="mt-24 flex flex-wrap items-start gap-4">
        <div className="min-w-0 flex-[999_1_560px] rounded-panel bg-white p-6 ring-1 ring-line sm:p-12">
          <h2 className="mb-5 text-[clamp(1.75rem,3.4vw,2.5rem)] font-bold">Repair FAQs</h2>
          <Accordion items={repairFaqs} />
        </div>
        <div className="relative flex min-w-0 flex-[1_1_340px] flex-col gap-3.5 overflow-hidden rounded-panel bg-lime p-9">
          <div aria-hidden className="absolute -bottom-28 -right-28 size-80 animate-spin-slow rounded-full border border-dashed border-ink/25" />
          <span className="relative text-[13px] font-bold uppercase tracking-[0.06em]">Walk-ins welcome</span>
          <b className="relative font-display text-[34px] leading-[1.05]">Book now, collect the same day.</b>
          <p className="relative text-[15px] leading-relaxed text-[#2a3000]">
            Reserve a slot online and skip the queue, or WhatsApp us a photo of the damage for a quick quote.
          </p>
          <ButtonLink href={routes.bookRepair} className="relative self-start">
            Book a repair
          </ButtonLink>
          <Link href={routes.contact} className="relative font-semibold">
            WhatsApp a photo →
          </Link>
        </div>
      </section>
    </Container>
  );
}

function FloatingNote({
  className,
  icon,
  iconBg,
  title,
  subtitle,
}: {
  className: string;
  icon: ReactNode;
  iconBg: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className={`absolute flex animate-float-soft items-center gap-2.5 rounded-[18px] bg-white px-4 py-3 text-ink shadow-[0_24px_48px_-18px_rgb(0_0_0/0.6)] ${className}`}>
      <span className={`grid size-9 place-items-center rounded-[10px] ${iconBg}`}>{icon}</span>
      <span>
        <b className="text-sm">{title}</b>
        <br />
        <span className="text-xs text-muted">{subtitle}</span>
      </span>
    </div>
  );
}
