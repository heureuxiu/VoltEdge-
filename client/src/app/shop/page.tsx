import type { Metadata } from "next";

import { ShopCatalog } from "@/components/shop/ShopCatalog";
import { TrustStrip } from "@/components/shop/TrustStrip";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Shop",
  description: "New and certified pre-owned phones, laptops and gadgets with Pay in 3.",
};

export default function ShopPage() {
  return (
    <Container className="pt-6">
      <ShopCatalog />
      <TrustStrip />
    </Container>
  );
}
