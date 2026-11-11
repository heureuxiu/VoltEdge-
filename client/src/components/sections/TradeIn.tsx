"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";

import { Field } from "@/components/ui/Field";
import { tradeInModels, tradeInStorage, type TradeInAnswers } from "@/data/trade-in";
import { api, errorMessage } from "@/lib/api";
import { formatZar } from "@/lib/money";

/** Each condition maps onto the answers the API grades the device from. */
const conditions: { label: string; answers: TradeInAnswers }[] = [
  { label: "Like new", answers: { cracked: false, damage: false, powers: true } },
  { label: "Good (light scratches)", answers: { cracked: false, damage: true, powers: true } },
  { label: "Cracked", answers: { cracked: true, damage: false, powers: true } },
  { label: "Won't switch on", answers: { cracked: false, damage: false, powers: false } },
];

const selectClassName =
  "h-12 rounded-xl border border-[#d4d4d8] bg-surface px-3.5 text-[15px] font-normal focus:border-brand focus:outline-none";

type Quote = { model: string; storage: string; answers: TradeInAnswers; min: number; max: number };

export function TradeIn() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [asking, setAsking] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sentRef, setSentRef] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const f = new FormData(event.currentTarget);
    const model = String(f.get("device"));
    const storage = String(f.get("storage"));
    const answers = (conditions.find((c) => c.label === f.get("condition")) ?? conditions[0]).answers;

    setBusy(true);
    setError("");
    setSentRef("");
    setAsking(false);
    try {
      const res = await api<{ min: number; max: number }>("/store/trade-ins/estimate", { method: "POST", body: { model, storage, answers } });
      setQuote({ model, storage, answers, min: res.min, max: res.max });
    } catch (e) {
      setQuote(null);
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }

  async function handleRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!quote) return;
    const f = new FormData(event.currentTarget);
    setBusy(true);
    setError("");
    try {
      const res = await api<{ id: string }>("/store/trade-ins", {
        method: "POST",
        body: {
          model: quote.model,
          storage: quote.storage,
          answers: quote.answers,
          name: String(f.get("name") ?? "").trim(),
          email: String(f.get("email") ?? "").trim(),
          phone: String(f.get("phone") ?? "").trim(),
        },
      });
      setSentRef(res.id);
      setAsking(false);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }

  const status = sentRef
    ? `Request ${sentRef} received. Bring your device and ID in-store and we'll confirm the final value.`
    : "Final value confirmed after an in-store check. See our trade-in policy.";

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
        onChange={() => {
          // Changing any input makes the shown quote stale.
          if (quote || sentRef) {
            setQuote(null);
            setAsking(false);
            setSentRef("");
          }
        }}
        className="relative flex flex-[1_1_400px] flex-col gap-4 rounded-card bg-surface p-7 text-ink ring-1 ring-line"
      >
        <b className="font-display text-[22px]">Get a quick quote</b>
        <label className="flex flex-col gap-1.5 text-[13px] font-semibold">
          Device
          <select name="device" defaultValue={tradeInModels[1]} className={selectClassName}>
            {tradeInModels.map((d) => <option key={d}>{d}</option>)}
          </select>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5 text-[13px] font-semibold">
            Storage
            <select name="storage" defaultValue={tradeInStorage[1]} className={selectClassName}>
              {tradeInStorage.map((s) => <option key={s}>{s}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-[13px] font-semibold">
            Condition
            <select name="condition" className={selectClassName}>
              {conditions.map((c) => <option key={c.label}>{c.label}</option>)}
            </select>
          </label>
        </div>
        <button
          type="submit"
          disabled={busy}
          className="h-[52px] rounded-[14px] bg-accent text-base font-bold text-ink transition-transform hover:-translate-y-0.5 disabled:opacity-60"
        >
          {busy && !asking ? "Calculating…" : "Get my estimate"}
        </button>

        {error && !asking ? (
          <p role="alert" className="rounded-xl bg-[#fee2e2] px-4 py-3 text-sm font-semibold text-[#b91c1c]">
            {error}
          </p>
        ) : null}

        {quote && !sentRef ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-[18px] bg-accent-soft p-[18px] ring-1 ring-accent/40">
            <span>
              <span className="block text-[13px] text-muted">Estimated credit</span>
              <b className="font-display text-[26px] text-brand">
                {formatZar(quote.min)} – {formatZar(quote.max)}
              </b>
            </span>
            <button
              type="button"
              aria-expanded={asking}
              onClick={() => setAsking((v) => !v)}
              className="inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-xl bg-ink px-5 text-[15px] font-semibold text-white transition-colors hover:bg-[#333333]"
            >
              {asking ? "Cancel" : "Book check-in"}
            </button>
          </div>
        ) : null}

        <AnimatePresence initial={false} mode="wait">
          <motion.span
            key={sentRef ? "done" : quote ? "quote" : "idle"}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="text-xs text-muted"
            role="status"
          >
            {status}
          </motion.span>
        </AnimatePresence>
      </form>

      {asking && quote ? (
        <form onSubmit={handleRequest} className="relative flex w-full flex-col gap-3 rounded-card bg-surface p-7 ring-1 ring-line">
          <b className="font-display text-lg">Where can we reach you?</b>
          <Field label="Full name" name="name" required autoComplete="name" />
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Email" name="email" type="email" required autoComplete="email" />
            <Field label="Phone / WhatsApp" name="phone" type="tel" required autoComplete="tel" />
          </div>
          {error ? (
            <p role="alert" className="rounded-xl bg-[#fee2e2] px-4 py-3 text-sm font-semibold text-[#b91c1c]">
              {error}
            </p>
          ) : null}
          <button type="submit" disabled={busy} className="min-h-12 rounded-xl bg-accent px-6 text-[15px] font-bold text-ink transition-colors hover:bg-[#ffd24d] disabled:opacity-60">
            {busy ? "Sending…" : "Send trade-in request"}
          </button>
        </form>
      ) : null}
    </section>
  );
}
