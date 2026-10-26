import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

type Variant = "accent" | "dark" | "light" | "ghost" | "outline-dark";

const variants: Record<Variant, string> = {
  accent: "bg-ink text-white hover:bg-[#333333]",
  dark: "bg-brand text-white hover:bg-[#333333]",
  light: "bg-white text-ink hover:bg-surface",
  ghost: "bg-white/8 text-white ring-1 ring-white/15 hover:bg-white/14",
  "outline-dark": "bg-white text-ink ring-1 ring-line hover:bg-surface",
};

interface ButtonLinkProps extends ComponentPropsWithoutRef<typeof Link> {
  variant?: Variant;
}

export function ButtonLink({ variant = "dark", className, ...props }: ButtonLinkProps) {
  return (
    <Link
      className={cn(
        "inline-flex min-h-12 items-center justify-center gap-2.5 rounded-2xl px-6 text-[15px] font-semibold transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
