"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { PaperPlaneTilt } from "@phosphor-icons/react";

import { ChoiceButton } from "@/components/ui/ChoiceButton";
import { Field, TextAreaField } from "@/components/ui/Field";
import { SuccessCheck } from "@/components/ui/SuccessCheck";
import { api, errorMessage } from "@/lib/api";

const topics = [
  { label: "Buying a device", placeholder: "Which phone are you interested in?" },
  { label: "Repair", placeholder: "What happened to your device?" },
  { label: "Trade-in", placeholder: "Which device would you like to trade in?" },
  { label: "My order", placeholder: "Your order number and question" },
  { label: "Something else", placeholder: "How can we help?" },
];

export function ContactForm() {
  const [topic, setTopic] = useState(0);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const f = new FormData(event.currentTarget);
    setBusy(true);
    setError("");
    try {
      await api("/store/contact", {
        method: "POST",
        body: { topic: topics[topic].label, name: String(f.get("name") ?? ""), contact: String(f.get("contact") ?? ""), message: String(f.get("message") ?? "") },
      });
      setSent(true);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="min-w-0 flex-[999_1_520px] rounded-panel bg-white p-6 ring-1 ring-line sm:p-11" aria-labelledby="contact-form-title">
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex min-h-[420px] flex-col items-start justify-center gap-3.5"
          >
            <SuccessCheck />
            <h2 id="contact-form-title" className="text-4xl font-bold">
              Message sent!
            </h2>
            <p className="text-base text-muted">Thanks — we&apos;ll get back to you shortly.</p>
            <button type="button" onClick={() => setSent(false)} className="min-h-11 font-semibold underline underline-offset-4">
              Send another
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleSubmit}
            className="flex flex-col gap-[18px]"
          >
            <div>
              <h2 id="contact-form-title" className="text-[clamp(1.75rem,3.2vw,2.375rem)] font-bold">
                Send us a message
              </h2>
              <p className="mt-1.5 text-muted">We usually reply within minutes during store hours.</p>
            </div>
            <fieldset>
              <legend className="mb-2.5 text-[13px] font-semibold">What&apos;s it about?</legend>
              <div className="flex flex-wrap gap-2">
                {topics.map((t, index) => (
                  <ChoiceButton key={t.label} variant="pill" selected={topic === index} onClick={() => setTopic(index)}>
                    {t.label}
                  </ChoiceButton>
                ))}
              </div>
            </fieldset>
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Name" name="name" required autoComplete="name" />
              <Field label="Phone or email" name="contact" required />
            </div>
            <TextAreaField label="Message" name="message" rows={5} required placeholder={topics[topic].placeholder} />
            {error ? (
              <p role="alert" className="rounded-xl bg-[#fee2e2] px-4 py-3 text-sm font-semibold text-[#b91c1c]">
                {error}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={busy}
              className="group inline-flex min-h-14 items-center gap-3 self-start rounded-full bg-ink pl-7 pr-2 text-base font-semibold text-white transition-colors hover:bg-[#333333] disabled:opacity-60"
            >
              {busy ? "Sending…" : "Send message"}
              <span className="grid size-10 place-items-center rounded-full bg-accent text-ink transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <PaperPlaneTilt className="size-5" weight="fill" aria-hidden />
              </span>
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </section>
  );
}
