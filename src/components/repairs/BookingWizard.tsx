"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check } from "lucide-react";

import { ButtonLink } from "@/components/ui/ButtonLink";
import { ChoiceButton } from "@/components/ui/ChoiceButton";
import { Field, TextAreaField } from "@/components/ui/Field";
import { Breadcrumbs } from "@/components/ui/PageHero";
import { SuccessCheck } from "@/components/ui/SuccessCheck";
import { bookingDevices, bookingIssues, bookingMethods, bookingSlots } from "@/data/repairs";
import { routes } from "@/data/site";
import { cn } from "@/lib/utils";

const STEP_NAMES = ["Device", "Issue", "Date & time", "Your details"];

/** Next six booking days, starting today. */
function upcomingDays(count = 6) {
  const formatter = new Intl.DateTimeFormat("en-ZA", { weekday: "short" });
  return Array.from({ length: count }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return { top: i === 0 ? "Today" : formatter.format(date), day: String(date.getDate()) };
  });
}

export function BookingWizard() {
  const [step, setStep] = useState(0);
  const [device, setDevice] = useState(0);
  const [model, setModel] = useState(0);
  const [issues, setIssues] = useState<string[]>([bookingIssues[0]]);
  const [method, setMethod] = useState(0);
  const [day, setDay] = useState(0);
  const [slot, setSlot] = useState(2);
  const [days] = useState(upcomingDays);

  const done = step >= STEP_NAMES.length;
  const progress = Math.round((Math.min(step, 4) / 4) * 100);
  const toggleIssue = (issue: string) =>
    setIssues((prev) => (prev.includes(issue) ? prev.filter((i) => i !== issue) : [...prev, issue]));

  const deviceLabel = bookingDevices[device].models[model];
  const issueLabel = issues.length === 0 ? "None yet" : issues.length === 1 ? issues[0] : `${issues.length} selected`;
  const whenLabel = `${days[day].top} ${days[day].day} · ${bookingSlots[slot]}`;

  return (
    <>
      <div className="mb-2.5">
        <Breadcrumbs tone="light" items={[{ label: "Home", href: routes.home }, { label: "Repairs", href: routes.repairs }, { label: "Book a repair" }]} />
      </div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-5">
        <h1 className="text-[clamp(2.125rem,4vw,3.25rem)] font-bold leading-none">Book a repair</h1>
        <div className="max-w-[520px] flex-[1_1_320px]">
          <div className="mb-2 flex justify-between text-[13px] font-semibold">
            <span>
              Step {Math.min(step + 1, 4)} of 4 · {done ? "Done" : STEP_NAMES[step]}
            </span>
            <span className="text-muted">{progress}%</span>
          </div>
          <div role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} className="h-2 overflow-hidden rounded bg-line">
            <motion.div className="h-full rounded bg-ink" animate={{ width: `${Math.max(progress, 6)}%` }} transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }} />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-start gap-6">
        <section className="flex min-w-0 flex-[999_1_560px] flex-col gap-6 rounded-panel bg-white p-6 ring-1 ring-line sm:p-11">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
              className="flex flex-col gap-5"
            >
              {step === 0 && (
                <>
                  <StepTitle title="Which device?" subtitle="Pick the type, then the model." />
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3">
                    {bookingDevices.map(({ icon: Icon, label }, index) => (
                      <ChoiceButton
                        key={label}
                        variant="card"
                        selected={device === index}
                        onClick={() => {
                          setDevice(index);
                          setModel(0);
                        }}
                        className="flex min-h-[120px] flex-col justify-between gap-3.5"
                      >
                        <Icon className="size-[26px]" strokeWidth={1.8} aria-hidden />
                        <b className="text-[15px]">{label}</b>
                      </ChoiceButton>
                    ))}
                  </div>
                  <fieldset>
                    <legend className="mb-2.5 text-[13px] font-semibold">Model</legend>
                    <div className="flex flex-wrap gap-2">
                      {bookingDevices[device].models.map((m, index) => (
                        <ChoiceButton key={m} selected={model === index} onClick={() => setModel(index)}>
                          {m}
                        </ChoiceButton>
                      ))}
                    </div>
                  </fieldset>
                </>
              )}

              {step === 1 && (
                <>
                  <StepTitle title="What's wrong?" subtitle="Select everything that applies." />
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3">
                    {bookingIssues.map((issue) => {
                      const on = issues.includes(issue);
                      return (
                        <ChoiceButton key={issue} variant="card" selected={on} onClick={() => toggleIssue(issue)} className="flex min-h-[72px] items-center gap-3">
                          <span className={cn("grid size-6 shrink-0 place-items-center rounded-[7px]", on ? "bg-lime text-ink" : "bg-surface text-transparent")}>
                            <Check className="size-3.5" strokeWidth={3} aria-hidden />
                          </span>
                          <span>
                            <b className="block text-[15px]">{issue}</b>
                            <span className="block text-xs opacity-70">From R [PRICE]</span>
                          </span>
                        </ChoiceButton>
                      );
                    })}
                  </div>
                  <TextAreaField label="Anything else we should know? (optional)" rows={3} placeholder="e.g. dropped it yesterday, touch not working at the top" />
                </>
              )}

              {step === 2 && (
                <>
                  <StepTitle title="When suits you?" subtitle="Choose drop-off or collection, then a slot." />
                  <div className="grid gap-3 md:grid-cols-2">
                    {bookingMethods.map((m, index) => (
                      <ChoiceButton key={m.label} variant="card" selected={method === index} onClick={() => setMethod(index)}>
                        <b className="block text-base">{m.label}</b>
                        <span className="mt-1 block text-[13px] opacity-75">{m.description}</span>
                      </ChoiceButton>
                    ))}
                  </div>
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-2">
                    {days.map((d, index) => (
                      <ChoiceButton key={d.top + d.day} selected={day === index} onClick={() => setDay(index)} className="min-h-[68px] rounded-[14px]">
                        <span className="block text-xs font-normal opacity-70">{d.top}</span>
                        <b className="block font-display text-lg">{d.day}</b>
                      </ChoiceButton>
                    ))}
                  </div>
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-2">
                    {bookingSlots.map((s, index) => (
                      <ChoiceButton key={s} selected={slot === index} onClick={() => setSlot(index)} className="min-h-12">
                        {s}
                      </ChoiceButton>
                    ))}
                  </div>
                </>
              )}

              {step === 3 && (
                <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">
                  <StepTitle title="Your details" subtitle="We'll confirm your booking on WhatsApp." />
                  <div className="grid gap-3 md:grid-cols-2">
                    <Field label="Full name" autoComplete="name" />
                    <Field label="WhatsApp number" type="tel" autoComplete="tel" />
                    <Field label="Email" type="email" autoComplete="email" wrapperClassName="md:col-span-2" />
                  </div>
                  <label className="flex items-start gap-2.5 text-sm leading-normal text-muted">
                    <input type="checkbox" className="mt-0.5 size-[18px] accent-ink" />
                    I&apos;ve backed up my device and agree to the repair terms.
                  </label>
                </form>
              )}

              {done && (
                <div className="flex flex-col items-start gap-4 py-3">
                  <SuccessCheck />
                  <h2 className="text-[clamp(1.875rem,4vw,2.75rem)] font-bold">You&apos;re booked in!</h2>
                  <p className="max-w-[520px] text-[17px] leading-relaxed text-muted">
                    Booking reference <b className="text-ink">RP-[REF]</b>. We&apos;ve sent the details to your WhatsApp — see you{" "}
                    {whenLabel}.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <ButtonLink href={routes.track}>Track this repair</ButtonLink>
                    <ButtonLink href={routes.home} variant="outline-dark">
                      Back to home
                    </ButtonLink>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {!done && (
            <div className="flex justify-between gap-3 border-t border-line pt-5">
              <button
                type="button"
                disabled={step === 0}
                onClick={() => setStep((s) => s - 1)}
                className="min-h-[54px] rounded-[14px] bg-surface px-5 font-semibold disabled:opacity-40"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                className="min-h-[54px] rounded-[14px] bg-lime px-7 text-base font-bold text-ink transition-transform hover:-translate-y-0.5"
              >
                {step === 3 ? "Confirm booking" : "Continue"}
              </button>
            </div>
          )}
        </section>

        <aside aria-label="Booking summary" className="relative flex min-w-0 flex-[1_1_320px] flex-col gap-[18px] overflow-hidden rounded-panel bg-ink p-8 text-white">
          <div aria-hidden className="absolute -right-36 -top-36 size-[360px] animate-spin-slow rounded-full border border-dashed border-white/12" />
          <b className="relative font-display text-[22px]">Your booking</b>
          <dl className="relative flex flex-col gap-3.5 text-[15px]">
            <SummaryRow label="Device" value={deviceLabel} />
            <SummaryRow label="Issues" value={issueLabel} />
            <SummaryRow label="Method" value={bookingMethods[method].label} />
            <SummaryRow label="When" value={whenLabel} />
          </dl>
          <div className="relative flex items-baseline justify-between border-t border-white/12 pt-4">
            <span className="text-muted-dark">Estimated from</span>
            <b className="font-display text-[28px] text-lime">R [EST]</b>
          </div>
          <ul className="relative flex flex-col gap-2.5 text-sm text-[#e9ebf0]">
            {["Free diagnosis & quote first", "90-day warranty on parts & labour", "Pay after the repair"].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-lime" />
                {item}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </>
  );
}

function StepTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <h2 className="text-[28px] font-bold">{title}</h2>
      <p className="mt-1.5 text-muted">{subtitle}</p>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-muted-dark">{label}</dt>
      <dd className="text-right font-semibold">{value}</dd>
    </div>
  );
}
