import type { Product, ProductCategory, ProductType } from "@/types";

const PRICE = "R [PRICE]";
const WAS = "R [WAS]";

export const products: Product[] = [
  {
    id: "iphone-17-pro-max",
    type: "phone",
    brand: "Apple",
    name: "iPhone 17 Pro Max",
    spec: "256GB · New",
    badge: "New",
    category: "iphone",
    image: "/images/products/iphone-17-pro-max.webp",
    tint: "bg-brand-soft",
    price: PRICE,
    compareAtPrice: WAS,
  },
  {
    id: "iphone-17",
    type: "phone",
    brand: "Apple",
    name: "iPhone 17",
    spec: "128GB · New",
    badge: "New",
    category: "iphone",
    image: "/images/products/iphone-17.webp",
    tint: "bg-[#f4f4f5]",
    price: PRICE,
  },
  {
    id: "iphone-15-pro",
    type: "phone",
    brand: "Apple",
    name: "iPhone 15 Pro",
    spec: "128GB · Pre-owned",
    badge: "Grade A",
    category: "iphone",
    image: "/images/products/iphone-15-pro.webp",
    tint: "bg-repair-soft",
    price: PRICE,
    compareAtPrice: WAS,
  },
  {
    id: "galaxy-s25-ultra",
    type: "phone",
    brand: "Samsung",
    name: "Galaxy S25 Ultra",
    spec: "256GB · New",
    badge: "New",
    category: "samsung",
    image: "/images/products/galaxy-s25-ultra.webp",
    tint: "bg-[#f4f4f5]",
    price: PRICE,
    compareAtPrice: WAS,
  },
  {
    id: "galaxy-s25",
    type: "phone",
    brand: "Samsung",
    name: "Galaxy S25",
    spec: "128GB · New",
    badge: "New",
    category: "samsung",
    image: "/images/products/galaxy-s25.webp",
    tint: "bg-[#f4f4f5]",
    price: PRICE,
  },
  {
    id: "galaxy-a36",
    type: "phone",
    brand: "Samsung",
    name: "Galaxy A36",
    spec: "128GB · New",
    badge: "Best value",
    category: "samsung",
    image: "/images/products/galaxy-a36.webp",
    tint: "bg-accent-soft",
    price: PRICE,
  },
  {
    id: "airpods-pro-3",
    type: "audio",
    brand: "Apple",
    name: "AirPods Pro 3",
    spec: "USB-C · ANC",
    badge: "Audio",
    category: "gadgets",
    image: "/images/products/airpods-pro-3.webp",
    tint: "bg-[#f1f1f3]",
    price: PRICE,
  },
  {
    id: "macbook-air",
    type: "laptop",
    brand: "Apple",
    name: "MacBook Air 13\"",
    spec: "M4 · 256GB",
    badge: "Laptop",
    category: "gadgets",
    image: "/images/products/macbook-air.webp",
    tint: "bg-brand-soft",
    price: PRICE,
    compareAtPrice: WAS,
  },
];

export const productFilters: { label: string; value: ProductCategory | "all" }[] = [
  { label: "All", value: "all" },
  { label: "iPhone", value: "iphone" },
  { label: "Samsung", value: "samsung" },
  { label: "Gadgets", value: "gadgets" },
];

/** Order used by the 3D best-sellers carousel (flagship sits in the middle). */
export const bestSellerIds = [
  "airpods-pro-3",
  "galaxy-s25-ultra",
  "iphone-17",
  "iphone-17-pro-max",
  "iphone-15-pro",
  "galaxy-s25",
  "galaxy-a36",
  "macbook-air",
];

export const bestSellers: Product[] = bestSellerIds
  .map((id) => products.find((p) => p.id === id))
  .filter((p): p is Product => Boolean(p));

export const productTypes: { label: string; value: ProductType | "all" }[] = [
  { label: "All products", value: "all" },
  { label: "Phones", value: "phone" },
  { label: "Laptops", value: "laptop" },
  { label: "Audio", value: "audio" },
];

export function getProduct(slug: string) {
  return products.find((p) => p.id === slug);
}

export function getRelatedProducts(slug: string, limit = 4) {
  const current = getProduct(slug);
  return products
    .filter((p) => p.id !== slug)
    .sort((a, b) => Number(b.type === current?.type) - Number(a.type === current?.type))
    .slice(0, limit);
}

/** Colour swatches shown on the product page. Swap for real variants per product. */
export const productColors: Record<string, { name: string; hex: string; glow: string }[]> = {
  "iphone-17-pro-max": [
    { name: "Deep Blue", hex: "#2e3a55", glow: "bg-brand" },
    { name: "Cosmic Orange", hex: "#d9763a", glow: "bg-orange-500" },
    { name: "Silver", hex: "#d9dce1", glow: "bg-slate-400" },
  ],
  default: [
    { name: "Black", hex: "#1a1c23", glow: "bg-brand" },
    { name: "White", hex: "#eef0f3", glow: "bg-slate-400" },
    { name: "Accent", hex: "#c7d2fe", glow: "bg-accent" },
  ],
};

export const productConditions = [
  { label: "New", description: "Sealed box" },
  { label: "Grade A", description: "Like new" },
  { label: "Grade B", description: "Light marks" },
];

export const productStorage = ["256GB", "512GB", "1TB", "2TB"];
