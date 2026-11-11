import type { Product } from "@/types";

export interface CartLine {
  product: Product;
  variant: string;
  qty: number;
}
