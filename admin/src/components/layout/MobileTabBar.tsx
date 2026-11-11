"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { navItems } from "@/config/navigation";
import { cn } from "@/lib/utils";

/** Bottom tab bar (below lg). Scrolls horizontally so every section stays reachable. */
export function MobileTabBar() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 flex overflow-x-auto border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur [scrollbar-width:none] lg:hidden"
    >
      {navItems.map((item) => {
        const active = pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.key}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex min-w-[76px] flex-1 flex-col items-center gap-1 px-2 pt-2.5 pb-2 text-[11px] font-semibold transition-colors",
              active ? "text-ink" : "text-muted",
            )}
          >
            <span className={cn("grid h-7 w-12 place-items-center rounded-full transition-colors", active && "bg-accent text-accent-ink")}>
              <Icon size={20} weight={active ? "fill" : "regular"} aria-hidden />
            </span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
