"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { Check, Wrench } from "lucide-react";

import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

import { ButtonLink } from "@/components/ui/ButtonLink";
import { Breadcrumbs } from "@/components/ui/PageHero";
import { routes } from "@/data/site";
import { api, errorMessage } from "@/lib/api";
import { formatZar } from "@/lib/money";
import { cn } from "@/lib/utils";

type Kind = "order" | "repair";

const labels = {
  order: { word: "order", refLabel: "Order number", placeholder: "VE-10000", etaLabel: "Placed" },
  repair: { word: "repair", refLabel: "Repair reference", placeholder: "RP-3000", etaLabel: "Booked" },
} as const;

interface TrackResult {
  kind: Kind;
  ref: string;
  status: string;
  cancelled: boolean;
  title: string;
  steps: [string, string][];
  /** Index of the step in progress; steps before it are done. -1 for cancelled orders. */
  current: number;
  item: string;
  itemSub: string;
  image: string;
  amount: number;
  placedAt: string;
  location: string;
}

const dateLabel = (iso: string) => new Date(iso).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" });

/** Looks up an order or repair. The reference must be paired with the email used when placing it. */
export function TrackOrder() {
  const [kind, setKind] = useState<Kind>("order");
  const [result, setResult] = useState<TrackResult | null>(null);
  const [searchKey, setSearchKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const text = labels[kind];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const f = new FormData(event.currentTarget);
    const ref = String(f.get("ref") ?? "").trim();
    const email = String(f.get("email") ?? "").trim();
    setLoading(true);
    setError("");
    try {
      const data = await api<TrackResult>(`/store/track?${new URLSearchParams({ kind, ref, email })}`);
      setResult(data);
      setSearchKey((k) => k + 1);
    } catch (e) {
      setResult(null);
      setError(errorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  function switchKind(next: Kind) {
    setKind(next);
    setResult(null);
    setError("");
  }

  return (
    <>
      <section className="surface-glow relative overflow-hidden rounded-panel p-6 text-ink ring-1 ring-line sm:p-12 lg:p-16">
        <div aria-hidden className="absolute -right-44 -top-60 size-[640px] animate-spin-slow rounded-full border border-dashed border-brand/10" />
        <div aria-hidden className="absolute -bottom-20 right-28 size-72 rounded-full bg-white opacity-[0.16] blur-[80px]" />
        <div aria-hidden className="absolute -bottom-10 left-20 size-56 rounded-full bg-white opacity-[0.18] blur-[90px]" />
        <div className="relative flex max-w-[760px] flex-col gap-5">
          <Breadcrumbs items={[{ label: "Home", href: routes.home }, { label: "Track order" }]} tone="light" />
          <h1 className="animate-fade-up text-[clamp(2.5rem,5.2vw,4.5rem)] font-bold leading-none">
            Where&apos;s my <span className="text-brand">{text.word}?</span>
          </h1>
          <p className="text-[17px] leading-relaxed text-muted">Enter your reference number and the email you used — we&apos;ll show you live progress.</p>

          <LayoutGroup id="track-kind">
            <div role="tablist" aria-label="What are you tracking?" className="flex w-fit gap-1.5 rounded-[14px] border border-line bg-surface p-[5px]">
              {(["order", "repair"] as const).map((k) => (
                <button
                  key={k}
                  type="button"
                  role="tab"
                  aria-selected={kind === k}
                  onClick={() => switchKind(k)}
                  className={cn("relative min-h-[42px] rounded-[10px] px-5 text-sm font-semibold capitalize", kind === k ? "text-ink" : "text-muted")}
                >
                  {kind === k && <motion.span layoutId="track-tab" className="absolute inset-0 rounded-[10px] bg-accent" />}
                  <span className="relative">{k}</span>
                </button>
              ))}
            </div>
          </LayoutGroup>

          <form onSubmit={handleSubmit} className="flex flex-wrap gap-2.5 rounded-[20px] bg-white p-2">
            <label className="flex flex-[1_1_180px] flex-col justify-center px-3 py-1">
              <span className="text-[11px] font-bold uppercase tracking-[0.06em] text-muted">{text.refLabel}</span>
              <input name="ref" required placeholder={text.placeholder} className="h-[30px] bg-transparent text-base text-ink uppercase placeholder:normal-case focus:outline-none" />
            </label>
            <label className="flex flex-[1_1_220px] flex-col justify-center px-3 py-1">
              <span className="text-[11px] font-bold uppercase tracking-[0.06em] text-muted">Email</span>
              <input name="email" type="email" required placeholder="you@example.com" autoComplete="email" className="h-[30px] bg-transparent text-base text-ink focus:outline-none" />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="min-h-14 rounded-[14px] bg-ink px-7 text-base font-bold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-60"
            >
              {loading ? "Checking…" : "Track"}
            </button>
          </form>
          {error ? (
            <p role="alert" className="rounded-xl bg-[#fee2e2] px-4 py-3 text-sm font-semibold text-[#b91c1c]">
              {error}
            </p>
          ) : null}
        </div>
      </section>

      <AnimatePresence mode="wait">
        {result ? (
          <motion.div
            key={`${result.ref}-${searchKey}`}
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
                    {labels[result.kind].refLabel} <b className="text-ink">{result.ref}</b>
                  </span>
                  <h2 className="mt-1.5 text-[clamp(1.625rem,3vw,2.25rem)] font-bold">{result.title}</h2>
                </div>
              </div>

              {result.cancelled ? (
                <p className="rounded-2xl bg-surface p-5 text-[15px] text-muted">
                  This order was cancelled. If you did not ask for this, please contact us and we&apos;ll sort it out.
                </p>
              ) : (
                <ol>
                  {result.steps.map(([title, sub], index) => {
                    const done = index < result.current;
                    const current = index === result.current;
                    const last = index === result.steps.length - 1;
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
                              done && "bg-brand text-white",
                              current && "animate-pulse-dot bg-accent text-ink",
                              !done && !current && "bg-surface text-[#8a90a0] ring-1 ring-line",
                            )}
                          >
                            {done ? <Check className="size-4" strokeWidth={3} aria-hidden /> : index + 1}
                          </span>
                          {!last && <span className={cn("my-1 min-h-7 w-0.5 flex-1", done ? "bg-brand" : "bg-line")} />}
                        </div>
                        <div className="flex flex-col gap-1 pb-7">
                          <b className={cn("text-[17px]", done || current ? "text-ink" : "text-[#8a90a0]")}>{title}</b>
                          <span className="text-sm text-muted">{sub}</span>
                        </div>
                      </motion.li>
                    );
                  })}
                </ol>
              )}
            </section>

            <aside className="flex min-w-0 flex-[1_1_340px] flex-col gap-4">
              <div className="flex flex-col gap-4 rounded-[28px] bg-white p-6 ring-1 ring-line">
                <div className="flex items-center gap-3.5">
                  <span className="grid size-[76px] shrink-0 place-items-center rounded-[18px] bg-brand-soft">
                    {result.image ? <Image src={result.image} alt="" width={52} height={66} className="h-16 w-auto" /> : <Wrench className="size-8" aria-hidden />}
                  </span>
                  <span>
                    <b className="text-[17px]">{result.item}</b>
                    <br />
                    <span className="text-sm text-muted">{result.itemSub}</span>
                  </span>
                </div>
                <dl className="flex flex-col gap-3 border-t border-line pt-4 text-sm">
                  {[
                    [labels[result.kind].etaLabel, dateLabel(result.placedAt)],
                    [result.kind === "order" ? "Delivery" : "Drop-off", result.location],
                    [result.kind === "order" ? "Total" : "Estimate", result.amount > 0 ? formatZar(result.amount) : "After diagnosis"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-4">
                      <dt className="text-muted">{k}</dt>
                      <dd className="text-right font-semibold">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="flex flex-col gap-3 rounded-[28px] bg-white p-6 ring-1 ring-line">
                <b className="font-display text-xl">Need a hand?</b>
                <span className="text-sm leading-relaxed text-muted">Message us with your reference and we&apos;ll update you right away.</span>
                <ButtonLink href={routes.contact} className="self-start bg-green-600 hover:bg-green-700">
                  <WhatsAppIcon className="size-[18px]" /> WhatsApp us
                </ButtonLink>
              </div>
            </aside>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
