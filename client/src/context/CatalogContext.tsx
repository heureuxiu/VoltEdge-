"use client";

import { createContext, useContext, useMemo } from "react";
import type { ReactNode } from "react";

import { bestSellersFrom, type Catalog, type StoreConfig } from "@/lib/catalog";
import type { Product } from "@/types";

interface CatalogValue {
  products: Product[];
  bestSellers: Product[];
  config: StoreConfig;
  live: boolean;
  getProduct: (id: string) => Product | undefined;
}

const Ctx = createContext<CatalogValue | null>(null);

/** Products and store settings, loaded on the server (see app/layout.tsx) and shared with client components. */
export function CatalogProvider({ catalog, children }: { catalog: Catalog; children: ReactNode }) {
  const value = useMemo<CatalogValue>(
    () => ({
      products: catalog.products,
      bestSellers: bestSellersFrom(catalog.products),
      config: catalog.config,
      live: catalog.live,
      getProduct: (id) => catalog.products.find((p) => p.id === id),
    }),
    [catalog],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCatalog() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCatalog must be used inside <CatalogProvider>");
  return ctx;
}
