import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";

import { Reveal } from "@/components/ui/Reveal";
import { siteConfig } from "@/data/site";

export function About() {
  return (
    <section className="mt-24 flex flex-wrap gap-4" aria-labelledby="about-title">
      {/* Placeholder store photo (Unsplash) — swap /public/images/about/store.jpg for your own shop photo. */}
      <div className="group relative flex min-h-[420px] flex-[1_1_420px] items-end overflow-hidden rounded-panel bg-surface p-7">
        <Image
          src="/images/about/store.jpg"
          alt={`Inside the ${siteConfig.name} store`}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
        <span className="relative flex items-center gap-2 rounded-[14px] bg-white px-4 py-3 text-sm font-semibold shadow-[0_12px_24px_-12px_rgb(17_17_17/0.5)]">
          <MapPin className="size-4" aria-hidden />
          {siteConfig.address}
        </span>
      </div>

      <Reveal className="flex flex-[1_1_420px] flex-col justify-center gap-5 rounded-panel bg-white p-7 ring-1 ring-line sm:p-12">
        <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-brand">A little about us</span>
        <h2 id="about-title" className="text-[clamp(1.75rem,3.4vw,2.625rem)] font-bold leading-[1.1]">
          Latest tech. Honest prices. Real support.
        </h2>
        <p className="leading-[1.7] text-muted">
          {siteConfig.name} is your go-to source for high-quality premium electronics. Our mission is to bring you the
          latest tech at fair prices, backed by certified repairs and genuine stock only — with service you can actually
          reach.
        </p>
        <ul className="flex flex-wrap gap-2">
          {siteConfig.serviceAreas.map((area) => (
            <li key={area} className="rounded-full bg-surface px-3.5 py-2 text-[13px] font-medium">
              {area}
            </li>
          ))}
        </ul>
        <Link href="/contact" className="font-semibold text-brand hover:underline">
          Find us · Hours &amp; areas →
        </Link>
      </Reveal>
    </section>
  );
}
