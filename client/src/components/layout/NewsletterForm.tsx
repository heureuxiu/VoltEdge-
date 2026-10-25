"use client";

import { useState, type FormEvent } from "react";
import { Check } from "lucide-react";

export function NewsletterForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // TODO: connect to your email provider.
    setSubmitted(true);
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-wrap gap-2">
      <label className="flex min-w-[220px] flex-1 flex-col gap-1.5 text-xs">
        Email address
        <input
          type="email"
          required
          placeholder="you@example.com"
          className="h-[52px] rounded-2xl border border-line bg-white px-4 text-[15px] text-ink placeholder:text-muted focus:border-lime focus:outline-none"
        />
      </label>
      <button
        type="submit"
        className="inline-flex h-[52px] items-center gap-2 self-end rounded-2xl bg-lime px-6 font-bold text-ink transition-transform hover:-translate-y-0.5"
      >
        {submitted ? (
          <>
            <Check className="size-4" aria-hidden /> Subscribed
          </>
        ) : (
          "Subscribe"
        )}
      </button>
    </form>
  );
}
