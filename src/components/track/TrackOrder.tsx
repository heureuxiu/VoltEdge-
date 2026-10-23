"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { Check, MessageCircle } from "lucide-react";

import { ButtonLink } from "@/components/ui/ButtonLink";
import { Breadcrumbs } from "@/components/ui/PageHero";
import { routes } from "@/data/site";
import { cn } from "@/lib/utils";

type Kind = "order" | "repair";

/** Demo status data — replace with a call to your order / repair API. */
const tracking = {
  order: {
    word: "order",
    refLabel: "Order number",
    placeholder: "VE-000000",
    ref: "VE-[ORDER NO]",
    title: "Your order is on the way",
    chip: "In transit",
    etaLabel: "Estimated delivery",
    item: "iPhone 17 Pro Max",
    itemSub: "Deep Blue · 256GB",
    image: "/images/products/iphone-17-pro-max.webp",
    current: 2,
    steps: [
      ["Order placed", "Payment received"],
      ["Packed", "Device checked & boxed"],
      ["On the way", "With courier [COURIER]"],
      ["Out for delivery", "Arriving today"],
      ["Delivered", "Enjoy your new tech"],
    ],
  },
  repair: {
    word: "repair",
    refLabel: "Repair reference",
    placeholder: "RP-000000",
    ref: "RP-[REF]",
    title: "Your repair is in progress",
    chip: "Same-day repair",
    etaLabel: "Ready by",
    item: "iPhone 15 Pro",
    itemSub: "Screen replacement",
    image: "/images/products/iphone-15-pro.webp",
    current: 2,
    steps: [
      ["Booked in", "Device received at the store"],
      ["Diagnosed", "Quote approved by you"],
      ["Repair in progress", "Technician is replacing the screen"],
      ["Quality check", "Full function test"],
      ["Ready to collect", "We'll WhatsApp you"],
    ],
  },
} as const;

export function TrackOrder() {
  const [kind, setKind] = useState<Kind>("repair");
  const [searchKey, setSearchKey] = useState(0);
  const data = tracking[kind];

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // TODO: look up the reference via your API.
    setSearchKey((k) => k + 1);
  }

  return (
    <>
      <section className="relative overflow-hidden rounded-panel bg-ink p-6 text-white sm:p-12 lg:p-16">
        <div aria-hidden className="absolute -right-44 -top-60 size-[640px] animate-spin-slow rounded-full border border-dashed border-white/12" />
        <div aria-hidden className="absolute -bottom-20 right-28 size-72 rounded-full bg-brand opacity-30 blur-[80px]" />
        <div className="relative flex max-w-[760px] flex-col gap-5">
          <Breadcrumbs items={[{ label: "Home", href: routes.home }, { label: "Track order" }]} />
          <h1 className="animate-fade-up text-[clamp(2.5rem,5.2vw,4.5rem)] font-bold leading-none">
            Where&apos;s my <span className="text-lime">{data.word}?</span>
          </h1>
          <p className="text-[17px] leading-relaxed text-muted-dark">
            Enter your reference number and the phone number or email you used — we&apos;ll show you live progress.
          </p>

          <LayoutGroup id="track-kind">
            <div role="tablist" aria-label="What are you tracking?" className="flex w-fit gap-1.5 rounded-[14px] border border-white/12 bg-white/8 p-[5px]">
              {(["order", "repair"] as const).map((k) => (
                <button
                  key={k}
                  type="button"
                  role="tab"
                  aria-selected={kind === k}
                  onClick={() => setKind(k)}
                  className={cn("relative min-h-[42px] rounded-[10px] px-5 text-sm font-semibold capitalize", kind === k ? "text-ink" : "text-white")}
                >
                  {kind === k && <motion.span layoutId="track-tab" className="absolute inset-0 rounded-[10px] bg-lime" />}
                  <span className="relative">{k}</span>
                </button>
              ))}
            </div>
          </LayoutGroup>

          <form onSubmit={handleSubmit} className="flex flex-wrap gap-2.5 rounded-[20px] bg-white p-2">
            <label className="flex flex-[1_1_200px] flex-col justify-center px-3 py-1">
              <span className="text-[11px] font-bold uppercase tracking-[0.06em] text-muted">{data.refLabel}</span>
              <input placeholder={data.placeholder} className="h-[30px] bg-transparent text-base text-ink focus:outline-none" />
            </label>
            <label className="flex flex-[1_1_200px] flex-col justify-center border-l border-line px-3 py-1">
              <span className="text-[11px] font-bold uppercase tracking-[0.06em] text-muted">Phone or email</span>
              <input placeholder="you@example.com" className="h-[30px] bg-transparent text-base text-ink focus:outline-none" />
            </label>
            <button type="submit" className="min-h-14 rounded-[14px] bg-lime px-7 text-base font-bold text-ink transition-transform hover:-translate-y-0.5">
              Track
            </button>
          </form>
        </div>
      </section>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${kind}-${searchKey}`}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
          className="mt-4 flex flex-wrap items-start gap-4"
        >
          <section aria-label="Progress" className="min-w-0 flex-[999_1_560px] rounded-panel bg-white p-6 ring-1 ring-line sm:p-11">
            <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="text-[13px] text-muted">
                  {data.refLabel} <b className="text-ink">{data.ref}</b>
                </span>
                <h2 className="mt-1.5 text-[clamp(1.625rem,3vw,2.25rem)] font-bold">{data.title}</h2>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-lime-soft px-3.5 py-2 text-[13px] font-bold">
                <span className="size-2 animate-pulse-dot rounded-full bg-lime-600" />
                {data.chip}
              </span>
            </div>

            <ol>
              {data.steps.map(([title, sub], index) => {
                const done = index < data.current;
                const current = index === data.current;
                const last = index === data.steps.length - 1;
                return (
                  <motion.li
                    key={title}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.08 }}
                    className="flex gap-[18px]"
                  >
                    <div className="flex flex-col items-center">
                      <span
                        className={cn(
                          "grid size-9 shrink-0 place-items-center rounded-full text-sm font-bold",
                          done && "bg-ink text-lime",
                          current && "animate-pulse-dot bg-lime text-ink",
                          !done && !current && "bg-surface text-[#8a90a0] ring-1 ring-line",
                        )}
                      >
                        {done ? <Check className="size-4" strokeWidth={3} aria-hidden /> : index + 1}
                      </span>
                      {!last && <span className={cn("my-1 min-h-7 w-0.5 flex-1", done ? "bg-ink" : "bg-line")} />}
                    </div>
                    <div className="flex flex-col gap-1 pb-7">
                      <b className={cn("text-[17px]", done || current ? "text-ink" : "text-[#8a90a0]")}>{title}</b>
                      <span className="text-sm text-muted">{sub}</span>
                    </div>
                  </motion.li>
                );
              })}
            </ol>
          </section>

          <aside className="flex min-w-0 flex-[1_1_340px] flex-col gap-4">
            <div className="flex flex-col gap-4 rounded-[28px] bg-white p-6 ring-1 ring-line">
              <div className="flex items-center gap-3.5">
                <span className="grid size-[76px] shrink-0 place-items-center rounded-[18px] bg-brand-soft">
                  <Image src={data.image} alt="" width={52} height={66} className="h-16 w-auto" />
                </span>
                <span>
                  <b className="text-[17px]">{data.item}</b>
                  <br />
                  <span className="text-sm text-muted">{data.itemSub}</span>
                </span>
              </div>
              <dl className="flex flex-col gap-3 border-t border-line pt-4 text-sm">
                {[
                  [data.etaLabel, "[DATE / TIME]"],
                  ["Location", "[STORE]"],
                  ["Amount", "R [AMOUNT]"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <dt className="text-muted">{k}</dt>
                    <dd className="font-semibold">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="flex flex-col gap-3 rounded-[28px] bg-ink p-6 text-white">
              <b className="font-display text-xl">Need a hand?</b>
              <span className="text-sm leading-relaxed text-muted-dark">Message us with your reference and we&apos;ll update you right away.</span>
              <ButtonLink href={routes.contact} className="self-start bg-green-600 hover:bg-green-700">
                <MessageCircle className="size-[18px]" aria-hidden /> WhatsApp us
              </ButtonLink>
            </div>
          </aside>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
