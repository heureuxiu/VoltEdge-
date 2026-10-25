import Link from "next/link";
import { Zap } from "lucide-react";

import { siteConfig } from "@/data/site";
import { cn } from "@/lib/utils";

interface LogoProps {
  tone?: "light" | "dark";
  className?: string;
}

export function Logo({ tone = "light", className }: LogoProps) {
  const onDark = tone === "dark";

  return (
    <Link href="/" className={cn("flex items-center gap-2.5", className)} aria-label={`${siteConfig.name} home`}>
      <span
        className={cn(
          "grid size-9 place-items-center rounded-[10px]",
          onDark ? "bg-lime" : "bg-ink",
        )}
      >
        <Zap className={cn("size-[18px]", onDark ? "text-ink" : "text-lime")} strokeWidth={2.4} aria-hidden />
      </span>
      <span className={cn("font-display text-[21px] font-bold tracking-tight", onDark ? "text-white" : "text-ink")}>
        {siteConfig.name}
      </span>
    </Link>
  );
}
