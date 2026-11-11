import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Surface container used across every screen. */
export function Card({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return <section className={cn("min-w-0 rounded-card border border-line bg-surface p-4 shadow-card sm:p-5", className)} {...props} />;
}

export function CardHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h2 className="m-0 text-base font-bold sm:text-lg">{title}</h2>
        {subtitle ? <p className="m-0 mt-0.5 text-xs text-muted">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}
