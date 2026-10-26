import Link from "next/link";

import { LogoMark } from "@/components/ui/LogoMark";
import { siteConfig } from "@/data/site";
import { cn } from "@/lib/utils";

interface LogoProps {
  tone?: "light" | "dark";
  className?: string;
}

export function Logo({ tone = "light", className }: LogoProps) {
  const onDark = tone === "dark";

  return (
    <Link
      href="/"
      className={cn("flex items-center gap-3", onDark ? "text-white" : "text-ink", className)}
      aria-label={`${siteConfig.name} home`}
    >
      <LogoMark />
      <span className="font-logo text-[22px] font-extrabold uppercase leading-none tracking-[0.01em]">
        {siteConfig.name}
      </span>
    </Link>
  );
}
