import Link from "next/link";
import { ArrowUpRight, Repeat, ShoppingBag, Wrench, type LucideIcon } from "lucide-react";

import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

interface Action {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  cardClassName: string;
  iconWrapClassName: string;
  iconClassName: string;
  descriptionClassName: string;
}

const actions: Action[] = [
  {
    title: "Shop",
    description: "New & certified pre-owned phones, laptops and gadgets.",
    href: "/shop",
    icon: ShoppingBag,
    cardClassName: "bg-white ring-1 ring-line",
    iconWrapClassName: "bg-brand-soft",
    iconClassName: "text-brand",
    descriptionClassName: "text-muted",
  },
  {
    title: "Trade-in",
    description: "Swap your old device for credit towards your next upgrade.",
    href: "/trade-in",
    icon: Repeat,
    cardClassName: "bg-[#fff1b8] text-ink ring-1 ring-[#f3dd8a]",
    iconWrapClassName: "bg-white",
    iconClassName: "text-ink",
    descriptionClassName: "text-ink/70",
  },
  {
    title: "Repair",
    description: "Same-day phone, laptop & MacBook repairs with warranty.",
    href: "/repairs",
    icon: Wrench,
    cardClassName: "bg-white ring-1 ring-line",
    iconWrapClassName: "bg-repair-soft",
    iconClassName: "text-repair",
    descriptionClassName: "text-muted",
  },
];

export function QuickActions() {
  return (
    <section className="mt-4 grid gap-4 md:grid-cols-3" aria-label="Shop, trade or repair">
      {actions.map(({ icon: Icon, ...action }, index) => (
        <Reveal key={action.title} delay={index * 0.08}>
          <Link
            href={action.href}
            className={cn(
              "group flex h-full flex-col gap-10 rounded-card p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_48px_-24px_rgb(17_17_17/0.35)]",
              action.cardClassName,
            )}
          >
            <div className="flex items-start justify-between">
              <span className={cn("grid size-[52px] place-items-center rounded-2xl", action.iconWrapClassName)}>
                <Icon className={cn("size-6", action.iconClassName)} aria-hidden />
              </span>
              <ArrowUpRight
                className="size-[22px] transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                aria-hidden
              />
            </div>
            <div>
              <h3 className="mb-1.5 text-2xl font-bold">{action.title}</h3>
              <p className={cn("text-[15px] leading-normal", action.descriptionClassName)}>{action.description}</p>
            </div>
          </Link>
        </Reveal>
      ))}
    </section>
  );
}
