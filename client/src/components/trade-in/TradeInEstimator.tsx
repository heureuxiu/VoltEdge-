"use client";

import { useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";

import { ChoiceButton } from "@/components/ui/ChoiceButton";
import { Field } from "@/components/ui/Field";
import { routes } from "@/data/site";
import {
  gradeFromAnswers,
  tradeInModels,
  tradeInQuestions,
  tradeInStorage,
  type TradeInAnswers,
} from "@/data/trade-in";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { api, errorMessage } from "@/lib/api";
import { formatZar } from "@/lib/money";
import { cn } from "@/lib/utils";

export function TradeInEstimator() {
  const [model, setModel] = useState(tradeInModels[1]);
  const [storage, setStorage] = useState(tradeInStorage[1]);
  const [answers, setAnswers] = useState<TradeInAnswers>({ cracked: false, damage: false, powers: true });

  const grade = gradeFromAnswers(answers);
  // The latest answer from the server, tagged with the inputs it was computed for.
  const [result, setResult] = useState<{ key: string; min?: number; max?: number; failed?: boolean } | null>(null);
  const key = `${model}|${storage}|${answers.cracked}|${answers.damage}|${answers.powers}`;
  const current = result?.key === key ? result : null;
  const estimate = current && current.min !== undefined && current.max !== undefined ? { min: current.min, max: current.max } : null;
  const estimateError = !!current?.failed;
  const [requesting, setRequesting] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sentRef, setSentRef] = useState("");

  // Ask the server for the credit range whenever the device or its condition changes.
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const res = await api<{ min: number; max: number }>("/store/trade-ins/estimate", { method: "POST", body: { model, storage, answers } });
        if (!cancelled) setResult({ key, min: res.min, max: res.max });
      } catch {
        if (!cancelled) setResult({ key, failed: true });
      }
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [key, model, storage, answers]);

  async function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const f = new FormData(event.currentTarget);
    setBusy(true);
    setError("");
    try {
      const res = await api<{ id: string }>("/store/trade-ins", {
        method: "POST",
        body: { model, storage, answers, name: String(f.get("name") ?? "").trim(), email: String(f.get("email") ?? "").trim(), phone: String(f.get("phone") ?? "").trim() },
      });
      setSentRef(res.id);
      setRequesting(false);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative flex min-w-0 flex-[1_1_420px] flex-col gap-5 rounded-[28px] bg-white p-7 text-ink ring-1 ring-line shadow-[0_30px_60px_-30px_rgb(17_17_17/0.15)]">
      <div className="flex items-center justify-between">
        <b className="font-display text-[22px]">Get your estimate</b>
        <span className="rounded-full bg-accent-soft px-2.5 py-1.5 text-xs font-bold">About a minute</span>
      </div>

      <fieldset>
        <legend className="mb-2 text-[13px] font-semibold">Your device</legend>
        <div className="flex flex-wrap gap-2">
          {tradeInModels.map((m) => (
            <ChoiceButton key={m} selected={model === m} onClick={() => setModel(m)} className="min-h-10 text-[13px]">
              {m}
            </ChoiceButton>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-[13px] font-semibold">Storage</legend>
        <div className="grid grid-cols-4 gap-2">
          {tradeInStorage.map((s) => (
            <ChoiceButton key={s} selected={storage === s} onClick={() => setStorage(s)} className="min-h-10 px-2 text-[13px]">
              {s}
            </ChoiceButton>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col">
        {tradeInQuestions.map(({ id, question }) => (
          <div key={id} className="flex items-center justify-between gap-3 border-t border-line py-2.5">
            <span className="text-sm font-medium">{question}</span>
            <span role="radiogroup" aria-label={question} className="flex gap-1 rounded-xl bg-surface p-1">
              {[true, false].map((value) => {
                const on = answers[id] === value;
                return (
                  <button
                    key={String(value)}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setAnswers((prev) => ({ ...prev, [id]: value }))}
                    className={cn("min-h-9 min-w-[52px] rounded-[9px] text-[13px] font-semibold transition-colors", on ? "bg-brand text-white" : "text-ink")}
                  >
                    {value ? "Yes" : "No"}
                  </button>
                );
              })}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[18px] bg-accent-soft p-[18px] text-ink ring-1 ring-accent/40">
        <span>
          <span className="block text-[13px] text-muted">
            Estimated credit ·{" "}
            <AnimatePresence mode="wait">
              <motion.b key={grade} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="inline-block text-ink">
                {grade}
              </motion.b>
            </AnimatePresence>
          </span>
          <b className="font-display text-[28px] text-brand">{estimate ? `${formatZar(estimate.min)} – ${formatZar(estimate.max)}` : estimateError ? "Unavailable" : "…"}</b>
        </span>
        {sentRef ? null : (
          <button
            type="button"
            aria-expanded={requesting}
            disabled={!estimate}
            onClick={() => setRequesting((v) => !v)}
            className="inline-flex min-h-12 items-center justify-center whitespace-nowrap rounded-xl bg-ink px-6 text-[15px] font-semibold text-white transition-colors hover:bg-[#333333] disabled:opacity-50"
          >
            {requesting ? "Cancel" : "Book check-in"}
          </button>
        )}
      </div>

      {sentRef ? (
        <div role="status" className="rounded-[18px] bg-surface p-[18px] text-sm leading-relaxed">
          <b className="block font-display text-lg">Request {sentRef} received</b>
          <span className="text-muted">
            Bring your device and ID to the store for a quick check — we confirm the final value on the spot. You can also{" "}
            <ButtonLink href={routes.contact} variant="outline-dark" className="ml-1 inline-flex min-h-9 rounded-xl px-3 text-xs">
              message us
            </ButtonLink>
          </span>
        </div>
      ) : null}

      {requesting ? (
        <form onSubmit={submitRequest} className="flex flex-col gap-3 rounded-[18px] bg-surface p-[18px]">
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
    </div>
  );
}
