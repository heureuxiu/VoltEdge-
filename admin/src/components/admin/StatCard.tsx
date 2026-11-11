import { TrendDown, TrendUp } from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: Icon;
  iconClassName: string;
  tintClassName: string;
  value: string;
  label: string;
  trend?: string;
  trendUp?: boolean;
}

export function StatCard({ icon: Icon, iconClassName, tintClassName, value, label, trend, trendUp }: StatCardProps) {
  return (
    <div className="flex min-w-0 flex-col gap-4 rounded-3xl border border-line bg-white p-4 shadow-[0_1px_2px_rgba(17,17,17,0.04)] sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <span className={cn("grid size-11 shrink-0 place-items-center rounded-2xl", tintClassName)}>
          <Icon className={cn("size-[22px]", iconClassName)} weight="duotone" aria-hidden />
        </span>
        {trend ? (
          <span
            className={cn(
              "inline-flex max-w-full items-center gap-1 rounded-full px-2 py-1 text-[11px] font-bold",
              trendUp ? "bg-[#DCFCE7] text-[#15803D]" : "bg-[#FEE2E2] text-[#DC2626]",
            )}
          >
            {trendUp ? <TrendUp className="size-3 shrink-0" weight="bold" aria-hidden /> : <TrendDown className="size-3 shrink-0" weight="bold" aria-hidden />}
            <span className="truncate">{trend}</span>
          </span>
        ) : null}
      </div>
      <div className="min-w-0">
        <b className="block truncate font-display text-2xl font-bold tracking-tight sm:text-[28px]">{value}</b>
        <span className="text-[13px] text-muted">{label}</span>
      </div>
    </div>
  );
}
