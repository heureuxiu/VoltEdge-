"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";

const devices = ["iPhone 16 Pro", "iPhone 15", "Samsung Galaxy S24", "Other device"];
const storageOptions = ["128GB", "256GB", "512GB"];
const conditions = ["Like new", "Good", "Cracked"];

const selectClassName =
  "h-12 rounded-xl border border-[#d4d4d8] bg-surface px-3.5 text-[15px] font-normal focus:border-brand focus:outline-none";

export function TradeIn() {
  const [requested, setRequested] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // TODO: send the form values to your quote endpoint.
    setRequested(true);
  }

  return (
    <section
      id="trade-in"
      className="relative mt-4 flex scroll-mt-28 flex-wrap items-center gap-12 overflow-hidden rounded-panel surface-glow p-7 text-ink ring-1 ring-line sm:p-12 lg:p-16"
      aria-labelledby="trade-title"
    >
      <div aria-hidden className="absolute -bottom-64 -left-48 size-[520px] animate-spin-slow rounded-full border border-dashed border-ink/10" />
      <div aria-hidden className="absolute -top-16 right-10 size-72 rounded-full bg-hero opacity-[0.1] blur-[90px]" />

      <div className="relative flex flex-[1_1_380px] flex-col gap-4">
        <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-hero">Trade-in</span>
        <h2 id="trade-title" className="text-[clamp(2rem,4vw,3.25rem)] font-bold leading-[1.05]">
          What&apos;s your old phone worth?
        </h2>
        <p className="max-w-[440px] text-[17px] leading-relaxed text-muted">
          Get an instant estimate, bring it in for a quick check, and put the credit straight towards your upgrade.
        </p>
        <Link href="#guides" className="text-[15px] font-semibold text-hero hover:underline">
          Read: How much is my old iPhone worth? →
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="relative flex flex-[1_1_400px] flex-col gap-4 rounded-card bg-surface p-7 text-ink ring-1 ring-line"
      >
        <b className="font-display text-[22px]">Get a quick quote</b>
        <label className="flex flex-col gap-1.5 text-[13px] font-semibold">
          Device
          <select name="device" className={selectClassName}>
            {devices.map((d) => <option key={d}>{d}</option>)}
          </select>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5 text-[13px] font-semibold">
            Storage
            <select name="storage" className={selectClassName}>
              {storageOptions.map((s) => <option key={s}>{s}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-[13px] font-semibold">
            Condition
            <select name="condition" className={selectClassName}>
              {conditions.map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
        </div>
        <button
          type="submit"
          className="h-[52px] rounded-[14px] bg-accent text-base font-bold text-ink transition-transform hover:-translate-y-0.5"
        >
          Get my estimate
        </button>
        <AnimatePresence initial={false} mode="wait">
          <motion.span
            key={requested ? "done" : "idle"}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="text-xs text-muted"
            role="status"
          >
            {requested
              ? "Thanks! We'll send your estimate shortly."
              : "Final value confirmed after an in-store check. See our trade-in policy."}
          </motion.span>
        </AnimatePresence>
      </form>
    </section>
  );
}
