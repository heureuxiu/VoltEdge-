import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone, Zap } from "lucide-react";
import { ChatsCircle, ShieldCheck, Storefront, UserCircle } from "@phosphor-icons/react/dist/ssr";

import { Accordion } from "@/components/ui/Accordion";
import { ContactForm } from "@/components/contact/ContactForm";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { routes, siteConfig, storeHours } from "@/data/site";
import { cn } from "@/lib/utils";
import type { Faq } from "@/types";

export const metadata: Metadata = {
  title: "Contact & find us",
  description: "WhatsApp, call, email or visit the store. Opening hours and service areas.",
};

const heroPoints = [
  { icon: ChatsCircle, label: "Replies in minutes" },
  { icon: UserCircle, label: "Real people, no bots" },
  { icon: Storefront, label: "Walk-ins welcome" },
  { icon: ShieldCheck, label: "Honest advice" },
];

const channels = [
  {
    title: "WhatsApp",
    value: siteConfig.whatsapp,
    cta: "Start a chat",
    href: siteConfig.whatsappUrl,
    icon: <WhatsAppIcon className="size-7 text-[#25D366]" />,
    card: "bg-[#dff4e8] ring-1 ring-[#c7e8d6]",
    iconWrap: "bg-white",
    sub: "text-ink/65",
  },
  {
    title: "Call us",
    value: siteConfig.phone,
    cta: "Call now",
    href: `tel:${siteConfig.phone}`,
    icon: <Phone className="size-6" aria-hidden />,
    card: "bg-[#e4ebff] ring-1 ring-[#d3defc]",
    iconWrap: "bg-white",
    sub: "text-ink/65",
  },
  {
    title: "Email",
    value: siteConfig.email,
    cta: "Send email",
    href: `mailto:${siteConfig.email}`,
    icon: <Mail className="size-6" aria-hidden />,
    card: "bg-[#ffe9ea] ring-1 ring-[#fbd3d6]",
    iconWrap: "bg-white",
    sub: "text-ink/65",
  },
  {
    title: "Visit the store",
    value: siteConfig.address,
    cta: "Directions",
    href: siteConfig.mapsUrl,
    icon: <MapPin className="size-6" aria-hidden />,
    card: "bg-[#fff1b8] ring-1 ring-[#f3dd8a]",
    iconWrap: "bg-white",
    sub: "text-ink/65",
  },
];

const contactFaqs: Faq[] = [
  { question: "How quickly will you reply?", answer: "WhatsApp messages are usually answered within minutes during store hours. Emails and the form are answered the same working day." },
  { question: "Do I need to book before visiting?", answer: "No — walk-ins are always welcome. For repairs you can also book a slot online to skip the queue." },
  { question: "Can I get a quote without coming in?", answer: "Yes. Send us a photo of the damage or the device details on WhatsApp and we'll give you a price before you travel." },
  { question: "Do you deliver?", answer: "We deliver nationwide and offer same-day collection in store. Delivery times and fees are shown at checkout." },
  { question: "What payment methods do you accept?", answer: "Card, instant EFT, Apple Pay and Google Pay — or split any purchase into 3 interest-free payments with Payflex." },
];

export default function ContactPage() {
  return (
    <>
      {/* Banner */}
      <Container className="pt-6">
        <section className="relative overflow-hidden rounded-panel bg-[#dff4e8] text-ink ring-1 ring-[#c7e8d6]">
          <div className="relative flex flex-wrap items-center gap-10 px-6 pb-10 pt-8 sm:px-12 lg:px-[72px] lg:pt-14">
            <div className="flex min-w-0 flex-[1_1_440px] flex-col gap-6">
              <Breadcrumbs items={[{ label: "Home", href: routes.home }, { label: "Contact" }]} tone="light" />
              <span className="inline-flex items-center gap-2.5 self-start rounded-full border border-line bg-white py-2 pl-2.5 pr-3.5 text-[13px] font-medium">
                <span className="size-2 animate-pulse-dot rounded-full bg-[#25D366]" />
                Open now · closes [TIME]
              </span>
              <h1 className="animate-fade-up text-[clamp(2.625rem,5.2vw,4.75rem)] font-bold leading-[0.98]">
                Let&apos;s talk
                <br />
                <span className="text-hero">tech.</span>
              </h1>
              <p className="max-w-[480px] text-lg leading-relaxed text-ink/65">
                Questions about a phone, a repair or a trade-in? Chat to a real person — or pop into the store.
              </p>
              <div className="flex flex-wrap gap-3">
                <ButtonLink href={siteConfig.whatsappUrl} className="min-h-[54px] min-w-[196px]">
                  <WhatsAppIcon className="size-[18px] text-[#25D366]" />
                  Chat on WhatsApp
                </ButtonLink>
                <ButtonLink href={`tel:${siteConfig.phone}`} variant="outline-dark" className="min-h-[54px]">
                  <Phone className="size-[18px]" aria-hidden />
                  Call us
                </ButtonLink>
              </div>
            </div>

            <div className="relative h-[400px] min-w-0 flex-[1_1_380px]">
              <div className="absolute inset-x-6 inset-y-4 overflow-hidden rounded-[32px] bg-white shadow-[0_32px_64px_-32px_rgb(17_17_17/0.45)] ring-4 ring-white">
                <Image
                  src="/images/about/store.jpg"
                  alt={`Inside the ${siteConfig.name} store`}
                  fill
                  sizes="(min-width: 1024px) 40vw, 90vw"
                  priority
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          <ul className="relative grid grid-cols-2 border-t border-[#c7e8d6] bg-white/50 lg:grid-cols-4">
            {heroPoints.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center justify-center gap-3 px-4 py-5 text-sm font-semibold">
                <Icon className="size-6 shrink-0" aria-hidden />
                {label}
              </li>
            ))}
          </ul>
        </section>
      </Container>

      <div className="mx-auto w-full max-w-[1348px] px-4 sm:px-6">
        {/* Channels */}
        <section aria-label="Ways to reach us" className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {channels.map((c, index) => (
            <Reveal key={c.title} delay={index * 0.06}>
              <Link
                href={c.href}
                className={cn(
                  "group flex h-full min-h-[220px] flex-col justify-between gap-5 rounded-card p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_48px_-24px_rgb(17_17_17/0.4)]",
                  c.card,
                )}
              >
                <span className="flex items-start justify-between">
                  <span className={cn("grid size-14 place-items-center rounded-2xl", c.iconWrap)}>{c.icon}</span>
                  <ArrowUpRight className="size-5 opacity-40 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" aria-hidden />
                </span>
                <span>
                  <b className="block font-display text-xl">{c.title}</b>
                  <span className={cn("block text-sm", c.sub)}>{c.value}</span>
                </span>
                <span className="text-sm font-semibold">{c.cta} →</span>
              </Link>
            </Reveal>
          ))}
        </section>

        {/* Form + visit */}
        <div className="mt-4 flex flex-wrap items-stretch gap-4">
          <ContactForm />

          <section className="flex min-w-0 flex-[1_1_400px] flex-col gap-4" aria-label="Visit us">
            {/* Replace with a Google Maps embed */}
            <div role="img" aria-label="[MAP EMBED — store location]" className="relative h-[300px] overflow-hidden rounded-panel bg-[#e4ebff] ring-1 ring-[#d3defc]">
              <div aria-hidden className="absolute inset-0 bg-[linear-gradient(rgb(35_71_255/0.08)_1px,transparent_1px),linear-gradient(90deg,rgb(35_71_255/0.08)_1px,transparent_1px)] bg-[size:36px_36px]" />
              <div aria-hidden className="absolute -left-10 top-[140px] h-[26px] w-[520px] -rotate-12 bg-white" />
              <div aria-hidden className="absolute -top-5 left-[190px] h-[360px] w-[22px] rotate-[18deg] bg-white" />
              <div className="absolute left-1/2 top-[46%] flex -translate-x-1/2 -translate-y-full flex-col items-center">
                <span className="grid size-[54px] animate-float-soft place-items-center rounded-[50%_50%_50%_0] bg-ink [rotate:-45deg]">
                  <Zap className="size-[22px] rotate-45 text-accent" strokeWidth={2.4} aria-hidden />
                </span>
                <span className="mt-1.5 size-3 animate-pulse-dot rounded-full bg-accent" />
              </div>
              <Link
                href={siteConfig.mapsUrl}
                className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold shadow-[0_12px_24px_-12px_rgb(17_17_17/0.3)] transition-transform hover:-translate-y-0.5"
              >
                {siteConfig.address} · Get directions →
              </Link>
            </div>

            <div className="rounded-[28px] bg-[#fff1b8] p-6 ring-1 ring-[#f3dd8a]">
              <b className="font-display text-xl">Store hours</b>
              <dl className="mt-3.5 flex flex-col">
                {storeHours.map((h, index) => (
                  <div
                    key={h.day}
                    className={cn(
                      "flex justify-between gap-3 py-3 text-[15px]",
                      index > 0 && "border-t border-[#f3dd8a]",
                      h.highlight ? "font-semibold text-ink" : "text-ink/65",
                    )}
                  >
                    <dt>{h.day}</dt>
                    <dd className="font-semibold">{h.time}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="flex flex-col gap-3.5 rounded-[28px] bg-[#dff4e8] p-6 ring-1 ring-[#c7e8d6]">
              <b className="font-display text-xl">Areas we serve</b>
              <ul className="flex flex-wrap gap-2">
                {siteConfig.serviceAreas.map((area) => (
                  <li key={area} className="rounded-full bg-white px-3.5 py-2 text-[13px] font-medium">
                    {area}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-[28px] bg-white p-6 ring-1 ring-line">
              <b className="font-display text-xl">Follow us</b>
              <ul className="flex gap-2.5">
                {siteConfig.socials.map((social) => (
                  <li key={social.name}>
                    <Link
                      href={social.href}
                      aria-label={social.name}
                      className="group grid size-11 place-items-center rounded-full bg-surface ring-1 ring-line transition-all duration-200 hover:-translate-y-0.5 hover:bg-ink"
                    >
                      <Image src={social.icon} alt="" width={20} height={20} unoptimized className="size-5 transition-[filter] duration-200 group-hover:invert" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        {/* Quick answers */}
        <section className="mt-24" aria-labelledby="contact-faq-title">
          <div className="flex flex-wrap items-start gap-4">
            <div className="min-w-0 flex-[1_1_320px] lg:sticky lg:top-28">
              <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-muted">Quick answers</span>
              <h2 id="contact-faq-title" className="mt-2 text-[clamp(1.875rem,3.8vw,2.875rem)] font-bold leading-[1.05]">
                Before you message
              </h2>
              <p className="mt-3 max-w-[360px] text-[17px] leading-relaxed text-muted">
                The most common things people ask us. Can&apos;t find yours? Just send a message.
              </p>
            </div>
            <div className="min-w-0 flex-[1.6_1_520px] rounded-panel bg-white p-6 ring-1 ring-line sm:p-10">
              <Accordion items={contactFaqs} />
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative mt-6 flex flex-wrap items-center justify-between gap-8 overflow-hidden rounded-panel bg-ink p-8 text-white sm:p-12">
          <div aria-hidden className="absolute -bottom-32 -right-24 size-[420px] animate-spin-slow rounded-full border border-dashed border-white/15" />
          <div className="relative max-w-[520px]">
            <b className="block font-display text-[clamp(1.75rem,3.4vw,2.5rem)] leading-[1.08]">Still need a hand? Chat to a human.</b>
            <p className="mt-3 text-[17px] leading-relaxed text-white/65">
              Message us on WhatsApp, call the store, or pop in — we&apos;re happy to help.
            </p>
          </div>
          <div className="relative flex flex-wrap gap-3">
            <ButtonLink href={siteConfig.whatsappUrl} variant="light" className="min-h-[54px]">
              <WhatsAppIcon className="size-[18px] text-[#25D366]" />
              WhatsApp us
            </ButtonLink>
            <ButtonLink href={`tel:${siteConfig.phone}`} variant="accent" className="min-h-[54px] bg-accent text-ink hover:bg-[#ffd24d]">
              <Phone className="size-[18px]" aria-hidden />
              {siteConfig.phone}
            </ButtonLink>
          </div>
        </section>
      </div>
    </>
  );
}
