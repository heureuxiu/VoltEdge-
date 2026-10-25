"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Lock, MessageCircle, Minus, Plus, Repeat, RotateCcw, ShieldCheck, Trash2 } from "lucide-react";

import { ButtonLink } from "@/components/ui/ButtonLink";
import { ChoiceButton } from "@/components/ui/ChoiceButton";
import { Field, inputClassName } from "@/components/ui/Field";
import { Breadcrumbs } from "@/components/ui/PageHero";
import { SuccessCheck } from "@/components/ui/SuccessCheck";
import { getProduct } from "@/data/products";
import { routes } from "@/data/site";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

const STEPS = ["Cart", "Details", "Payment", "Done"] as const;
const TITLES = ["Your cart", "Checkout", "Payment", "Order confirmed"];

const deliveryOptions = [
  { label: "Collect in store", description: "Free · ready today at [STORE]" },
  { label: "Courier delivery", description: "R [FEE] · [X]–[Y] working days" },
];

const paymentOptions = [
  { label: "Card", description: "Visa, Mastercard, Apple Pay", tag: "Instant" },
  { label: "Payflex", description: "Pay in 3 interest-free instalments", tag: "3×" },
  { label: "Instant EFT", description: "Pay straight from your bank", tag: "EFT" },
];

interface CartLine {
  product: Product;
  variant: string;
  qty: number;
}

/** Demo cart contents — replace with your cart store / API. */
const initialCart: CartLine[] = [
  { product: getProduct("iphone-17-pro-max")!, variant: "Deep Blue · 256GB · New", qty: 1 },
  { product: getProduct("airpods-pro-3")!, variant: "USB-C · New", qty: 1 },
];

export function CheckoutFlow() {
  const [step, setStep] = useState(0);
  const [lines, setLines] = useState<CartLine[]>(initialCart);
  const [delivery, setDelivery] = useState(0);
  const [payment, setPayment] = useState(0);

  const itemCount = lines.reduce((sum, line) => sum + line.qty, 0);
  const updateQty = (id: string, qty: number) =>
    setLines((prev) => prev.map((l) => (l.product.id === id ? { ...l, qty: Math.min(9, Math.max(1, qty)) } : l)));
  const removeLine = (id: string) => setLines((prev) => prev.filter((l) => l.product.id !== id));

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-5">
        <div className="flex flex-col gap-2.5">
          <Breadcrumbs tone="light" items={[{ label: "Home", href: routes.home }, { label: "Shop", href: routes.shop }, { label: TITLES[step] }]} />
          <h1 className="text-[clamp(2.125rem,4vw,3.25rem)] font-bold leading-none">{TITLES[step]}</h1>
        </div>
        <ol aria-label="Checkout progress" className="flex flex-wrap gap-1 rounded-2xl bg-white p-1.5 ring-1 ring-line">
          {STEPS.map((label, index) => {
            const current = index === step;
            const done = index < step;
            return (
              <li
                key={label}
                aria-current={current ? "step" : undefined}
                className={cn(
                  "flex min-h-10 items-center gap-2 rounded-[11px] py-0 pl-1.5 pr-3.5 text-sm font-semibold transition-colors duration-300",
                  current ? "bg-ink text-white" : done ? "text-ink" : "text-[#8a90a0]",
                )}
              >
                <span className={cn("grid size-7 place-items-center rounded-lg text-[13px]", current || done ? "bg-lime text-ink" : "bg-surface")}>
                  {done ? <Check className="size-3.5" aria-hidden /> : index + 1}
                </span>
                {label}
              </li>
            );
          })}
        </ol>
      </div>

      <div className="flex flex-wrap items-start gap-6">
        <section className="flex min-w-0 flex-[999_1_560px] flex-col gap-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.2, 0.7, 0.2, 1] }}
              className="flex flex-col gap-3"
            >
              {step === 0 && (
                <>
                  <AnimatePresence initial={false}>
                    {lines.map((line) => (
                      <motion.article
                        key={line.product.id}
                        layout
                        exit={{ opacity: 0, x: -40, height: 0, marginBottom: -12 }}
                        className="flex flex-wrap items-center gap-5 rounded-card bg-white p-4 ring-1 ring-line"
                      >
                        <Link href={routes.product(line.product.id)} className={cn("grid size-[120px] shrink-0 place-items-center rounded-[18px]", line.product.tint)}>
                          <Image src={line.product.image} alt={line.product.name} width={100} height={120} className="h-[100px] w-auto" />
                        </Link>
                        <div className="flex flex-[1_1_200px] flex-col gap-1">
                          <Link href={routes.product(line.product.id)} className="text-lg font-semibold hover:text-brand">
                            {line.product.name}
                          </Link>
                          <span className="text-sm text-muted">{line.variant}</span>
                          <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-green-600">
                            <span className="size-[7px] rounded-full bg-green-600" />
                            In stock
                          </span>
                        </div>
                        <div className="flex items-center overflow-hidden rounded-xl border border-[#d5d8df]">
                          <button type="button" aria-label={`Decrease ${line.product.name} quantity`} onClick={() => updateQty(line.product.id, line.qty - 1)} className="grid size-11 place-items-center bg-surface">
                            <Minus className="size-4" aria-hidden />
                          </button>
                          <span className="w-10 text-center font-bold">{line.qty}</span>
                          <button type="button" aria-label={`Increase ${line.product.name} quantity`} onClick={() => updateQty(line.product.id, line.qty + 1)} className="grid size-11 place-items-center bg-surface">
                            <Plus className="size-4" aria-hidden />
                          </button>
                        </div>
                        <b className="min-w-[110px] text-right font-display text-xl">{line.product.price}</b>
                        <button type="button" aria-label={`Remove ${line.product.name}`} onClick={() => removeLine(line.product.id)} className="grid size-11 place-items-center rounded-xl text-muted hover:bg-surface hover:text-ink">
                          <Trash2 className="size-[18px]" aria-hidden />
                        </button>
                      </motion.article>
                    ))}
                  </AnimatePresence>

                  {lines.length === 0 && (
                    <div className="flex flex-col items-center gap-3 rounded-card border border-dashed border-[#d5d8df] bg-white p-12 text-center">
                      <b className="font-display text-[22px]">Your cart is empty</b>
                      <ButtonLink href={routes.shop}>Continue shopping</ButtonLink>
                    </div>
                  )}

                  <Link href={routes.tradeIn} className="flex flex-wrap items-center justify-between gap-4 rounded-card bg-ink px-6 py-5 text-white">
                    <span className="flex items-center gap-3.5">
                      <span className="grid size-11 place-items-center rounded-xl bg-lime">
                        <Repeat className="size-5 text-ink" aria-hidden />
                      </span>
                      <span>
                        <b>Trading in an old phone?</b>
                        <br />
                        <span className="text-sm text-muted-dark">Get an estimate and take it off this order.</span>
                      </span>
                    </span>
                    <span className="font-semibold text-lime">Get a quote →</span>
                  </Link>
                </>
              )}

              {step === 1 && (
                <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-5 rounded-card bg-white p-6 ring-1 ring-line sm:p-8">
                  <b className="font-display text-[22px]">Contact details</b>
                  <div className="grid gap-3 md:grid-cols-3">
                    <Field label="Full name" autoComplete="name" />
                    <Field label="Phone" type="tel" autoComplete="tel" />
                    <Field label="Email" type="email" autoComplete="email" />
                  </div>
                  <b className="pt-2 font-display text-[22px]">How would you like to get it?</b>
                  <div className="grid gap-3 md:grid-cols-2">
                    {deliveryOptions.map((option, index) => (
                      <ChoiceButton key={option.label} variant="card" selected={delivery === index} onClick={() => setDelivery(index)}>
                        <b className="block text-base">{option.label}</b>
                        <span className="mt-1 block text-[13px] opacity-75">{option.description}</span>
                      </ChoiceButton>
                    ))}
                  </div>
                  <AnimatePresence initial={false}>
                    {delivery === 1 && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="grid gap-3 overflow-hidden md:grid-cols-3"
                      >
                        <Field label="Street address" autoComplete="street-address" wrapperClassName="md:col-span-3" />
                        <Field label="Suburb" />
                        <Field label="City" autoComplete="address-level2" />
                        <Field label="Postal code" autoComplete="postal-code" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              )}

              {step === 2 && (
                <div className="flex flex-col gap-4 rounded-card bg-white p-6 ring-1 ring-line sm:p-8">
                  <b className="font-display text-[22px]">Payment method</b>
                  {paymentOptions.map((option, index) => (
                    <button
                      key={option.label}
                      type="button"
                      aria-pressed={payment === index}
                      onClick={() => setPayment(index)}
                      className={cn(
                        "flex items-center gap-4 rounded-[18px] border-2 bg-white p-[18px] text-left transition-colors",
                        payment === index ? "border-ink" : "border-line hover:border-[#c9cdd6]",
                      )}
                    >
                      <span
                        className={cn(
                          "size-[22px] shrink-0 rounded-full transition-all",
                          payment === index ? "border-[7px] border-ink" : "border-2 border-[#c9cdd6]",
                        )}
                      />
                      <span className="flex-1">
                        <b className="block text-base">{option.label}</b>
                        <span className="text-[13px] text-muted">{option.description}</span>
                      </span>
                      <span className="rounded-lg bg-surface px-2.5 py-1 text-xs font-bold">{option.tag}</span>
                    </button>
                  ))}
                  <p className="flex items-center gap-2 text-[13px] text-muted">
                    <Lock className="size-4 text-green-600" aria-hidden />
                    Payments are processed securely by [PAYMENT PROVIDER]. We never store card details.
                  </p>
                </div>
              )}

              {step === 3 && (
                <div className="surface-glow-strong relative flex flex-col items-start gap-4 overflow-hidden rounded-panel p-8 text-ink ring-1 ring-line sm:p-14">
                  <div aria-hidden className="absolute -right-16 -top-16 size-64 rounded-full bg-lime opacity-[0.3] blur-[90px]" />
                  <SuccessCheck />
                  <h2 className="text-[clamp(1.875rem,4vw,3rem)] font-bold leading-[1.05]">
                    Order placed. <span className="text-lime-dark">Thank you!</span>
                  </h2>
                  <p className="max-w-[520px] text-[17px] leading-relaxed text-muted">
                    Your order number is <b className="text-ink">VE-[ORDER NO]</b>. We&apos;ve sent a confirmation to your email and WhatsApp.
                  </p>
                  <div className="mt-2 flex flex-wrap gap-3">
                    <ButtonLink href={routes.track} variant="lime">
                      Track your order
                    </ButtonLink>
                    <ButtonLink href={routes.shop} variant="outline-dark">
                      Keep shopping
                    </ButtonLink>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </section>

        <OrderSummary
          itemCount={itemCount}
          deliveryCost={delivery === 1 ? "R [FEE]" : "Free"}
          action={
            step < 3 && lines.length > 0 ? (
              <button
                type="button"
                onClick={() => setStep((s) => Math.min(3, s + 1))}
                className="min-h-14 rounded-[14px] bg-lime text-base font-bold text-ink transition-transform hover:-translate-y-0.5"
              >
                {["Checkout", "Continue to payment", "Place order"][step]}
              </button>
            ) : null
          }
          back={step > 0 && step < 3 ? () => setStep((s) => s - 1) : undefined}
        />
      </div>
    </>
  );
}

interface OrderSummaryProps {
  itemCount: number;
  deliveryCost: string;
  action: ReactNode;
  back?: () => void;
}

function OrderSummary({ itemCount, deliveryCost, action, back }: OrderSummaryProps) {
  return (
    <aside aria-label="Order summary" className="flex min-w-0 flex-[1_1_340px] flex-col gap-4">
      <div className="flex flex-col gap-3.5 rounded-card bg-white p-6 ring-1 ring-line">
        <b className="font-display text-xl">Order summary</b>
        <Row label={`Items (${itemCount})`} value="R [SUBTOTAL]" />
        <Row label="Delivery" value={deliveryCost} />
        <Row label="Discount" value={<span className="text-green-600">− R [DISCOUNT]</span>} />
        <div className="flex gap-2">
          <label className="flex-1">
            <span className="sr-only">Promo code</span>
            <input placeholder="Promo code" className={cn(inputClassName, "h-[46px] text-sm")} />
          </label>
          <button type="button" className="h-[46px] rounded-xl bg-ink px-4 font-semibold text-white">
            Apply
          </button>
        </div>
        <div className="flex items-baseline justify-between border-t border-line pt-3.5">
          <b>Total</b>
          <b className="font-display text-[28px]">R [TOTAL]</b>
        </div>
        <span className="text-[13px] text-muted">or 3 × R [AMOUNT] interest-free with Payflex</span>
        {action}
        {back && (
          <button type="button" onClick={back} className="min-h-11 font-semibold text-muted hover:text-ink">
            ← Back
          </button>
        )}
      </div>
      <ul className="flex flex-col gap-3 rounded-card bg-white px-6 py-5 text-sm ring-1 ring-line">
        <li className="flex items-center gap-2.5"><ShieldCheck className="size-[18px]" aria-hidden />Genuine stock, never blacklisted</li>
        <li className="flex items-center gap-2.5"><RotateCcw className="size-[18px]" aria-hidden />Easy returns — see refund policy</li>
        <li className="flex items-center gap-2.5">
          <MessageCircle className="size-[18px]" aria-hidden />
          Questions?{" "}
          <Link href={routes.contact} className="font-semibold text-brand">
            Chat to us
          </Link>
        </li>
      </ul>
    </aside>
  );
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex justify-between text-[15px]">
      <span className="text-muted">{label}</span>
      <span>{value}</span>
    </div>
  );
}
