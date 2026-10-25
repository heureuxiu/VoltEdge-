"use client";

import { useMemo, useState } from "react";
import { Pencil, Plus, Search } from "lucide-react";

import { adminProductCategories, adminProducts, formatZar } from "@/data/admin";
import { cn } from "@/lib/utils";

export default function AdminProductsPage() {
  const [category, setCategory] = useState<(typeof adminProductCategories)[number]>("All");

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const c of adminProductCategories) {
      map.set(c, c === "All" ? adminProducts.length : adminProducts.filter((p) => p.category === c).length);
    }
    return map;
  }, []);

  const lowCount = adminProducts.filter((p) => p.stock > 0 && p.stock <= 5).length;
  const visible = category === "All" ? adminProducts : adminProducts.filter((p) => p.category === category);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="m-0 font-display text-[28px] font-bold tracking-tight">Products</h1>
          <p className="mt-1 mb-0 text-sm text-muted">
            <b className="text-ink">{adminProducts.length}</b> products · <b className="text-[#DC2626]">{lowCount}</b> low on
            stock
          </p>
        </div>
        <button
          type="button"
          className="flex h-[46px] items-center gap-2 rounded-xl bg-ink px-[18px] text-sm font-semibold text-white"
        >
          <Plus className="size-4" strokeWidth={2} aria-hidden />
          Add product
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {adminProductCategories.map((c) => {
          const on = c === category;
          return (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={cn(
                "cursor-pointer rounded-full border px-4 py-2.5 text-[13px] font-semibold",
                on ? "border-ink bg-ink text-white" : "border-line bg-white text-ink",
              )}
            >
              {c} <span className="font-medium opacity-60">{counts.get(c)}</span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-3.5 rounded-card border border-line bg-white p-[18px] shadow-[0_1px_2px_rgba(11,12,16,0.04)]">
        <label className="flex h-11 max-w-[320px] items-center gap-2 rounded-xl bg-surface px-3.5">
          <Search className="size-[15px] text-muted" strokeWidth={2} aria-hidden />
          <input
            type="search"
            placeholder="Search products…"
            className="w-full border-0 bg-transparent text-[13px] outline-none"
          />
        </label>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse">
            <thead>
              <tr className="text-left">
                {["Product", "Category", "Price", "Stock", "Status"].map((h) => (
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
              {visible.map((p) => {
                const statusLabel = p.stock === 0 ? "Out of stock" : p.stock <= 5 ? "Low stock" : "In stock";
                const statusClass =
                  p.stock === 0
                    ? "bg-[#FEE2E2] text-[#DC2626]"
                    : p.stock <= 5
                      ? "bg-[#FEF3C7] text-[#B45309]"
                      : "bg-[#DCFCE7] text-[#15803D]";
                return (
                  <tr key={p.id}>
                    <td className="border-b border-[#F0F1F3] px-2.5 py-2.5">
                      <span className="flex items-center gap-2.5">
                        <span className={cn("size-[38px] shrink-0 rounded-[10px]", p.tint)} />
                        <span className="flex min-w-0 flex-col">
                          <b className="text-sm font-semibold whitespace-nowrap">{p.name}</b>
                          <span className="text-xs text-muted">{p.spec}</span>
                        </span>
                      </span>
                    </td>
                    <td className="border-b border-[#F0F1F3] px-2.5 py-2.5 text-sm text-muted">{p.category}</td>
                    <td className="border-b border-[#F0F1F3] px-2.5 py-2.5 text-sm font-semibold">{formatZar(p.price)}</td>
                    <td
                      className={cn(
                        "border-b border-[#F0F1F3] px-2.5 py-2.5 text-sm font-semibold",
                        p.stock === 0 ? "text-[#DC2626]" : "text-ink",
                      )}
                    >
                      {p.stock === 0 ? "Out of stock" : `${p.stock} in stock`}
                    </td>
                    <td className="border-b border-[#F0F1F3] px-2.5 py-2.5">
                      <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-bold", statusClass)}>
                        {statusLabel}
                      </span>
                    </td>
                    <td className="border-b border-[#F0F1F3] px-2.5 py-2.5 text-right">
                      <button
                        type="button"
                        aria-label={`Edit ${p.name}`}
                        className="grid size-[30px] place-items-center rounded-[9px] border border-line bg-white"
                      >
                        <Pencil className="size-3.5" strokeWidth={2} aria-hidden />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
