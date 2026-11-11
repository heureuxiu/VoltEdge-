"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { useCatalog } from "@/context/CatalogContext";
import type { CartLine } from "@/data/cart";
import type { Product } from "@/types";

const STORAGE_KEY = "ve-cart-v1";
const MAX_QTY = 9;

interface StoredLine {
  productId: string;
  variant: string;
  qty: number;
}

interface CartValue {
  lines: CartLine[];
  count: number;
  subtotal: number;
  /** False until the saved cart has been read, so pages avoid flashing an empty cart. */
  ready: boolean;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  add: (product: Product, options?: { variant?: string; qty?: number; open?: boolean }) => void;
  setQty: (productId: string, qty: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
}

const Ctx = createContext<CartValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { getProduct } = useCatalog();
  const [stored, setStored] = useState<StoredLine[]>([]);
  const [ready, setReady] = useState(false);
  const [isOpen, setOpen] = useState(false);

  // Read the saved cart once after mount (it cannot be read during server rendering).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as StoredLine[];
        // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrating from localStorage after mount
        if (Array.isArray(parsed)) setStored(parsed.filter((l) => l && typeof l.productId === "string" && l.qty > 0));
      }
    } catch {
      /* ignore corrupt storage */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    } catch {
      /* storage unavailable */
    }
  }, [stored, ready]);

  const add = useCallback<CartValue["add"]>((product, options = {}) => {
    const qty = Math.min(MAX_QTY, Math.max(1, options.qty ?? 1));
    const variant = options.variant ?? product.spec;
    setStored((prev) => {
      const existing = prev.find((l) => l.productId === product.id);
      if (existing) return prev.map((l) => (l.productId === product.id ? { ...l, variant, qty: Math.min(MAX_QTY, l.qty + qty) } : l));
      return [...prev, { productId: product.id, variant, qty }];
    });
    if (options.open !== false) setOpen(true);
  }, []);

  const setQty = useCallback((productId: string, qty: number) => {
    setStored((prev) => prev.map((l) => (l.productId === productId ? { ...l, qty: Math.min(MAX_QTY, Math.max(1, qty)) } : l)));
  }, []);
  const remove = useCallback((productId: string) => setStored((prev) => prev.filter((l) => l.productId !== productId)), []);
  const clear = useCallback(() => setStored([]), []);

  const value = useMemo<CartValue>(() => {
    // Lines whose product disappeared from the catalogue are quietly dropped.
    const lines = stored.flatMap((l) => {
      const product = getProduct(l.productId);
      return product ? [{ product, variant: l.variant, qty: l.qty }] : [];
    });
    return {
      lines,
      count: lines.reduce((s, l) => s + l.qty, 0),
      subtotal: lines.reduce((s, l) => s + l.product.priceValue * l.qty, 0),
      ready,
      isOpen,
      openCart: () => setOpen(true),
      closeCart: () => setOpen(false),
      add,
      setQty,
      remove,
      clear,
    };
  }, [stored, getProduct, ready, isOpen, add, setQty, remove, clear]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
