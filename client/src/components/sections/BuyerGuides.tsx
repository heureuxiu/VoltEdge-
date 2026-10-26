import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { guides } from "@/data/content";

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
              className={`group flex h-full flex-col overflow-hidden rounded-card bg-white ring-1 ring-line transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_48px_-24px_rgb(17_17_17/0.35)]`}
            >
              <div className="relative flex h-44 items-end overflow-hidden bg-surface p-4">
                <Image
                  src={guide.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent" />
                <span className="relative rounded-full bg-white px-3 py-1.5 text-xs font-semibold shadow-sm">{guide.tag}</span>
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
