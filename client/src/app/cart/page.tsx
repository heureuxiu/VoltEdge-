import type { Metadata } from "next";

import { CartView } from "@/components/cart/CartView";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Cart",
};

export default function CartPage() {
  return (
    <Container className="mx-auto max-w-[1240px] pt-6">
      <CartView />
    </Container>
  );
}
