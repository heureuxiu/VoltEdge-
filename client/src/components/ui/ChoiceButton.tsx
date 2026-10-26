import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

type Variant = "card" | "chip" | "pill";

interface ChoiceButtonProps extends ComponentPropsWithoutRef<"button"> {
  selected: boolean;
  variant?: Variant;
  /** Use the accent "on dark background" style. */
  onDark?: boolean;
}

const shape: Record<Variant, string> = {
  card: "rounded-[18px] border-2 p-4 text-left",
  chip: "min-h-11 rounded-xl border px-4 text-sm font-semibold",
  pill: "min-h-11 rounded-full border px-[18px] text-sm font-semibold",
};

/** A toggle-style button used for option pickers (storage, colour, issues …). */
export function ChoiceButton({ selected, variant = "chip", onDark, className, ...props }: ChoiceButtonProps) {
  const state = onDark
    ? selected
      ? "border-accent bg-accent text-ink"
      : "border-white/16 bg-white/6 text-white hover:bg-white/12"
    : selected
      ? "border-brand bg-brand text-white"
      : "border-line bg-white text-ink hover:border-[#d4d4d8]";

  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        "cursor-pointer transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
        shape[variant],
        state,
        className,
      )}
      {...props}
    />
  );
}
