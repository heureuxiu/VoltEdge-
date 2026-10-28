"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { CreditCard } from "@phosphor-icons/react";

import { routes } from "@/data/site";
import type { CartLine } from "@/data/cart";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  lines: CartLine[];
  onQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}

/** Slide-in mini cart. "View full cart" goes to the cart page. */
export function CartDrawer({ open, onClose, lines, onQty, onRemove }: CartDrawerProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const count = lines.reduce((sum, l) => sum + l.qty, 0);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const previous = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = previous;
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70]" data-lenis-prevent>
          <motion.div
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="absolute inset-0 bg-ink/45"
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            initial={{ x: "110%" }}
            animate={{ x: 0 }}
            exit={{ x: "110%" }}
            transition={{ type: "tween", duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
            className="absolute inset-y-3 right-3 flex w-[calc(100%-1.5rem)] max-w-[440px] flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_32px_64px_-24px_rgb(17_17_17/0.55)] ring-1 ring-black/5"
          >
            <header className="flex items-center justify-between gap-4 border-b border-line px-6 py-5">
              <span className="flex items-center gap-3">
                <b className="font-display text-xl">Your cart</b>
                <span className="grid min-w-7 place-items-center rounded-full bg-ink px-2 py-0.5 text-xs font-bold text-white">{count}</span>
              </span>
              <button
                ref={closeRef}
                type="button"
                aria-label="Close cart"
                onClick={onClose}
                className="grid size-11 place-items-center rounded-full bg-surface transition-colors hover:bg-line"
              >
                <X className="size-5" aria-hidden />
              </button>
            </header>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
                <span className="grid size-20 place-items-center rounded-full bg-surface">
                  <ShoppingBag className="size-9" aria-hidden />
                </span>
                <b className="font-display text-xl">Your cart is empty</b>
                <p className="text-[15px] text-muted">Add a device and it will show up here.</p>
                <Link
                  href={routes.shop}
                  onClick={onClose}
                  className="mt-2 inline-flex h-12 items-center rounded-full bg-ink px-6 text-sm font-semibold text-white"
                >
                  Start shopping
                </Link>
              </div>
            ) : (
              <>
                <ul className="flex flex-1 flex-col gap-3 overflow-y-auto overscroll-contain px-6 py-5">
                  {lines.map(({ product, variant, qty }) => (
                    <li key={product.id} className="flex gap-4 rounded-[22px] bg-surface p-3.5">
                      <Link
                        href={routes.product(product.id)}
                        onClick={onClose}
                        className="grid size-24 shrink-0 place-items-center rounded-2xl bg-white"
                      >
                        <Image src={product.image} alt="" width={64} height={80} className="h-[72px] w-auto" />
                      </Link>
                      <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
                        <div className="flex items-start justify-between gap-2">
                          <span className="min-w-0">
                            <b className="block truncate text-[15px]">{product.name}</b>
                            <span className="block truncate text-xs text-muted">{variant}</span>
                          </span>
                          <button
                            type="button"
                            aria-label={`Remove ${product.name}`}
                            onClick={() => onRemove(product.id)}
                            className="grid size-8 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-white hover:text-ink"
                          >
                            <Trash2 className="size-4" aria-hidden />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center rounded-full bg-white p-0.5 ring-1 ring-line">
                            <button
                              type="button"
                              aria-label="Decrease quantity"
                              onClick={() => onQty(product.id, qty - 1)}
                              className="grid size-8 place-items-center rounded-full transition-colors hover:bg-surface"
                            >
                              <Minus className="size-3.5" aria-hidden />
                            </button>
                            <span className="w-6 text-center text-sm font-bold" aria-live="polite">
                              {qty}
                            </span>
                            <button
                              type="button"
                              aria-label="Increase quantity"
                              onClick={() => onQty(product.id, qty + 1)}
                              className="grid size-8 place-items-center rounded-full transition-colors hover:bg-surface"
                            >
                              <Plus className="size-3.5" aria-hidden />
                            </button>
                          </div>
                          <b className="font-display text-lg">{product.price}</b>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <footer className="flex flex-col gap-4 border-t border-line px-6 pb-6 pt-5">
                  <div className="flex items-center gap-3 rounded-2xl bg-[#fef4cc] px-4 py-3 text-sm">
                    <CreditCard className="size-6 shrink-0" aria-hidden />
                    <span>
                      Pay in 3 with <b>Payflex</b> — interest-free.
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-muted">Subtotal</span>
                    <b className="font-display text-2xl">R [TOTAL]</b>
                  </div>
                  <p className="-mt-2 text-xs text-muted">Delivery and discounts are calculated at checkout.</p>
                  <Link
                    href={routes.cart}
                    onClick={onClose}
                    className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-ink text-base font-semibold text-white transition-transform hover:-translate-y-0.5"
                  >
                    <ShoppingBag className="size-[18px]" aria-hidden /> View full cart
                  </Link>
                  <Link
                    href={routes.checkout}
                    onClick={onClose}
                    className="inline-flex h-12 items-center justify-center rounded-full bg-accent text-sm font-bold text-ink transition-colors hover:bg-[#ffd24d]"
                  >
                    Checkout
                  </Link>
                </footer>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
