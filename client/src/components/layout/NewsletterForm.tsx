"use client";

import { useState, type FormEvent } from "react";
import { Check } from "lucide-react";

import { api, errorMessage } from "@/lib/api";

export function NewsletterForm() {
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get("email") ?? "").trim();
    setBusy(true);
    setError("");
    try {
      await api("/store/newsletter", { method: "POST", body: { email } });
      setSubmitted(true);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-wrap gap-2">
      <label className="flex min-w-[220px] flex-1 flex-col gap-1.5 text-xs">
        Email address
        <input
          type="email"
          name="email"
          required
          placeholder="you@example.com"
          className="h-[52px] rounded-2xl border border-line bg-white px-4 text-[15px] text-ink placeholder:text-muted focus:border-accent focus:outline-none"
        />
      </label>
      <button
        type="submit"
        disabled={busy || submitted}
        className="inline-flex h-[52px] items-center gap-2 self-end rounded-2xl bg-white px-6 font-bold text-ink transition-transform hover:-translate-y-0.5 disabled:opacity-80"
      >
        {submitted ? (
          <>
            <Check className="size-4" aria-hidden /> Subscribed
          </>
        ) : busy ? (
          "Subscribing…"
        ) : (
          "Subscribe"
        )}
      </button>
      {error ? (
        <p role="alert" className="basis-full text-xs font-semibold text-[#fca5a5]">
          {error}
        </p>
      ) : null}
    </form>
  );
}
