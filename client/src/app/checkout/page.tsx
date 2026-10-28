import type { Metadata } from "next";

import { CheckoutPage } from "@/components/checkout/CheckoutPage";

export const metadata: Metadata = {
  title: "Checkout",
};

export default function Checkout() {
  return <CheckoutPage />;
}
