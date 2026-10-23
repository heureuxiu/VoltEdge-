import type { Metadata } from "next";

import { CheckoutFlow } from "@/components/cart/CheckoutFlow";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Cart & checkout",
};

export default function CartPage() {
  return (
    <Container className="pt-6">
      <CheckoutFlow />
    </Container>
  );
}
