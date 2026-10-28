import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ShieldCheck as ShieldIcon, Wrench } from "lucide-react";
import {
  CalendarCheck,
  HandHeart,
  MagnifyingGlass,
  Package,
  SealCheck,
  ShieldCheck,
  Timer,
  Wrench as WrenchIcon,
} from "@phosphor-icons/react/dist/ssr";

import { RepairPriceList } from "@/components/repairs/RepairPriceList";
import { Accordion } from "@/components/ui/Accordion";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { repairFaqs, repairProcess } from "@/data/repairs";
import { brands, routes, siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Repairs",
  description: "Same-day phone, tablet and laptop repairs with a 90-day warranty.",
};

const heroStats = [
  { icon: Timer, label: "Most repairs same day" },
  { icon: ShieldCheck, label: "90-day warranty" },
  { icon: MagnifyingGlass, label: "Free diagnosis" },
  { icon: SealCheck, label: "Quality parts" },
];

const processIcons = [CalendarCheck, MagnifyingGlass, WrenchIcon, Package];

const repairBrands = brands.filter((b) => b.logo);

export default function RepairsPage() {
  return (
    <>
      {/* Hero */}
      <Container className="pt-6">
        <section className="relative overflow-hidden rounded-panel bg-[#e4ebff] text-ink ring-1 ring-[#d3defc]">
          <div className="relative flex flex-wrap items-center gap-10 px-6 pb-10 pt-8 sm:px-12 lg:px-[72px] lg:pt-14">
            <div className="flex min-w-0 flex-[1_1_440px] flex-col gap-6">
              <Breadcrumbs items={[{ label: "Home", href: routes.home }, { label: "Repairs" }]} tone="light" />
              <span className="inline-flex items-center gap-2.5 self-start rounded-full border border-line bg-white py-2 pl-2.5 pr-3.5 text-[13px] font-medium">
                <span className="size-2 animate-pulse-dot rounded-full bg-accent" />
                Technicians in store today
              </span>
              <h1 className="animate-fade-up text-[clamp(2.625rem,5.2vw,4.75rem)] font-bold leading-[0.98]">
                Broken today.
                <br />
                <span className="text-hero">Fixed today.</span>
              </h1>
              <p className="max-w-[480px] text-lg leading-relaxed text-muted">
                Phones, tablets, laptops and MacBooks repaired by certified technicians with quality parts — and a 90-day
                warranty on every job.
              </p>
              <div className="flex flex-wrap gap-3">
                <ButtonLink href={routes.bookRepair} variant="accent" className="min-h-[54px] min-w-[196px]">
                  <Wrench className="size-[18px]" strokeWidth={2.2} aria-hidden />
                  Book a repair
                </ButtonLink>
                <ButtonLink href={siteConfig.whatsappUrl} variant="outline-dark" className="min-h-[54px]">
                  <WhatsAppIcon className="size-[18px] text-[#25D366]" />
                  Send us a photo
                </ButtonLink>
              </div>
            </div>

            <div className="relative h-[420px] min-w-0 flex-[1_1_380px]">
              <div aria-hidden className="absolute bottom-6 left-1/2 h-9 w-72 -translate-x-1/2 rounded-[50%] bg-ink/30 blur-xl" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src="/images/products/iphone-15-pro.webp"
                  alt="iPhone ready for repair"
                  width={260}
                  height={390}
                  priority
                  className="h-[370px] w-auto animate-float drop-shadow-[0_28px_30px_rgb(0_0_0/0.35)] will-change-transform"
                />
              </div>
              <FloatingNote className="right-0 top-6" icon={<Wrench className="size-[18px] text-white" aria-hidden />} title="Free diagnosis" subtitle="Quote before we start" />
              <FloatingNote className="bottom-16 left-0 [animation-delay:1.5s]" icon={<ShieldIcon className="size-[18px] text-white" aria-hidden />} title="90-day warranty" subtitle="Parts & labour" />
              <span className="absolute bottom-3 right-3 animate-float-soft rounded-full bg-accent px-4 py-2.5 text-[13px] font-bold text-ink shadow-[0_20px_40px_-16px_rgb(255_201_51/0.6)] [animation-delay:1.2s]">
                Back in hours, not days
              </span>
            </div>
          </div>

          <ul className="relative grid grid-cols-2 border-t border-[#d3defc] bg-white/50 lg:grid-cols-4">
            {heroStats.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center justify-center gap-3 px-4 py-5 text-sm font-semibold">
                <Icon className="size-6 shrink-0" aria-hidden />
                {label}
              </li>
            ))}
          </ul>
        </section>
      </Container>

      <div className="mx-auto w-full max-w-[1348px] px-4 sm:px-6">
        <RepairPriceList />

        {/* Process */}
        <section className="mt-24" aria-labelledby="process-title">
          <SectionHeading align="center" eyebrow="How it works" title={<span id="process-title">Four simple steps</span>} />
          <ol className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div aria-hidden className="absolute left-[12%] right-[12%] top-[58px] hidden h-px border-t-2 border-dashed border-ink/15 lg:block" />
            {repairProcess.map((step, index) => {
              const Icon = processIcons[index % processIcons.length];
              return (
                <Reveal key={step.title} delay={index * 0.08}>
                  <li className="group relative flex h-full flex-col items-center gap-4 rounded-card bg-white p-7 text-center ring-1 ring-line transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_48px_-24px_rgb(17_17_17/0.35)]">
                    <span className="relative grid size-[60px] place-items-center rounded-full bg-ink text-white transition-colors duration-300 group-hover:bg-accent group-hover:text-ink">
                      <Icon className="size-7" aria-hidden />
                      <span className="absolute -right-1.5 -top-1.5 grid size-6 place-items-center rounded-full bg-accent text-xs font-bold text-ink ring-2 ring-white">
                        {index + 1}
                      </span>
                    </span>
                    <b className="font-display text-xl">{step.title}</b>
                    <span className="text-[15px] leading-normal text-muted">{step.description}</span>
                  </li>
                </Reveal>
              );
            })}
          </ol>
        </section>

        {/* Why us — bento */}
        <section className="mt-24" aria-labelledby="why-repair-title">
          <SectionHeading eyebrow="Why VoltEdge" title={<span id="why-repair-title">Repairs you can trust</span>} />
          <div className="grid gap-4 lg:grid-cols-3">
            <Reveal className="flex min-h-[260px] flex-col justify-between rounded-[28px] bg-ink p-8 text-white">
              <SealCheck className="size-11" aria-hidden />
              <span>
                <b className="block font-display text-2xl">Quality parts only</b>
                <span className="mt-2 block text-[15px] leading-relaxed text-white/65">
                  Tested, graded parts — and we always confirm the quote before any work starts.
                </span>
              </span>
            </Reveal>
            <Reveal delay={0.08} className="flex min-h-[260px] flex-col justify-between rounded-[28px] bg-[#ffc933] p-8">
              <ShieldCheck className="size-11" aria-hidden />
              <span>
                <b className="block font-display text-2xl">90-day warranty</b>
                <span className="mt-2 block text-[15px] leading-relaxed text-ink/70">
                  Every repair is covered for parts and labour, so you can collect it with confidence.
                </span>
              </span>
            </Reveal>
            <Reveal delay={0.16} className="flex min-h-[260px] flex-col justify-between rounded-[28px] bg-[#fef4cc] p-8 ring-1 ring-[#f3dd8a]">
              <HandHeart className="size-11" aria-hidden />
              <span>
                <b className="block font-display text-2xl">Your data stays yours</b>
                <span className="mt-2 block text-[15px] leading-relaxed text-ink/70">
                  We never need your passcode for most repairs, and we never touch your files.
                </span>
              </span>
            </Reveal>
          </div>

          <Reveal className="mt-4 flex flex-wrap items-center justify-between gap-x-10 gap-y-5 rounded-[28px] bg-white px-8 py-6 ring-1 ring-line">
            <b className="font-display text-xl">We repair all major brands</b>
            <ul className="flex flex-wrap items-center gap-x-10 gap-y-4">
              {repairBrands.map((brand) => (
                <li key={brand.name} className="opacity-60 grayscale transition hover:opacity-100">
                  <Image
                    src={brand.logo!}
                    alt={brand.name}
                    width={96}
                    height={32}
                    unoptimized
                    className="h-7 w-auto object-contain"
                    style={brand.w ? { width: Math.round(brand.w * 0.7), height: "auto" } : undefined}
                  />
                </li>
              ))}
            </ul>
          </Reveal>
        </section>

        {/* FAQ + CTA */}
        <section className="mt-24 flex flex-wrap items-start gap-4">
          <div className="min-w-0 flex-[999_1_560px] rounded-panel bg-white p-6 ring-1 ring-line sm:p-12">
            <h2 className="mb-5 text-[clamp(1.75rem,3.4vw,2.5rem)] font-bold">Repair FAQs</h2>
            <Accordion items={repairFaqs} />
          </div>
          <div className="relative flex min-w-0 flex-[1_1_340px] flex-col gap-4 overflow-hidden rounded-panel bg-ink p-9 text-white lg:sticky lg:top-28">
            <div aria-hidden className="absolute -bottom-28 -right-28 size-80 animate-spin-slow rounded-full border border-dashed border-white/20" />
            <span className="relative w-fit rounded-full bg-accent px-3 py-1.5 text-xs font-bold uppercase tracking-[0.06em] text-ink">Walk-ins welcome</span>
            <b className="relative font-display text-[34px] leading-[1.05]">Book now, collect the same day.</b>
            <p className="relative text-[15px] leading-relaxed text-white/65">
              Reserve a slot online and skip the queue, or WhatsApp us a photo of the damage for a quick quote.
            </p>
            <ButtonLink href={routes.bookRepair} variant="accent" className="relative mt-1 min-h-[54px] self-start">
              <Wrench className="size-[18px]" strokeWidth={2.2} aria-hidden />
              Book a repair
            </ButtonLink>
            <Link href={siteConfig.whatsappUrl} className="relative inline-flex items-center gap-2 font-semibold hover:underline">
              <WhatsAppIcon className="size-[18px] text-[#25D366]" />
              WhatsApp a photo →
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}

function FloatingNote({
  className,
  icon,
  title,
  subtitle,
}: {
  className: string;
  icon: ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className={`absolute flex animate-float-soft items-center gap-2.5 rounded-[18px] bg-white px-4 py-3 text-ink shadow-[0_24px_48px_-18px_rgb(17_17_17/0.35)] ${className}`}>
      <span className="grid size-9 place-items-center rounded-[10px] bg-ink">{icon}</span>
      <span>
        <b className="text-sm">{title}</b>
        <br />
        <span className="text-xs text-muted">{subtitle}</span>
      </span>
    </div>
  );
}
