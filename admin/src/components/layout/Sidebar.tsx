"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowUpRight, SignOut } from "@phosphor-icons/react";

import { Avatar } from "@/components/ui/Avatar";
import { BrandTile } from "@/components/layout/Logo";
import { adminSite } from "@/config/site";
import { navItems } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { useAdmin } from "@/store/AdminStore";

/** Floating dark navigation rail (desktop). */
export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { session, signOut, orders, products, repairs, tradeIns, messages, settings } = useAdmin();
  const badge: Record<string, number> = {
    orders: orders.filter((o) => o.status === "Pending payment").length,
    products: products.filter((p) => p.stock <= settings.lowStockThreshold).length,
    repairs: repairs.filter((r) => r.status === "Ready to collect").length,
    "trade-ins": tradeIns.filter((t) => t.status === "Awaiting check-in").length,
    messages: messages.filter((m) => !m.handled).length,
  };

  return (
    <aside
      aria-label="Primary"
      className="sticky top-4 hidden h-[calc(100dvh-2rem)] min-h-[520px] flex-col gap-6 overflow-y-auto rounded-3xl border border-rail-line bg-rail px-3.5 pt-5 pb-3.5 text-rail-ink lg:flex"
    >
      <Link href="/dashboard" aria-label="VoltEdge Admin home" className="ve-fade rounded-2xl bg-rail-soft px-3 py-3">
        <BrandTile />
      </Link>

      <div>
        <p className="mb-1.5 px-3 text-[11px] font-semibold tracking-[0.12em] text-rail-mut uppercase">Workspace</p>
        <nav className="grid gap-1">
          {navItems.map((item) => {
            const active = pathname.startsWith(item.href);
            const Icon = item.icon;
            const count = badge[item.key] ?? 0;
            return (
              <Link
                key={item.key}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex items-center gap-3 rounded-[13px] px-3 py-[11px] text-sm font-medium transition-colors",
                  active ? "text-rail-hi" : "hover:bg-rail-line",
                )}
              >
                {active ? <span aria-hidden className="ve-fade absolute inset-0 rounded-[13px] bg-rail-act" /> : null}
                <Icon size={19} weight={active ? "fill" : "regular"} className={cn("relative z-10", active && "text-accent")} aria-hidden />
                <span className="relative z-10">{item.label}</span>
                {count > 0 ? (
                  <span className="relative z-10 ml-auto grid min-w-5 place-items-center rounded-full bg-accent px-1.5 text-[11px] leading-5 font-bold text-accent-ink">
                    {count}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
      </div>

      <a
        href={adminSite.storeUrl}
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-between rounded-[13px] border border-rail-line px-3 py-2.5 text-[13px] font-medium text-rail-mut transition-colors hover:bg-rail-line hover:text-rail-hi"
      >
        View storefront
        <ArrowUpRight size={16} aria-hidden />
      </a>

      <div className="mt-auto flex items-center gap-2.5 rounded-2xl border border-rail-line bg-rail-soft p-3">
        <Avatar name="Admin" />
        <div className="min-w-0 flex-1 leading-tight">
          <b className="block truncate text-[13px] text-rail-hi">Administrator</b>
          <span className="block truncate text-[11.5px] text-rail-mut">{session?.email ?? "Full access"}</span>
        </div>
        <button
          type="button"
          aria-label="Sign out"
          onClick={() => {
            signOut();
            router.replace("/login");
          }}
          className="grid size-9 place-items-center rounded-xl text-rail-mut transition-colors hover:bg-rail-line hover:text-rail-hi"
        >
          <SignOut size={18} aria-hidden />
        </button>
      </div>
    </aside>
  );
}
