import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function StatusPill({ className, children }: { className: string; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-bold",
        className,
      )}
    >
      {children}
    </span>
  );
}
