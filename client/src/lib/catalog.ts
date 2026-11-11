import { formatZar } from "@/lib/money";
import { bestSellerIds } from "@/data/products";
import type { Product, ProductCategory, ProductType } from "@/types";

export interface ServerProduct {
  id: string;
  type: ProductType;
  brand: string;
  name: string;
  spec: string;
  badge: string;
  category: ProductCategory;
  image: string;
  tint: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
}

export interface StoreConfig {
  storeName: string;
  supportEmail: string;
  whatsapp: string;
  shipping: { standard: number; express: number };
  repairPrices: Record<string, number>;
}

export const fallbackConfig: StoreConfig = {
  storeName: "VoltEdge",
  supportEmail: "",
  whatsapp: "",
  shipping: { standard: 99, express: 199 },
  repairPrices: {},
};

export function toProduct(p: ServerProduct): Product {
  return {
    id: p.id,
    type: p.type,
    brand: p.brand,
    name: p.name,
    spec: p.spec,
    badge: p.stock <= 0 ? "Sold out" : p.badge,
    category: p.category,
    image: p.image,
    tint: p.tint,
    price: formatZar(p.price),
    priceValue: p.price,
    compareAtPrice: p.compareAtPrice ? formatZar(p.compareAtPrice) : undefined,
    compareAtValue: p.compareAtPrice ?? undefined,
    stock: p.stock,
  };
}

export interface Catalog {
  products: Product[];
  config: StoreConfig;
  /** False when the API could not be reached and the built-in sample catalogue is shown instead. */
  live: boolean;
}

export function relatedProducts(all: Product[], slug: string, limit = 4) {
  const current = all.find((p) => p.id === slug);
  return all
    .filter((p) => p.id !== slug)
    .sort((a, b) => Number(b.type === current?.type) - Number(a.type === current?.type))
    .slice(0, limit);
}

/** Carousel order: the curated list first, then anything else in the catalogue. */
export function bestSellersFrom(all: Product[]) {
  const ranked = bestSellerIds.map((id) => all.find((p) => p.id === id)).filter((p): p is Product => Boolean(p));
  const rest = all.filter((p) => !bestSellerIds.includes(p.id));
  const list = [...ranked, ...rest];
  return list.length >= 3 ? list : all;
}
