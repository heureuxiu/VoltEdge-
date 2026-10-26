import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { categories } from "@/data/content";

/** Illustrated icon + soft tile gradient, keyed by category name. */
const categoryStyle: Record<string, { image: string; tile: string }> = {
  Phones: { image: "phones", tile: "from-[#e8eeff] to-[#cfd9ff]" },
  Laptops: { image: "laptops", tile: "from-[#fff4cc] to-[#ffe08a]" },
  Tablets: { image: "tablets", tile: "from-[#ffe9ea] to-[#ffc9cd]" },
  "TVs & Gadgets": { image: "tvs", tile: "from-[#e3f7ec] to-[#b9ebcf]" },
  Gaming: { image: "gaming", tile: "from-[#f1e9ff] to-[#d9c7ff]" },
  Accessories: { image: "accessories", tile: "from-[#e0f5fb] to-[#b4e6f4]" },
};

export function Categories() {
  return (
    <section className="mt-24" aria-labelledby="categories-title">
      <SectionHeading
        eyebrow="Browse"
        title={<span id="categories-title">Shop by category</span>}
        action={
          <Link href="/shop" className="flex items-center gap-1.5 text-[15px] font-semibold hover:text-brand">
            View all <ArrowRight className="size-4" aria-hidden />
          </Link>
        }
      />
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((category, index) => {
          const { image, tile } = categoryStyle[category.name];
          return (
            <Reveal key={category.name} delay={index * 0.05}>
              <Link
                href={category.href}
                className={`group flex h-full min-h-[190px] flex-col justify-between gap-5 rounded-[20px] bg-white p-[22px] ring-1 ring-line transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_48px_-24px_rgb(17_17_17/0.35)]`}
              >
                <span className={`grid size-[76px] place-items-center rounded-[22px] bg-gradient-to-br ${tile}`}>
                  <Image
                    src={`/images/categories/${image}.svg`}
                    alt=""
                    width={52}
                    height={52}
                    unoptimized
                    className="size-[52px] drop-shadow-[0_6px_8px_rgb(17_17_17/0.18)] transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110"
                  />
                </span>
                <span className="flex flex-col gap-0.5">
                  <b className="text-base">{category.name}</b>
                  <span className="text-[13px] text-muted">{category.description}</span>
                </span>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
