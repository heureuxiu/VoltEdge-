"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { ButtonLink } from "@/components/ui/ButtonLink";
import { ChoiceButton } from "@/components/ui/ChoiceButton";
import { routes } from "@/data/site";
import {
  gradeFromAnswers,
  tradeInModels,
  tradeInQuestions,
  tradeInStorage,
  type TradeInAnswers,
} from "@/data/trade-in";
import { cn } from "@/lib/utils";

export function TradeInEstimator() {
  const [model, setModel] = useState(tradeInModels[1]);
  const [storage, setStorage] = useState(tradeInStorage[1]);
  const [answers, setAnswers] = useState<TradeInAnswers>({ cracked: false, damage: false, powers: true });

  const grade = gradeFromAnswers(answers);

  return (
    <div className="relative flex min-w-0 flex-[1_1_420px] flex-col gap-5 rounded-[28px] bg-white p-7 text-ink ring-1 ring-line shadow-[0_30px_60px_-30px_rgb(11_12_16/0.15)]">
      <div className="flex items-center justify-between">
        <b className="font-display text-[22px]">Get your estimate</b>
        <span className="rounded-full bg-lime-soft px-2.5 py-1.5 text-xs font-bold">About a minute</span>
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
                    className={cn("min-h-9 min-w-[52px] rounded-[9px] text-[13px] font-semibold transition-colors", on ? "bg-ink text-white" : "text-ink")}
                  >
                    {value ? "Yes" : "No"}
                  </button>
                );
              })}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[18px] bg-lime-soft p-[18px] text-ink ring-1 ring-lime/40">
        <span>
          <span className="block text-[13px] text-muted">
            Estimated credit ·{" "}
            <AnimatePresence mode="wait">
              <motion.b key={grade} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="inline-block text-ink">
                {grade}
              </motion.b>
            </AnimatePresence>
          </span>
          <b className="font-display text-[28px] text-lime-dark">R [MIN] – R [MAX]</b>
        </span>
        <ButtonLink href={routes.bookRepair} variant="lime" className="whitespace-nowrap rounded-xl">
          Book check-in
        </ButtonLink>
      </div>
    </div>
  );
}
