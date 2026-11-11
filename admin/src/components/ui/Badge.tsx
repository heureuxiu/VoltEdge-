import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type Tone = "ok" | "warn" | "danger" | "hero" | "accent" | "neutral";

const TONES: Record<Tone, string> = {
  ok: "bg-ok-soft text-ok",
  warn: "bg-warn-soft text-warn",
  danger: "bg-danger-soft text-danger",
  hero: "bg-hero-soft text-hero",
  accent: "bg-accent-soft text-accent-text",
  neutral: "bg-line-2 text-ink-2",
};

export function Badge({ tone = "neutral", dot = true, children, className }: { tone?: Tone; dot?: boolean; children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold whitespace-nowrap", TONES[tone], className)}>
      {dot ? <span aria-hidden className="size-1.5 rounded-full bg-current" /> : null}
      {children}
    </span>
  );
}

export function IdChip({ children }: { children: ReactNode }) {
  return <span className="rounded-lg bg-accent-soft px-2 py-0.5 font-mono text-[11.5px] font-semibold text-accent-text">{children}</span>;
}
