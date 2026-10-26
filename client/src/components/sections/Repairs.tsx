import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { ButtonLink } from "@/components/ui/ButtonLink";
import { Reveal } from "@/components/ui/Reveal";
import { repairServices, repairSteps } from "@/data/content";

export function Repairs() {
  return (
    <section
      id="repairs"
      className="mt-24 flex scroll-mt-28 flex-wrap gap-12 rounded-panel bg-white p-7 ring-1 ring-line sm:p-12 lg:p-16"
      aria-labelledby="repairs-title"
    >
      <div className="flex flex-[1_1_380px] flex-col gap-5">
        <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-repair">Repairs</span>
        <h2 id="repairs-title" className="text-[clamp(2rem,4vw,3.25rem)] font-bold leading-[1.05]">
          Broken today.
          <br />
          Fixed today.
        </h2>
        <p className="max-w-[440px] text-[17px] leading-relaxed text-muted">
          Certified technicians, quality parts and a 90-day warranty on every repair. Walk in or book a slot online.
        </p>

        <ol className="mt-2 flex flex-col gap-3.5">
          {repairSteps.map((step, index) => (
            <li key={step.title} className="flex items-start gap-4">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand font-display font-bold text-white">
                {index + 1}
              </span>
              <span>
                <b>{step.title}</b>
                <br />
                <span className="text-sm text-muted">{step.description}</span>
              </span>
            </li>
          ))}
        </ol>

        <div className="mt-3 flex flex-wrap gap-3">
          <ButtonLink href="/repairs/book">Book a repair</ButtonLink>
          <ButtonLink href="/repairs" variant="outline-dark">
            See repair prices
          </ButtonLink>
        </div>
      </div>

      <div className="grid flex-[1_1_420px] grid-cols-2 gap-3">
        {repairServices.map(({ name, icon: Icon }, index) => (
          <Reveal key={name} delay={index * 0.06}>
            <Link
              href="/repairs/book"
              className={`group flex h-full flex-col gap-5 rounded-[20px] bg-surface p-5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_40px_-24px_rgb(17_17_17/0.3)]`}
            >
              <span className="flex items-start justify-between">
                <span className="grid size-12 place-items-center rounded-2xl bg-white text-ink">
                  <Icon className="size-6" strokeWidth={1.7} aria-hidden />
                </span>
                <ArrowUpRight
                  className="size-5 text-muted opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink group-hover:opacity-100"
                  aria-hidden
                />
              </span>
              <span>
                <b className="text-base">{name}</b>
                <br />
                <span className="text-[13px] text-muted">From R [PRICE]</span>
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
