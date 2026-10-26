import { TrendingDown, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  iconClassName: string;
  tintClassName: string;
  value: string;
  label: string;
  trend?: string;
  trendUp?: boolean;
}

export function StatCard({ icon: Icon, iconClassName, tintClassName, value, label, trend, trendUp }: StatCardProps) {
  return (
    <div className="flex min-w-0 flex-col gap-4 rounded-card border border-line bg-white p-[22px] shadow-[0_1px_2px_rgba(17,17,17,0.04)]">
      <div className="flex items-center justify-between gap-2.5">
        <span className={cn("grid size-11 shrink-0 place-items-center rounded-[14px]", tintClassName)}>
          <Icon className={cn("size-[19px]", iconClassName)} strokeWidth={2} aria-hidden />
        </span>
        {trend ? (
          <span
            className={cn(
              "inline-flex w-fit shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold",
              trendUp ? "bg-[#DCFCE7] text-[#15803D]" : "bg-[#FEE2E2] text-[#DC2626]",
            )}
          >
            {trendUp ? (
              <TrendingUp className="size-2.5" strokeWidth={3.5} aria-hidden />
            ) : (
              <TrendingDown className="size-2.5" strokeWidth={3.5} aria-hidden />
            )}
            {trend}
          </span>
        ) : null}
      </div>
      <div>
        <b className="block font-display text-[28px] font-bold tracking-tight">{value}</b>
        <span className="text-[13px] text-muted">{label}</span>
      </div>
    </div>
  );
}
