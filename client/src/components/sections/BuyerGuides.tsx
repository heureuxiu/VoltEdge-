import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { guides } from "@/data/content";
import { cn } from "@/lib/utils";

export function BuyerGuides() {
  return (
    <section id="guides" className="mt-24 scroll-mt-28" aria-labelledby="guides-title">
      <SectionHeading
        eyebrow="Buyer's guides"
        title={<span id="guides-title">Buy smarter</span>}
        action={
          <Link href="#guides" className="text-[15px] font-semibold hover:text-brand">
            All buyer&apos;s guides →
          </Link>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {guides.map((guide, index) => (
          <Reveal key={guide.title} delay={(index % 3) * 0.08}>
            <Link
              href={guide.href}
              className="group flex h-full flex-col overflow-hidden rounded-card bg-white ring-1 ring-line transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_48px_-24px_rgb(11_12_16/0.35)]"
            >
              <div className={cn("flex h-36 items-end p-4", guide.tint)}>
                <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold">{guide.tag}</span>
              </div>
              <div className="flex items-start justify-between gap-4 p-5">
                <b className="text-[17px] leading-snug">{guide.title}</b>
                <ArrowUpRight
                  className="size-5 shrink-0 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                  aria-hidden
                />
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
