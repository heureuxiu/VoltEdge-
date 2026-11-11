"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  GearSix,
  Package,
  ShoppingBag,
  SignOut,
  SquaresFour,
  Users,
  Wrench,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";

import { LogoMark } from "@/components/admin/LogoMark";
import { adminSite } from "@/data/site";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: Icon;
  soon?: boolean;
}

export const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: SquaresFour },
  { label: "Orders", href: "/orders", icon: ShoppingBag },
  { label: "Products", href: "/products", icon: Package },
  { label: "Repairs & trade-ins", href: "/repairs", icon: Wrench },
  { label: "Customers", href: "#", icon: Users, soon: true },
  { label: "Settings", href: "#", icon: GearSix, soon: true },
];

interface AdminSidebarProps {
  collapsed?: boolean;
  onNavigate?: () => void;
}

/** Full-height sidebar. Rendered inside a fixed container by AdminShell (desktop rail + mobile drawer). */
export function AdminSidebar({ collapsed = false, onNavigate }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-full min-h-0 flex-col bg-ink text-white">
      <a
        href={adminSite.storeUrl}
        aria-label={`${adminSite.name} home`}
        className={cn("flex h-16 shrink-0 items-center gap-3 border-b border-white/10 px-5", collapsed && "justify-center px-0")}
      >
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent text-ink">
          <LogoMark className="h-[17px]" />
        </span>
        {collapsed ? null : (
          <span className="flex min-w-0 flex-col leading-tight">
            <span className="font-logo text-[15px] font-extrabold uppercase leading-none tracking-[0.01em]">{adminSite.name}</span>
            <span className="mt-1 text-[10px] font-semibold tracking-[0.14em] text-white/45 uppercase">Admin</span>
          </span>
        )}
      </a>

      <nav aria-label="Admin" className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
        {collapsed ? null : (
          <span className="mb-1 px-3 text-[10px] font-bold tracking-[0.14em] text-white/35 uppercase">Manage</span>
        )}
        {navItems.map((item) => {
          const isActive = !item.soon && !!pathname?.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={onNavigate}
              title={collapsed ? item.label : undefined}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "group/nav relative flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition-colors",
                collapsed && "justify-center px-0",
                isActive ? "bg-white/10 text-white" : "text-white/55 hover:bg-white/5 hover:text-white",
              )}
            >
              {isActive ? (
                <span aria-hidden className="absolute top-2.5 bottom-2.5 -left-3 w-1 rounded-r-full bg-accent" />
              ) : null}
              <Icon
                className={cn("size-[21px] shrink-0 transition-colors", isActive && "text-accent")}
                weight={isActive ? "fill" : "regular"}
                aria-hidden
              />
              {collapsed ? null : <span className="min-w-0 flex-1 truncate">{item.label}</span>}
              {item.soon && !collapsed ? (
                <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] font-bold tracking-[0.04em] text-white/50 uppercase">
                  Soon
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="flex shrink-0 flex-col gap-2 border-t border-white/10 p-3">
        {collapsed ? null : (
          <a
            href={adminSite.storeUrl}
            className="flex items-center justify-between rounded-xl bg-accent px-3.5 py-3 text-[13px] font-bold text-ink transition-transform hover:-translate-y-0.5"
          >
            View storefront
            <ArrowUpRight className="size-4" weight="bold" aria-hidden />
          </a>
        )}
        <div className={cn("flex items-center gap-2.5 rounded-xl bg-white/5 p-2.5", collapsed && "justify-center p-2")}>
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white font-display text-sm font-bold text-ink">
            A
          </span>
          {collapsed ? null : (
            <>
              <span className="flex min-w-0 flex-1 flex-col leading-tight">
                <b className="truncate text-[13px] font-semibold">Admin</b>
                <span className="truncate text-xs text-white/45">Store manager</span>
              </span>
              <Link
                href="/login"
                aria-label="Sign out"
                className="grid size-8 place-items-center rounded-lg text-white/55 transition-colors hover:bg-white/10 hover:text-white"
              >
                <SignOut className="size-[18px]" aria-hidden />
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
