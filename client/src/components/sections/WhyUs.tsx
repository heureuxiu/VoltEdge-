import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { perks } from "@/data/content";
import { siteConfig } from "@/data/site";

export function WhyUs() {
  return (
    <section className="mt-24" aria-labelledby="why-title">
      <SectionHeading align="center" eyebrow={`Why ${siteConfig.name}`} title={<span id="why-title">Tech you can trust</span>} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {perks.map(({ icon: Icon, ...perk }, index) => (
          <Reveal
            key={perk.title}
            delay={index * 0.08}
            className={`flex flex-col gap-4 rounded-card bg-white p-7 ring-1 ring-line transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_48px_-24px_rgb(17_17_17/0.3)]`}
          >
            <span className="grid size-12 place-items-center rounded-2xl bg-white text-ink">
              <Icon className="size-6" strokeWidth={1.7} aria-hidden />
            </span>
            <b className="font-display text-xl">{perk.title}</b>
            <p className="text-[15px] leading-relaxed text-muted">{perk.description}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
