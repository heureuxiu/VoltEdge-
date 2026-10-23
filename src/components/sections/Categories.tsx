import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { categories } from "@/data/content";
import { cn } from "@/lib/utils";

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
        {categories.map(({ icon: Icon, ...category }, index) => (
          <Reveal key={category.name} delay={index * 0.05}>
            <Link
              href={category.href}
              className="flex h-full min-h-[150px] flex-col justify-between gap-4 rounded-[20px] bg-white p-[22px] ring-1 ring-line transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_48px_-24px_rgb(11_12_16/0.35)]"
            >
              <span className={cn("grid size-12 place-items-center rounded-[14px]", category.tint)}>
                <Icon className="size-[22px]" strokeWidth={1.8} aria-hidden />
              </span>
              <span className="flex flex-col gap-0.5">
                <b className="text-base">{category.name}</b>
                <span className="text-[13px] text-muted">{category.description}</span>
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
