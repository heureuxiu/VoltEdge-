import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  action?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  eyebrowClassName?: string;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  action,
  align = "left",
  tone = "light",
  eyebrowClassName,
  className,
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <div
      className={cn(
        "mb-8 flex flex-wrap items-end gap-4",
        centered ? "flex-col items-center text-center" : "justify-between",
        className,
      )}
    >
      <div>
        <span
          className={cn(
            "text-[13px] font-semibold uppercase tracking-[0.08em]",
            tone === "dark" ? "text-lime" : "text-brand",
            eyebrowClassName,
          )}
        >
          {eyebrow}
        </span>
        <h2
          className={cn(
            "mt-2 text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.05]",
            tone === "dark" ? "text-white" : "text-ink",
          )}
        >
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}
