import Link from "next/link";

import { Reveal } from "@/components/ui/Reveal";
import { siteConfig } from "@/data/site";

export function About() {
  return (
    <section className="mt-24 flex flex-wrap gap-4" aria-labelledby="about-title">
      {/* Replace with a real store photo: <Image src="/images/store.jpg" ... /> */}
      <div className="relative flex min-h-[420px] flex-[1_1_420px] items-end overflow-hidden rounded-panel bg-brand-soft p-7">
        <div aria-hidden className="absolute -right-20 -top-20 size-80 rounded-full bg-brand/18" />
        <span className="relative rounded-[14px] bg-white px-4 py-3 text-sm font-semibold">
          [STORE PHOTO] · {siteConfig.address}
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
