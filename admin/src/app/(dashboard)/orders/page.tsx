"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Search } from "lucide-react";

import { StatusPill } from "@/components/admin/StatusPill";
import {
  adminOrderStatuses,
  adminOrders,
  formatZar,
  orderStatusStyles,
  ordersNeedingAttention,
  totalOrdersAllTime,
  type OrderStatusFilter,
} from "@/data/admin";
import { cn } from "@/lib/utils";

export default function AdminOrdersPage() {
  const [filter, setFilter] = useState<OrderStatusFilter>("All");
  const [query, setQuery] = useState("");

  const visible = adminOrders.filter((o) => {
    const matchesFilter = filter === "All" || o.status === filter;
    const q = query.trim().toLowerCase();
    const matchesQuery = !q || o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q);
    return matchesFilter && matchesQuery;
  });

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="m-0 font-display text-[28px] font-bold tracking-tight">Orders</h1>
          <p className="mt-1 mb-0 text-sm text-muted">
            <b className="text-ink">{totalOrdersAllTime}</b> orders · <b className="text-ink">{ordersNeedingAttention}</b> need
            attention
          </p>
        </div>
        <button
          type="button"
          className="flex h-[46px] items-center gap-2 rounded-xl bg-ink px-[18px] text-sm font-semibold text-white"
        >
          <Plus className="size-4" strokeWidth={2} aria-hidden />
          New order
        </button>
      </div>

      <div className="flex flex-col gap-4 rounded-card border border-line bg-white p-[18px] shadow-[0_1px_2px_rgba(11,12,16,0.04)]">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div role="tablist" aria-label="Order status" className="flex flex-wrap gap-1.5 rounded-xl bg-surface p-[5px]">
            {adminOrderStatuses.map((status) => {
              const on = status === filter;
              return (
                <button
                  key={status}
                  role="tab"
                  aria-selected={on}
                  onClick={() => setFilter(status)}
                  className={cn(
                    "rounded-[9px] px-3.5 py-2.5 text-[13px] font-semibold",
                    on ? "bg-white text-ink shadow-[0_1px_2px_rgba(11,12,16,0.12)]" : "text-muted",
                  )}
                >
                  {status}
                </button>
              );
            })}
          </div>
          <label className="flex h-[42px] min-w-[220px] items-center gap-2 rounded-xl bg-surface px-3.5">
            <Search className="size-[15px] text-muted" strokeWidth={2} aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search order #, customer…"
              className="w-full border-0 bg-transparent text-[13px] outline-none"
            />
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse">
            <thead>
              <tr className="text-left">
                <th className="border-b border-line px-2.5 py-2.5">
                  <input type="checkbox" aria-label="Select all orders" />
                </th>
                {["Order", "Customer", "Items", "Date", "Total", "Status"].map((h) => (
                  <th
                    key={h}
                    className="border-b border-line px-2.5 py-2.5 text-[11px] font-bold tracking-[0.05em] text-muted uppercase"
                  >
                    {h}
                  </th>
                ))}
                <th className="border-b border-line px-2.5 py-2.5">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {visible.map((o) => (
                <tr key={o.id}>
                  <td className="border-b border-[#F0F1F3] px-2.5 py-3">
                    <input type="checkbox" aria-label={`Select ${o.id}`} />
                  </td>
                  <td className="border-b border-[#F0F1F3] px-2.5 py-3 text-sm font-bold">{o.id}</td>
                  <td className="border-b border-[#F0F1F3] px-2.5 py-3 text-sm">{o.customer}</td>
                  <td className="border-b border-[#F0F1F3] px-2.5 py-3 text-sm text-muted">{o.item}</td>
                  <td className="border-b border-[#F0F1F3] px-2.5 py-3 text-[13px] text-muted">{o.date}</td>
                  <td className="border-b border-[#F0F1F3] px-2.5 py-3 text-sm font-semibold">{formatZar(o.total)}</td>
                  <td className="border-b border-[#F0F1F3] px-2.5 py-3">
                    <StatusPill className={orderStatusStyles[o.status]}>{o.status}</StatusPill>
                  </td>
                  <td className="border-b border-[#F0F1F3] px-2.5 py-3 text-right">
                    <a href="#" aria-label={`View ${o.id}`} className="text-[13px] font-semibold text-brand">
                      View →
                    </a>
                  </td>
                </tr>
              ))}
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-2.5 py-8 text-center text-sm text-muted">
                    No orders match that filter.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1.5">
          <span className="text-[13px] text-muted">
            Showing <b className="text-ink">{visible.length}</b> of <b className="text-ink">{adminOrders.length}</b>
          </span>
          <nav aria-label="Pagination" className="flex gap-1.5">
            <button
              type="button"
              aria-label="Previous page"
              className="grid size-9 place-items-center rounded-[10px] border border-line bg-white"
            >
              <ChevronLeft className="size-[15px]" strokeWidth={2.2} aria-hidden />
            </button>
            <button type="button" aria-current="page" className="size-9 rounded-[10px] bg-ink text-[13px] font-bold text-white">
              1
            </button>
            <button type="button" className="size-9 rounded-[10px] border border-line bg-white text-[13px] font-semibold">
              2
            </button>
            <button type="button" className="size-9 rounded-[10px] border border-line bg-white text-[13px] font-semibold">
              3
            </button>
            <button
              type="button"
              aria-label="Next page"
              className="grid size-9 place-items-center rounded-[10px] border border-line bg-white"
            >
              <ChevronRight className="size-[15px]" strokeWidth={2.2} aria-hidden />
            </button>
          </nav>
        </div>
      </div>
    </>
  );
}
