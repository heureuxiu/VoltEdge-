import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <section className={cn("min-w-0 rounded-3xl border border-line bg-white p-4 shadow-[0_1px_2px_rgba(17,17,17,0.04)] sm:p-5", className)}>
      {children}
    </section>
  );
}

export function CardHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2 className="m-0 font-display text-base font-bold sm:text-lg">{title}</h2>
      {action}
    </div>
  );
}

/** Shared table header cell style. */
export const thClass = "border-b border-line px-3 py-2.5 text-left text-[11px] font-bold tracking-[0.06em] text-muted uppercase";
/** Shared table body cell style. */
export const tdClass = "border-b border-[#f0f0f2] px-3 py-3 text-sm group-last/row:border-b-0";
