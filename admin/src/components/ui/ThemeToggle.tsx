"use client";

import { Moon, Sun } from "@phosphor-icons/react";

import { useTheme } from "@/components/Providers";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const dark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-xl border border-line bg-surface text-ink-2 transition-colors hover:border-ink-2 hover:text-ink"
    >
      <span key={dark ? "sun" : "moon"} className="ve-pop grid place-items-center">
        {dark ? <Sun className="size-5" aria-hidden /> : <Moon className="size-5" aria-hidden />}
      </span>
    </button>
  );
}
