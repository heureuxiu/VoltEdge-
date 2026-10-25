"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  LayoutGrid,
  Package,
  ShoppingBag,
  SlidersHorizontal,
  Users,
  Wrench,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { adminSite } from "@/data/site";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  soon?: boolean;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  { label: "Orders", href: "/orders", icon: ShoppingBag },
  { label: "Products", href: "/products", icon: Package },
  { label: "Repairs & trade-ins", href: "/repairs", icon: Wrench },
  { label: "Customers", href: "#", icon: Users, soon: true },
  { label: "Settings", href: "#", icon: SlidersHorizontal, soon: true },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-[260px] shrink-0 flex-col border-r border-line bg-white">
      <a
        href={adminSite.storeUrl}
        aria-label={`${adminSite.name} home`}
        className="flex items-center gap-2.5 border-b border-line px-[22px] py-5 text-ink"
      >
        <span className="grid size-[34px] shrink-0 place-items-center rounded-[10px] bg-ink">
          <Zap className="size-[17px] text-lime" strokeWidth={2.4} aria-hidden />
        </span>
        <span className="flex min-w-0 flex-col leading-tight">
          <span className="font-display text-[17px] font-bold tracking-tight">{adminSite.name}</span>
          <span className="text-[11px] font-semibold tracking-[0.08em] text-[#9aa0ad] uppercase">Admin</span>
        </span>
      </a>

      <nav aria-label="Admin" className="flex flex-1 flex-col gap-0.5 px-3.5 py-[18px]">
        <span className="mb-1.5 px-2.5 text-[11px] font-bold tracking-[0.08em] text-[#9aa0ad] uppercase">
          Manage
        </span>
        {navItems.map((item) => {
          const isActive = !item.soon && pathname?.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-[10px] px-3 py-[11px] text-sm font-semibold",
                isActive ? "bg-[#EEF1FF] text-brand" : "text-muted hover:bg-surface",
              )}
            >
              <span className="flex size-5 shrink-0 items-center justify-center" aria-hidden>
                <Icon className="size-5" strokeWidth={isActive ? 2.2 : 2} />
              </span>
              <span className="min-w-0 flex-1">{item.label}</span>
              {item.soon ? (
                <span className="rounded-md bg-surface px-1.5 py-0.5 text-[10px] font-bold tracking-[0.04em] text-[#9aa0ad] uppercase">
                  Soon
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-col gap-2.5 border-t border-line px-3.5 py-4">
        <div className="flex items-center gap-2.5 rounded-xl bg-surface px-2.5 py-2">
          <span className="grid size-[34px] shrink-0 place-items-center rounded-full bg-brand font-display text-sm font-bold text-white">
            A
          </span>
          <span className="flex min-w-0 flex-col">
            <b className="truncate text-sm font-semibold text-ink">Admin</b>
            <span className="text-xs text-muted">Store manager</span>
          </span>
        </div>
        <a
          href={adminSite.storeUrl}
          className="flex items-center gap-2 rounded-[10px] px-2.5 py-2.5 text-[13px] font-semibold text-muted hover:bg-surface"
        >
          <ArrowLeft className="size-4" strokeWidth={2} aria-hidden />
          Back to store
        </a>
      </div>
    </aside>
  );
}
