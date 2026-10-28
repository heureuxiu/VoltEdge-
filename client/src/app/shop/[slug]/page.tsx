import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductCard } from "@/components/product/ProductCard";
import { ProductDetail } from "@/components/shop/ProductDetail";
import { ProductBento } from "@/components/shop/ProductBento";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Breadcrumbs } from "@/components/ui/PageHero";
import { getProduct, getRelatedProducts, products } from "@/data/products";
import { routes } from "@/data/site";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.id }));
}

export async function generateMetadata({ params }: PageProps<"/shop/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  return product ? { title: product.name, description: `${product.name} — ${product.spec}. Pay in 3 with Payflex.` } : {};
}

export default async function ProductPage({ params }: PageProps<"/shop/[slug]">) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const related = getRelatedProducts(slug);

  return (
    <Container className="mx-auto max-w-[1240px] pt-5">
      <div className="mb-4">
        <Breadcrumbs
          tone="light"
          items={[
            { label: "Home", href: routes.home },
            { label: "Shop", href: routes.shop },
            { label: product.name },
          ]}
        />
      </div>

      <ProductDetail product={product}>
        <ProductBento product={product} />

        <section className="mt-12" aria-labelledby="related-title">
          <SectionHeading
            eyebrow="More to love"
            title={<span id="related-title">You may also like</span>}
            action={
              <Link href={routes.shop} className="text-[15px] font-semibold hover:text-brand">
                View all →
              </Link>
            }
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      </ProductDetail>
    </Container>
  );
}
