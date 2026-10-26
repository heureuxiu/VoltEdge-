import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MapPin, Phone, Zap } from "lucide-react";

import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

import { ContactForm } from "@/components/contact/ContactForm";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { routes, siteConfig, storeHours } from "@/data/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact & find us",
  description: "WhatsApp, call, email or visit the store. Opening hours and service areas.",
};

const channels = [
  { title: "WhatsApp", value: siteConfig.whatsapp, cta: "Start a chat", icon: WhatsAppIcon, card: "bg-green-600 text-white", iconWrap: "bg-white/18 text-white", sub: "text-green-100" },
  { title: "Call us", value: siteConfig.phone, cta: "Call now", icon: Phone, card: "bg-white ring-1 ring-line", iconWrap: "bg-brand-soft text-brand", sub: "text-muted" },
  { title: "Email", value: siteConfig.email, cta: "Send email", icon: Mail, card: "bg-white ring-1 ring-line", iconWrap: "bg-repair-soft text-repair", sub: "text-muted" },
  { title: "Visit the store", value: siteConfig.address, cta: "Directions", icon: MapPin, card: "bg-accent text-ink", iconWrap: "bg-white text-ink", sub: "text-ink/70" },
];

export default function ContactPage() {
  return (
    <Container className="pt-6">
      <PageHero
        breadcrumbs={[{ label: "Home", href: routes.home }, { label: "Contact" }]}
        title={
          <>
            Let&apos;s talk <span className="text-hero">tech.</span>
          </>
        }
        description="Questions about a phone, a repair or a trade-in? Chat to a real person — or pop into the store."
        aside={
          <span className="inline-flex items-center gap-2.5 rounded-full border border-line bg-white px-[18px] py-3 font-semibold text-ink">
            <span className="size-2.5 animate-pulse-dot rounded-full bg-accent" />
            Open now · closes [TIME]
          </span>
        }
      />

      <section aria-label="Ways to reach us" className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {channels.map(({ icon: Icon, ...c }, index) => (
          <Reveal key={c.title} delay={index * 0.06}>
            <Link
              href="#"
              className={cn(
                "flex h-full min-h-[210px] flex-col justify-between gap-5 rounded-card p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_48px_-24px_rgb(17_17_17/0.35)]",
                c.card,
              )}
            >
              <span className={cn("grid size-[52px] place-items-center rounded-2xl", c.iconWrap)}>
                <Icon className="size-6" aria-hidden />
              </span>
              <span>
                <b className="block font-display text-xl">{c.title}</b>
                <span className={cn("text-sm", c.sub)}>{c.value}</span>
              </span>
              <span className="text-sm font-semibold">{c.cta} →</span>
            </Link>
          </Reveal>
        ))}
      </section>

      <div className="mt-4 flex flex-wrap items-stretch gap-4">
        <ContactForm />

        <section className="flex min-w-0 flex-[1_1_400px] flex-col gap-4" aria-label="Visit us">
          {/* Replace with a Google Maps embed */}
          <div role="img" aria-label="[MAP EMBED — store location]" className="relative h-[300px] overflow-hidden rounded-panel bg-brand-soft">
            <div aria-hidden className="absolute inset-0 bg-[linear-gradient(rgb(17_17_17/0.1)_1px,transparent_1px),linear-gradient(90deg,rgb(17_17_17/0.1)_1px,transparent_1px)] bg-[size:36px_36px]" />
            <div aria-hidden className="absolute -left-10 top-[140px] h-[26px] w-[520px] -rotate-12 bg-white" />
            <div aria-hidden className="absolute -top-5 left-[190px] h-[360px] w-[22px] rotate-[18deg] bg-white" />
            <div className="absolute left-1/2 top-[46%] flex -translate-x-1/2 -translate-y-full flex-col items-center">
              <span className="grid size-[54px] animate-float-soft place-items-center rounded-[50%_50%_50%_0] bg-brand [rotate:-45deg]">
                <Zap className="size-[22px] rotate-45 text-white" strokeWidth={2.4} aria-hidden />
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

          <div className="rounded-[28px] bg-white p-6 ring-1 ring-line">
            <b className="font-display text-xl">Store hours</b>
            <dl className="mt-3.5 flex flex-col">
              {storeHours.map((h, index) => (
                <div
                  key={h.day}
                  className={cn(
                    "flex justify-between gap-3 py-3 text-[15px]",
                    index > 0 && "border-t border-line",
                    h.highlight ? "font-semibold text-ink" : "text-muted",
                  )}
                >
                  <dt>{h.day}</dt>
                  <dd className="font-semibold">{h.time}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="flex flex-col gap-3.5 rounded-[28px] bg-white p-6 ring-1 ring-line">
            <b className="font-display text-xl">Areas we serve</b>
            <ul className="flex flex-wrap gap-2">
              {siteConfig.serviceAreas.map((area) => (
                <li key={area} className="rounded-full border border-line bg-surface px-3.5 py-2 text-[13px]">
                  {area}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </Container>
  );
}
