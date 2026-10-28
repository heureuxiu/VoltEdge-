"use client";

import Image from "next/image";
import Link from "next/link";
import { useId, useState, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronDown, ChevronRight, Lock, ShoppingBag } from "lucide-react";

import { Logo } from "@/components/ui/Logo";
import { demoCart } from "@/data/cart";
import { routes, siteConfig } from "@/data/site";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Small form primitives (floating-label inputs, radio rows)           */
/* ------------------------------------------------------------------ */

const control =
  "peer w-full rounded-[10px] border border-[#d4d4d8] bg-white px-3.5 pb-1.5 pt-6 text-[15px] text-ink placeholder-transparent transition-shadow focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink";

function FloatField({ label, className, ...props }: { label: string } & ComponentPropsWithoutRef<"input">) {
  const id = useId();
  return (
    <div className={cn("relative", className)}>
      <input id={id} placeholder={label} className={cn(control, "h-[54px]")} {...props} />
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-3.5 top-1.5 text-xs text-muted transition-all peer-placeholder-shown:top-[17px] peer-placeholder-shown:text-[15px] peer-focus:top-1.5 peer-focus:text-xs"
      >
        {label}
      </label>
    </div>
  );
}

function FloatSelect({ label, children, className, ...props }: { label: string; children: ReactNode } & ComponentPropsWithoutRef<"select">) {
  const id = useId();
  return (
    <div className={cn("relative", className)}>
      <select id={id} className={cn(control, "h-[54px] appearance-none pr-10")} {...props}>
        {children}
      </select>
      <label htmlFor={id} className="pointer-events-none absolute left-3.5 top-1.5 text-xs text-muted">
        {label}
      </label>
      <ChevronDown className="pointer-events-none absolute right-3.5 top-[19px] size-4 text-muted" aria-hidden />
    </div>
  );
}

function Check1({ children, defaultChecked }: { children: ReactNode; defaultChecked?: boolean }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-sm">
      <input type="checkbox" defaultChecked={defaultChecked} className="size-[18px] rounded border-[#d4d4d8] accent-ink" />
      {children}
    </label>
  );
}

function RadioRow({
  checked,
  onChange,
  title,
  right,
  children,
  name,
}: {
  checked: boolean;
  onChange: () => void;
  title: ReactNode;
  right?: ReactNode;
  children?: ReactNode;
  name: string;
}) {
  return (
    <div className={cn("overflow-hidden rounded-[10px] border transition-colors", checked ? "border-ink ring-1 ring-ink" : "border-[#d4d4d8]")}>
      <label className={cn("flex cursor-pointer items-center gap-3 px-4 py-4 text-[15px]", checked && "bg-[#fafafa]")}>
        <input type="radio" name={name} checked={checked} onChange={onChange} className="size-[18px] accent-ink" />
        <span className="flex-1 font-medium">{title}</span>
        {right}
      </label>
      <AnimatePresence initial={false}>
        {checked && children && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-[#e4e4e7] bg-surface"
          >
            <div className="p-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Section({ title, aside, children }: { title: string; aside?: ReactNode; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-display text-[22px] font-bold">{title}</h2>
        {aside}
      </div>
      {children}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Order summary                                                       */
/* ------------------------------------------------------------------ */

function Summary() {
  const [code, setCode] = useState("");
  return (
    <div className="flex flex-col gap-5">
      <ul className="flex flex-col gap-4">
        {demoCart.map(({ product, variant, qty }) => (
          <li key={product.id} className="flex items-center gap-4">
            <span className="relative grid size-16 shrink-0 place-items-center rounded-xl border border-[#e4e4e7] bg-white">
              <Image src={product.image} alt="" width={48} height={60} className="h-11 w-auto" />
              <span className="absolute -right-2 -top-2 grid size-5 place-items-center rounded-full bg-ink/75 text-[11px] font-bold text-white">{qty}</span>
            </span>
            <span className="min-w-0 flex-1">
              <b className="block truncate text-sm">{product.name}</b>
              <span className="block truncate text-xs text-muted">{variant}</span>
            </span>
            <b className="text-sm">{product.price}</b>
          </li>
        ))}
      </ul>

      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex gap-3"
      >
        <label className="sr-only" htmlFor="discount">
          Discount code
        </label>
        <input
          id="discount"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Discount code or gift card"
          className="h-[50px] min-w-0 flex-1 rounded-[10px] border border-[#d4d4d8] bg-white px-3.5 text-[15px] focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
        />
        <button
          type="submit"
          disabled={!code.trim()}
          className="h-[50px] rounded-[10px] bg-[#e4e4e7] px-5 text-sm font-semibold text-ink transition-colors enabled:bg-ink enabled:text-white disabled:cursor-not-allowed disabled:text-muted"
        >
          Apply
        </button>
      </form>

      <dl className="flex flex-col gap-3 text-[15px]">
        <div className="flex justify-between">
          <dt className="text-muted">Subtotal</dt>
          <dd className="font-semibold">R [SUBTOTAL]</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted">Shipping</dt>
          <dd className="text-muted">Enter shipping address</dd>
        </div>
        <div className="flex items-baseline justify-between pt-1">
          <dt className="text-lg font-semibold">Total</dt>
          <dd>
            <span className="mr-2 text-xs text-muted">ZAR</span>
            <b className="font-display text-2xl">R [TOTAL]</b>
          </dd>
        </div>
      </dl>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

export function CheckoutPage() {
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [delivery, setDelivery] = useState<"ship" | "pickup">("ship");
  const [shipping, setShipping] = useState(0);
  const [payment, setPayment] = useState(0);
  const [billing, setBilling] = useState(0);
  const [placed, setPlaced] = useState(false);

  if (placed) return <Confirmation />;

  return (
    <div className="min-h-dvh bg-white lg:h-dvh lg:overflow-hidden lg:bg-[#ececef] lg:px-8 lg:py-8">
      {/* Mobile order summary toggle */}
      <div className="border-b border-[#e4e4e7] bg-surface lg:hidden">
        <button
          type="button"
          aria-expanded={summaryOpen}
          onClick={() => setSummaryOpen((v) => !v)}
          className="mx-auto flex w-full max-w-[640px] items-center justify-between gap-3 px-5 py-4 text-sm"
        >
          <span className="flex items-center gap-2 font-medium">
            <ShoppingBag className="size-[18px]" aria-hidden />
            {summaryOpen ? "Hide" : "Show"} order summary
            <ChevronDown className={cn("size-4 transition-transform", summaryOpen && "rotate-180")} aria-hidden />
          </span>
          <b className="font-display text-lg">R [TOTAL]</b>
        </button>
        <AnimatePresence initial={false}>
          {summaryOpen && (
            <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
              <div className="mx-auto max-w-[640px] px-5 pb-6">
                <Summary />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mx-auto grid max-w-[1180px] overflow-clip bg-white lg:h-full lg:grid-cols-[minmax(0,1fr)_minmax(380px,440px)] lg:grid-rows-1 lg:rounded-[32px] lg:shadow-[0_32px_64px_-32px_rgb(17_17_17/0.3)] lg:ring-1 lg:ring-black/5">
        {/* Left: form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setPlaced(true);
            window.scrollTo({ top: 0 });
          }}
          data-lenis-prevent
          className="flex flex-col gap-10 px-5 pb-14 pt-8 sm:px-10 lg:min-h-0 lg:overflow-y-auto lg:overscroll-contain lg:px-14 lg:py-12 lg:[scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden"
        >
          <header className="flex items-center justify-between">
            <Logo />
            <Link href={routes.cart} aria-label="Back to cart" className="text-[#2347ff] lg:hidden">
              <ShoppingBag className="size-6" aria-hidden />
            </Link>
          </header>

          <nav aria-label="Checkout steps" className="-mt-3 flex items-center gap-1.5 text-[13px]">
            <Link href={routes.cart} className="text-[#2347ff] hover:underline">
              Cart
            </Link>
            <ChevronRight className="size-3.5 text-muted" aria-hidden />
            <b>Checkout</b>
            <ChevronRight className="size-3.5 text-muted" aria-hidden />
            <span className="text-muted">Confirmation</span>
          </nav>

          {/* Express checkout */}
          <div className="relative rounded-[10px] border border-[#d4d4d8] px-4 pb-4 pt-6">
            <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-white px-3 text-[13px] text-muted">Express checkout</span>
            <div className="grid grid-cols-2 gap-3">
              {[
                { src: "/images/payments/applepay.svg", alt: "Apple Pay" },
                { src: "/images/payments/googlepay.svg", alt: "Google Pay" },
              ].map(({ src, alt }) => (
                <button
                  key={alt}
                  type="button"
                  aria-label={`Pay with ${alt}`}
                  className="grid h-12 place-items-center rounded-[10px] bg-ink transition-colors hover:bg-[#333333]"
                >
                  <Image src={src} alt="" width={64} height={26} unoptimized className="h-6 w-auto invert" />
                </button>
              ))}
            </div>
          </div>
          <div className="-my-4 flex items-center gap-4 text-[13px] text-muted">
            <span className="h-px flex-1 bg-[#e4e4e7]" />
            OR
            <span className="h-px flex-1 bg-[#e4e4e7]" />
          </div>

          <Section title="Contact" aside={<Link href="/contact" className="text-sm text-[#2347ff] hover:underline">Need help?</Link>}>
            <FloatField label="Email" type="email" name="email" autoComplete="email" required />
            <Check1 defaultChecked>Email me with news and offers</Check1>
          </Section>

          <Section title="Delivery">
            <div className="flex flex-col gap-3">
              <RadioRow name="delivery" checked={delivery === "ship"} onChange={() => setDelivery("ship")} title="Ship" />
              <RadioRow name="delivery" checked={delivery === "pickup"} onChange={() => setDelivery("pickup")} title="Pick up in store" right={<span className="text-sm text-muted">Free</span>}>
                <b className="block text-sm">{siteConfig.name} store</b>
                <span className="text-sm text-muted">{siteConfig.address} · Ready today</span>
              </RadioRow>
            </div>

            {delivery === "ship" && (
              <div className="grid gap-3 sm:grid-cols-2">
                <FloatSelect label="Country/Region" name="country" className="sm:col-span-2" defaultValue="ZA">
                  <option value="ZA">South Africa</option>
                  <option value="NA">Namibia</option>
                  <option value="BW">Botswana</option>
                </FloatSelect>
                <FloatField label="First name" name="firstName" autoComplete="given-name" required />
                <FloatField label="Last name" name="lastName" autoComplete="family-name" required />
                <FloatField label="Address" name="address" autoComplete="address-line1" className="sm:col-span-2" required />
                <FloatField label="Apartment, suite, etc. (optional)" name="address2" autoComplete="address-line2" className="sm:col-span-2" />
                <FloatField label="City" name="city" autoComplete="address-level2" required />
                <FloatSelect label="Province" name="province" defaultValue="">
                  <option value="" disabled />
                  <option>Gauteng</option>
                  <option>Western Cape</option>
                  <option>KwaZulu-Natal</option>
                  <option>Eastern Cape</option>
                  <option>Free State</option>
                  <option>Limpopo</option>
                  <option>Mpumalanga</option>
                  <option>North West</option>
                  <option>Northern Cape</option>
                </FloatSelect>
                <FloatField label="Postal code" name="postal" autoComplete="postal-code" required />
                <FloatField label="Phone" type="tel" name="phone" autoComplete="tel" required />
                <div className="sm:col-span-2">
                  <Check1>Save this information for next time</Check1>
                </div>
              </div>
            )}
          </Section>

          {delivery === "ship" && (
            <Section title="Shipping method">
              <div className="flex flex-col gap-3">
                {[
                  { label: "Standard delivery", note: "[X]–[Y] working days", price: "R [FEE]" },
                  { label: "Express delivery", note: "Next working day", price: "R [FEE]" },
                ].map((opt, index) => (
                  <RadioRow
                    key={opt.label}
                    name="shipping"
                    checked={shipping === index}
                    onChange={() => setShipping(index)}
                    title={
                      <span className="flex flex-col">
                        {opt.label}
                        <span className="text-xs font-normal text-muted">{opt.note}</span>
                      </span>
                    }
                    right={<b className="text-sm">{opt.price}</b>}
                  />
                ))}
              </div>
            </Section>
          )}

          <Section
            title="Payment"
            aside={
              <span className="flex items-center gap-1.5 text-xs text-muted">
                <Lock className="size-3.5" aria-hidden /> Secure and encrypted
              </span>
            }
          >
            <div className="flex flex-col gap-3">
              <RadioRow name="payment" checked={payment === 0} onChange={() => setPayment(0)} title="Credit or debit card" right={<span className="text-xs font-semibold text-muted">VISA · MC</span>}>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="relative sm:col-span-2">
                    <FloatField label="Card number" inputMode="numeric" autoComplete="cc-number" />
                    <Lock className="pointer-events-none absolute right-3.5 top-[19px] size-4 text-muted" aria-hidden />
                  </div>
                  <FloatField label="Name on card" autoComplete="cc-name" className="sm:col-span-2" />
                  <FloatField label="Expiration date (MM / YY)" autoComplete="cc-exp" />
                  <FloatField label="Security code" inputMode="numeric" autoComplete="cc-csc" />
                </div>
              </RadioRow>
              <RadioRow name="payment" checked={payment === 1} onChange={() => setPayment(1)} title="Payflex" right={<span className="rounded bg-[#ffc933] px-1.5 py-0.5 text-[11px] font-bold">3×</span>}>
                <p className="text-sm text-muted">Pay in 3 interest-free instalments. You&apos;ll be redirected to Payflex to complete your purchase.</p>
              </RadioRow>
              <RadioRow name="payment" checked={payment === 2} onChange={() => setPayment(2)} title="Instant EFT" right={<span className="text-xs font-semibold text-muted">EFT</span>}>
                <p className="text-sm text-muted">Pay straight from your bank. You&apos;ll be redirected to your bank to complete the payment.</p>
              </RadioRow>
            </div>
          </Section>

          <Section title="Billing address">
            <div className="flex flex-col gap-3">
              <RadioRow name="billing" checked={billing === 0} onChange={() => setBilling(0)} title="Same as shipping address" />
              <RadioRow name="billing" checked={billing === 1} onChange={() => setBilling(1)} title="Use a different billing address">
                <div className="grid gap-3 sm:grid-cols-2">
                  <FloatField label="First name" />
                  <FloatField label="Last name" />
                  <FloatField label="Address" className="sm:col-span-2" />
                  <FloatField label="City" />
                  <FloatField label="Postal code" />
                </div>
              </RadioRow>
            </div>
          </Section>

          <div className="flex flex-col gap-4">
            <button
              type="submit"
              className="flex h-[60px] items-center justify-center gap-2 rounded-[12px] bg-ink text-[17px] font-semibold text-white transition-colors hover:bg-[#333333]"
            >
              <Lock className="size-[18px]" aria-hidden /> Pay now
            </button>
            <Link href={routes.cart} className="flex items-center gap-1 text-sm text-[#2347ff] hover:underline">
              ‹ Return to cart
            </Link>
          </div>

          <footer className="flex flex-wrap gap-x-5 gap-y-2 border-t border-[#e4e4e7] pt-6 text-xs text-[#2347ff]">
            <Link href="#" className="hover:underline">Refund policy</Link>
            <Link href="#" className="hover:underline">Shipping policy</Link>
            <Link href="#" className="hover:underline">Privacy policy</Link>
            <Link href="#" className="hover:underline">Terms of service</Link>
          </footer>
        </form>

        {/* Right: summary */}
        <aside aria-label="Order summary" data-lenis-prevent className="hidden border-l border-[#e4e4e7] bg-surface lg:block lg:min-h-0 lg:overflow-y-auto lg:overscroll-contain lg:[scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden">
          <div className="px-10 py-12">
            <Summary />
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Confirmation                                                        */
/* ------------------------------------------------------------------ */

function Confirmation() {
  return (
    <div className="grid min-h-dvh place-items-center bg-white px-5 py-12">
      <div className="flex w-full max-w-[560px] flex-col gap-6">
        <Logo />
        <div className="flex items-center gap-4">
          <span className="grid size-14 place-items-center rounded-full border-2 border-ink">
            <Check className="size-7" strokeWidth={2.6} aria-hidden />
          </span>
          <span>
            <span className="block text-sm text-muted">Order #VE-10483</span>
            <h1 className="font-display text-3xl font-bold leading-tight">Thank you!</h1>
          </span>
        </div>

        <div className="rounded-[14px] border border-[#d4d4d8] p-6">
          <b className="font-display text-xl">Your order is confirmed</b>
          <p className="mt-2 text-[15px] leading-relaxed text-muted">
            We&apos;ve emailed your receipt. You&apos;ll get a WhatsApp message as soon as your order is packed. Track it any time with your order number.
          </p>
        </div>

        <div className="grid gap-4 rounded-[14px] border border-[#d4d4d8] p-6 text-sm sm:grid-cols-2">
          <div>
            <b className="block">Contact</b>
            <span className="text-muted">you@example.com</span>
          </div>
          <div>
            <b className="block">Payment</b>
            <span className="text-muted">Card · R [TOTAL]</span>
          </div>
          <div>
            <b className="block">Delivery</b>
            <span className="text-muted">Standard · [X]–[Y] working days</span>
          </div>
          <div>
            <b className="block">Need help?</b>
            <Link href={routes.contact} className="text-[#2347ff] hover:underline">Contact us</Link>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link href={routes.track} className="inline-flex h-14 items-center rounded-[12px] border border-[#d4d4d8] px-6 text-[15px] font-semibold hover:bg-surface">
            Track order
          </Link>
          <Link href={routes.shop} className="inline-flex h-14 items-center rounded-[12px] bg-ink px-6 text-[15px] font-semibold text-white hover:bg-[#333333]">
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
