import { cacheLife } from "next/cache";

import { api } from "@/lib/api";
import { fallbackConfig, toProduct, type Catalog, type ServerProduct, type StoreConfig } from "@/lib/catalog";
import { products as fallbackProducts } from "@/data/products";

/**
 * Server-only: load the live catalogue, falling back to the bundled sample data if the API is down.
 * Cached for a short time so pages can prerender; checkout always re-checks price and stock on the API.
 */
export async function fetchCatalog(): Promise<Catalog> {
  "use cache";
  cacheLife({ stale: 60, revalidate: 30, expire: 600 });
  try {
    const [products, config] = await Promise.all([api<ServerProduct[]>("/store/products"), api<StoreConfig>("/store/config")]);
    return { products: products.map(toProduct), config, live: true };
  } catch {
    return { products: fallbackProducts, config: fallbackConfig, live: false };
  }
}
