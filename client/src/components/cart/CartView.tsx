"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { CreditCard, SealCheck, ShieldCheck } from "@phosphor-icons/react";

import { demoCart, type CartLine } from "@/data/cart";
import { routes } from "@/data/site";
import { Breadcrumbs } from "@/components/ui/PageHero";

/** Cart review page. The payment flow lives on /checkout. */
export function CartView() {
  const [lines, setLines] = useState<CartLine[]>(demoCart);
  const count = lines.reduce((sum, l) => sum + l.qty, 0);
  const setQty = (id: string, qty: number) =>
    setLines((prev) => prev.map((l) => (l.product.id === id ? { ...l, qty: Math.min(9, Math.max(1, qty)) } : l)));
  const remove = (id: string) => setLines((prev) => prev.filter((l) => l.product.id !== id));

  return (
    <>
      <div className="mb-6">
        <Breadcrumbs tone="light" items={[{ label: "Home", href: routes.home }, { label: "Cart" }]} />
        <h1 className="mt-4 text-[clamp(2rem,4vw,3rem)] font-bold leading-none">
          Your cart <span className="text-muted">({count})</span>
        </h1>
      </div>

      {lines.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-panel bg-white px-6 py-20 text-center ring-1 ring-line">
          <span className="grid size-20 place-items-center rounded-full bg-surface">
            <ShoppingBag className="size-9" aria-hidden />
          </span>
          <b className="font-display text-2xl">Your cart is empty</b>
          <Link href={routes.shop} className="inline-flex h-12 items-center rounded-full bg-ink px-6 text-sm font-semibold text-white">
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-wrap items-start gap-6">
          <ul className="flex min-w-0 flex-[999_1_560px] flex-col gap-3">
            {lines.map(({ product, variant, qty }) => (
              <li key={product.id} className="flex flex-wrap items-center gap-5 rounded-card bg-white p-4 ring-1 ring-line">
                <Link href={routes.product(product.id)} className="grid size-28 shrink-0 place-items-center rounded-2xl bg-surface">
                  <Image src={product.image} alt="" width={80} height={100} className="h-[88px] w-auto" />
                </Link>
                <div className="flex min-w-[180px] flex-1 flex-col gap-1">
                  <span className="text-xs font-semibold text-muted">{product.brand}</span>
                  <Link href={routes.product(product.id)} className="font-display text-xl font-bold hover:underline">
                    {product.name}
                  </Link>
                  <span className="text-sm text-muted">{variant}</span>
                </div>
                <div className="flex items-center rounded-full bg-surface p-1 ring-1 ring-line">
                  <button type="button" aria-label="Decrease quantity" onClick={() => setQty(product.id, qty - 1)} className="grid size-10 place-items-center rounded-full hover:bg-white">
                    <Minus className="size-4" aria-hidden />
                  </button>
                  <span className="w-7 text-center font-bold" aria-live="polite">
                    {qty}
                  </span>
                  <button type="button" aria-label="Increase quantity" onClick={() => setQty(product.id, qty + 1)} className="grid size-10 place-items-center rounded-full hover:bg-white">
                    <Plus className="size-4" aria-hidden />
                  </button>
                </div>
                <b className="w-28 text-right font-display text-xl">{product.price}</b>
                <button
                  type="button"
                  aria-label={`Remove ${product.name}`}
                  onClick={() => remove(product.id)}
                  className="grid size-10 place-items-center rounded-full text-muted transition-colors hover:bg-surface hover:text-ink"
                >
                  <Trash2 className="size-5" aria-hidden />
                </button>
              </li>
            ))}
          </ul>

          <aside className="flex min-w-0 flex-[1_1_340px] flex-col gap-4 rounded-panel bg-white p-6 ring-1 ring-line lg:sticky lg:top-28">
            <b className="font-display text-xl">Order summary</b>
            <dl className="flex flex-col gap-3 text-[15px]">
              <div className="flex justify-between">
                <dt className="text-muted">Subtotal ({count} items)</dt>
                <dd className="font-semibold">R [SUBTOTAL]</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Shipping</dt>
                <dd className="text-muted">Calculated at checkout</dd>
              </div>
              <div className="flex items-baseline justify-between border-t border-line pt-4">
                <dt className="font-semibold">Estimated total</dt>
                <dd className="font-display text-2xl font-bold">R [TOTAL]</dd>
              </div>
            </dl>
            <Link
              href={routes.checkout}
              className="inline-flex h-14 items-center justify-center rounded-full bg-ink text-base font-semibold text-white transition-transform hover:-translate-y-0.5"
            >
              Checkout
            </Link>
            <Link href={routes.shop} className="text-center text-sm font-semibold hover:underline">
              Continue shopping
            </Link>
            <ul className="mt-1 flex flex-col gap-2.5 border-t border-line pt-4 text-sm text-muted">
              <li className="flex items-center gap-2.5"><CreditCard className="size-5 shrink-0 text-ink" aria-hidden />Pay in 3 with Payflex</li>
              <li className="flex items-center gap-2.5"><ShieldCheck className="size-5 shrink-0 text-ink" aria-hidden />90-day warranty on repairs</li>
              <li className="flex items-center gap-2.5"><SealCheck className="size-5 shrink-0 text-ink" aria-hidden />Genuine stock only</li>
            </ul>
          </aside>
        </div>
      )}
    </>
  );
}
