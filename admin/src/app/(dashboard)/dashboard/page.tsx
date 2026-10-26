import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  Banknote,
  Bell,
  Search,
  ShoppingCart,
  Wrench,
  Repeat,
} from "lucide-react";

import { StatCard } from "@/components/admin/StatCard";
import { StatusPill } from "@/components/admin/StatusPill";
import {
  adminOrders,
  adminRepairs,
  dashboardStats,
  formatZar,
  lowStockProducts,
  orderStatusStyles,
  repairStatusStyles,
  salesThisWeek,
  salesThisWeekTotal,
} from "@/data/admin";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function AdminDashboardPage() {
  const recentOrders = adminOrders.slice(0, 5);
  const repairQueue = adminRepairs.slice(0, 4);
  const maxSales = Math.max(...salesThisWeek.map((d) => d.amount));

  return (
    <>
      {/* Topbar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="m-0 font-display text-[28px] font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 mb-0 text-sm text-muted">Welcome back — here&apos;s how the store is doing today.</p>
        </div>
        <div className="flex items-center gap-2.5">
          <label className="flex h-11 min-w-[240px] items-center gap-2 rounded-xl border border-line bg-white px-3.5">
            <Search className="size-4 text-muted" strokeWidth={2} aria-hidden />
            <span className="sr-only">Search orders, products, customers</span>
            <input
              type="search"
              placeholder="Search orders, products, customers…"
              className="w-full border-0 bg-transparent text-sm outline-none"
            />
          </label>
          <button
            type="button"
            aria-label="Notifications"
            className="relative grid size-11 place-items-center rounded-xl border border-line bg-white"
          >
            <Bell className="size-[18px]" strokeWidth={2} aria-hidden />
            <span aria-hidden className="absolute top-2 right-[9px] size-2 rounded-full border-2 border-white bg-[#DC2626]" />
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={Banknote}
          tintClassName="bg-brand-soft"
          iconClassName="text-brand"
          value={formatZar(dashboardStats.revenueToday)}
          label="Revenue today"
          trend="+12% vs yesterday"
          trendUp
        />
        <StatCard
          icon={ShoppingCart}
          tintClassName="bg-accent-soft"
          iconClassName="text-brand"
          value={String(dashboardStats.ordersToday)}
          label="Orders today"
          trend="+4 vs yesterday"
          trendUp
        />
        <StatCard
          icon={Wrench}
          tintClassName="bg-repair-soft"
          iconClassName="text-repair"
          value={String(dashboardStats.repairsInQueue)}
          label="Repairs in queue"
          trend="2 overdue"
          trendUp={false}
        />
        <StatCard
          icon={Repeat}
          tintClassName="bg-brand-soft"
          iconClassName="text-brand"
          value={String(dashboardStats.tradeInRequests)}
          label="Trade-in requests"
          trend="+2 today"
          trendUp
        />
      </div>

      {/* Recent orders + side column */}
      <div className="flex flex-wrap items-start gap-4">
        <div className="min-w-0 flex-[999_1_480px] rounded-card border border-line bg-white p-[22px] shadow-[0_1px_2px_rgba(17,17,17,0.04)]">
          <div className="flex items-center justify-between gap-3">
            <b className="font-display text-lg font-bold">Recent orders</b>
            <Link href="/orders" className="text-[13px] font-semibold text-brand">
              View all →
            </Link>
          </div>
          <div className="mt-3.5 overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse">
              <thead>
                <tr className="text-left">
                  {["Order", "Customer", "Item", "Total", "Status"].map((h) => (
                    <th
                      key={h}
                      className="border-b border-line px-2.5 py-2 text-[11px] font-bold tracking-[0.05em] text-muted uppercase"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id}>
                    <td className="border-b border-[#ececee] px-2.5 py-[11px] text-sm font-semibold">{o.id}</td>
                    <td className="border-b border-[#ececee] px-2.5 py-[11px] text-sm">{o.customer}</td>
                    <td className="border-b border-[#ececee] px-2.5 py-[11px] text-sm text-muted">{o.item}</td>
                    <td className="border-b border-[#ececee] px-2.5 py-[11px] text-sm font-semibold">
                      {formatZar(o.total)}
                    </td>
                    <td className="border-b border-[#ececee] px-2.5 py-[11px]">
                      <StatusPill className={orderStatusStyles[o.status]}>{o.status}</StatusPill>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex min-w-0 flex-[1_1_300px] flex-col gap-4">
          <div className="rounded-card border border-line bg-white p-[22px] shadow-[0_1px_2px_rgba(17,17,17,0.04)]">
            <b className="font-display text-base font-bold">Today&apos;s repair queue</b>
            <div className="mt-3 flex flex-col">
              {repairQueue.map((r) => (
                <div key={r.id} className="flex items-center gap-2.5 border-t border-[#ececee] py-2">
                  <span className="grid size-[34px] shrink-0 place-items-center rounded-[10px] bg-repair-soft">
                    <Wrench className="size-4 text-repair" strokeWidth={2} aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <b className="block truncate text-[13px] font-semibold">{r.device}</b>
                    <span className="text-xs text-muted">{r.issue}</span>
                  </span>
                  <span className="shrink-0">
                    <StatusPill className={repairStatusStyles[r.status]}>{r.status}</StatusPill>
                  </span>
                </div>
              ))}
            </div>
            <Link href="/repairs" className="mt-1 block text-[13px] font-semibold text-brand">
              View repair queue →
            </Link>
          </div>

          <div className="flex flex-col gap-2.5 rounded-card border border-accent-dark/20 bg-accent-soft p-5">
            <span className="flex items-center gap-2 text-[13px] font-bold text-brand">
              <AlertTriangle className="size-4" strokeWidth={2.2} aria-hidden />
              Low stock
            </span>
            {lowStockProducts.map((p) => (
              <span key={p.id} className="flex items-center justify-between text-[13px] font-semibold">
                {p.name}
                <b className="text-brand">{p.stock} left</b>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Sales chart */}
      <div className="flex flex-col gap-4 rounded-card border border-line bg-white p-[22px] shadow-[0_1px_2px_rgba(17,17,17,0.04)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <b className="font-display text-base font-bold">Sales this week</b>
          <span className="text-[13px] text-muted">
            Total <b className="text-ink">{formatZar(salesThisWeekTotal)}</b>
          </span>
        </div>
        <div className="flex h-[140px] items-end gap-3.5">
          {salesThisWeek.map((d) => (
            <div key={d.day} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
              <div
                className={`w-full max-w-10 rounded-t-lg rounded-b-[3px] ${d.day === "Sat" ? "bg-accent" : "bg-brand-soft"}`}
                style={{ height: `${(d.amount / maxSales) * 100}%` }}
              />
              <span className="text-xs font-semibold text-muted">{d.day}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
