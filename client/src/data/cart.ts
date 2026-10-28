import { getProduct } from "@/data/products";
import type { Product } from "@/types";

export interface CartLine {
  product: Product;
  variant: string;
  qty: number;
}

/** Demo cart contents shared by the cart drawer and the cart page — replace with your cart store / API. */
export const demoCart: CartLine[] = [
  { product: getProduct("iphone-17-pro-max")!, variant: "Deep Blue · 256GB · New", qty: 1 },
  { product: getProduct("airpods-pro-3")!, variant: "USB-C · New", qty: 1 },
];
