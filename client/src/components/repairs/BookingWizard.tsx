"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

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
  const toggleIssue = (issue: string) =>
    setIssues((prev) => (prev.includes(issue) ? prev.filter((i) => i !== issue) : [...prev, issue]));

  const deviceLabel = bookingDevices[device].models[model];
  const issueLabel = issues.length === 0 ? "None yet" : issues.length === 1 ? issues[0] : `${issues.length} selected`;
  const whenLabel = `${days[day].top} ${days[day].day} · ${bookingSlots[slot]}`;

  return (
    <>
      <section className="relative mb-6 overflow-hidden rounded-panel bg-[#e4ebff] px-6 py-8 text-ink ring-1 ring-[#d3defc] sm:px-12 sm:py-10">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-8">
          <div className="flex flex-col gap-4">
            <Breadcrumbs tone="light" items={[{ label: "Home", href: routes.home }, { label: "Repairs", href: routes.repairs }, { label: "Book a repair" }]} />
            <h1 className="text-[clamp(2.125rem,4.4vw,3.5rem)] font-bold leading-none">
              Book a <span className="text-hero">repair</span>
            </h1>
            <p className="max-w-[420px] text-[17px] leading-relaxed text-ink/65">Four quick steps. Free diagnosis, and you only pay after the repair.</p>
          </div>

          <ol className="flex w-full max-w-[560px] flex-[1_1_360px] items-start" aria-label="Booking progress">
            {STEP_NAMES.map((name, index) => {
              const complete = index < step || done;
              const current = index === step && !done;
              return (
                <li key={name} className="relative flex flex-1 flex-col items-center gap-2 text-center">
                  {index > 0 && (
                    <span aria-hidden className="absolute right-1/2 top-[19px] h-0.5 w-full bg-white">
                      <motion.span className="block h-full bg-ink" initial={false} animate={{ width: complete || current ? "100%" : "0%" }} transition={{ duration: 0.4 }} />
                    </span>
                  )}
                  <span
                    aria-current={current ? "step" : undefined}
                    className={cn(
                      "relative z-10 grid size-10 place-items-center rounded-full text-sm font-bold transition-colors duration-300",
                      complete ? "bg-ink text-white" : current ? "bg-accent text-ink ring-4 ring-white" : "bg-white text-muted",
                    )}
                  >
                    {complete ? <Check className="size-4" strokeWidth={3} aria-hidden /> : index + 1}
                  </span>
                  <span className={cn("text-xs font-semibold", current || complete ? "text-ink" : "text-muted")}>{name}</span>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <div className="flex flex-wrap items-start gap-6">
        <section className="flex min-w-0 flex-[999_1_560px] flex-col gap-6 rounded-panel bg-white p-6 ring-1 ring-line sm:p-10">
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
                    {bookingDevices.map(({ label }, index) => (
                      <ChoiceButton
                        key={label}
                        variant="card"
                        selected={device === index}
                        onClick={() => {
                          setDevice(index);
                          setModel(0);
                        }}
                        className="flex min-h-[84px] items-center"
                      >
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
                        <ChoiceButton key={issue} variant="card" selected={on} onClick={() => toggleIssue(issue)} className="flex min-h-[76px] items-center gap-3.5">
                          <span className={cn("grid size-6 shrink-0 place-items-center rounded-[7px]", on ? "bg-ink text-white" : "bg-surface text-transparent ring-1 ring-line")}>
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
            <div className="flex items-center justify-between gap-3 border-t border-line pt-6">
              <button
                type="button"
                disabled={step === 0}
                onClick={() => setStep((s) => s - 1)}
                className="inline-flex min-h-[54px] items-center gap-2 rounded-full px-5 font-semibold transition-colors hover:bg-surface disabled:pointer-events-none disabled:opacity-35"
              >
                <ArrowLeft className="size-[18px]" aria-hidden /> Back
              </button>
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                className="group inline-flex min-h-[56px] items-center gap-3 rounded-full bg-ink pl-7 pr-2 text-base font-semibold text-white transition-colors hover:bg-[#333333]"
              >
                {step === 3 ? "Confirm booking" : "Continue"}
                <span className="grid size-10 place-items-center rounded-full bg-accent text-ink transition-transform duration-300 group-hover:translate-x-0.5">
                  {step === 3 ? <Check className="size-5" strokeWidth={2.6} aria-hidden /> : <ArrowRight className="size-5" strokeWidth={2.4} aria-hidden />}
                </span>
              </button>
            </div>
          )}
        </section>

        <aside
          aria-label="Booking summary"
          className="relative flex min-w-0 flex-[1_1_320px] flex-col gap-5 rounded-panel bg-[#fff1b8] p-8 text-ink ring-1 ring-[#f3dd8a] lg:sticky lg:top-28"
        >
          <b className="font-display text-[22px]">Your booking</b>
          <dl className="flex flex-col gap-3.5 text-[15px]">
            <SummaryRow label="Device" value={deviceLabel} />
            <SummaryRow label="Issues" value={issueLabel} />
            <SummaryRow label="Method" value={bookingMethods[method].label} />
            <SummaryRow label="When" value={whenLabel} />
          </dl>
          <div className="flex items-baseline justify-between border-t border-[#f3dd8a] pt-4">
            <span className="text-ink/65">Estimated from</span>
            <b className="font-display text-[28px]">R [EST]</b>
          </div>
          <ul className="flex flex-col gap-3 rounded-2xl bg-white/70 p-4 text-sm">
            {["Free diagnosis & quote first", "90-day warranty on parts & labour", "Pay after the repair"].map((item) => (
              <li key={item} className="flex items-center gap-2.5">
                <span className="grid size-5 shrink-0 place-items-center rounded-full bg-ink text-white">
                  <Check className="size-3" strokeWidth={3} aria-hidden />
                </span>
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
      <h2 className="font-display text-[clamp(1.75rem,3vw,2.25rem)] font-bold leading-tight">{title}</h2>
      <p className="mt-1.5 text-[17px] text-muted">{subtitle}</p>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-ink/65">{label}</dt>
      <dd className="text-right font-semibold">{value}</dd>
    </div>
  );
}
