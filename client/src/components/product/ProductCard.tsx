"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Heart, Plus } from "lucide-react";

import { routes } from "@/data/site";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [liked, setLiked] = useState(false);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-card bg-white ring-1 ring-line transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_48px_-24px_rgb(11_12_16/0.35)]">
      <div className={cn("relative flex h-60 items-center justify-center", product.tint)}>
        <span className="absolute left-3.5 top-3.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold">
          {product.badge}
        </span>
        <button
          type="button"
          aria-label={liked ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          aria-pressed={liked}
          onClick={() => setLiked((v) => !v)}
          className="absolute right-2.5 top-2.5 grid size-11 place-items-center rounded-full bg-white/90 transition-transform hover:scale-105"
        >
          <Heart className={cn("size-[18px] transition-colors", liked && "fill-repair text-repair")} aria-hidden />
        </button>
        <Link href={routes.product(product.id)} className="contents">
        <Image
          src={product.image}
          alt={product.name}
          width={240}
          height={300}
          className="h-[200px] w-auto max-w-[80%] object-contain drop-shadow-[0_20px_24px_rgb(11_12_16/0.2)] transition-transform duration-500 ease-[cubic-bezier(.2,.7,.2,1)] group-hover:-translate-y-2 group-hover:-rotate-3"
        />
        </Link>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-5">
        <span className="text-xs font-medium text-muted">{product.brand}</span>
        <h3 className="font-sans text-lg font-semibold">
          <Link href={routes.product(product.id)} className="hover:text-brand">
            {product.name}
          </Link>
        </h3>
        <span className="text-[13px] text-muted">{product.spec}</span>

        <div className="mt-auto flex items-center justify-between pt-3.5">
          <span className="flex flex-col">
            <b className="font-display text-xl">{product.price}</b>
            <span className="text-xs text-muted">or 3 × R [AMOUNT] with Payflex</span>
          </span>
          <button
            type="button"
            aria-label={`Add ${product.name} to cart`}
            onClick={() => onAddToCart?.(product)}
            className="grid size-11 place-items-center rounded-[14px] bg-ink text-white transition-transform hover:-translate-y-0.5 active:scale-95"
          >
            <Plus className="size-[18px]" strokeWidth={2.2} aria-hidden />
          </button>
        </div>
      </div>
    </article>
  );
}
