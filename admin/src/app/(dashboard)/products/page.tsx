import type { Metadata } from "next";

import { ProductsView } from "@/views/products/ProductsView";

export const metadata: Metadata = { title: "Products" };

export default function ProductsPage() {
  return <ProductsView />;
}

/** This page sits behind the client-side session gate in AdminShell, so skip the instant-navigation check. */
export const instant = false;
