import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface Crumb {
  label: string;
  href?: string;
}

interface PageHeroProps {
  breadcrumbs: Crumb[];
  title: ReactNode;
  description?: ReactNode;
  /** Extra content beside the title (search box, status pill …). */
  aside?: ReactNode;
  /** Content under the title row (filter chips, forms …). */
  children?: ReactNode;
  glowClassName?: string;
  className?: string;
}

/** Light rounded page header used at the top of every inner page. */
export function PageHero({
  breadcrumbs,
  title,
  description,
  aside,
  children,
  glowClassName = "bg-brand",
  className,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "surface-glow relative overflow-hidden rounded-panel px-6 py-10 text-ink ring-1 ring-line sm:px-12 sm:py-14 lg:px-16",
        className,
      )}
    >
      <div aria-hidden className="absolute -right-40 -top-52 size-[600px] animate-spin-slow rounded-full border border-dashed border-brand/10" />
      <div aria-hidden className={cn("absolute right-16 top-6 size-72 rounded-full opacity-[0.28] blur-[80px]", glowClassName)} />
      <div aria-hidden className="absolute -bottom-24 left-10 size-64 rounded-full bg-lime opacity-[0.16] blur-[90px]" />

      <div className="relative flex flex-wrap items-end justify-between gap-7">
        <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-4">
          <Breadcrumbs items={breadcrumbs} tone="light" />
          <h1 className="animate-fade-up text-[clamp(2.5rem,5.4vw,4.5rem)] font-bold leading-none">
            {title}
          </h1>
          {description && <p className="max-w-[480px] text-[17px] leading-relaxed text-muted">{description}</p>}
        </div>
        {aside}
      </div>
      {children && <div className="relative mt-7">{children}</div>}
    </section>
  );
}

export function Breadcrumbs({ items, tone = "light" }: { items: Crumb[]; tone?: "dark" | "light" }) {
  const muted = tone === "dark" ? "text-muted-dark hover:text-white" : "text-muted hover:text-brand";
  const current = tone === "dark" ? "text-white" : "font-semibold text-ink";

  return (
    <nav aria-label="Breadcrumb" className="text-[13px]">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-1.5">
              {item.href && !last ? (
                <Link href={item.href} className={muted}>
                  {item.label}
                </Link>
              ) : (
                <span className={current} aria-current={last ? "page" : undefined}>
                  {item.label}
                </span>
              )}
              {!last && <span aria-hidden className={tone === "dark" ? "text-muted-dark" : "text-muted"}>/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
