"use client";

import { useState } from "react";

import { StatusPill } from "@/components/admin/StatusPill";
import {
  adminRepairs,
  adminTradeIns,
  formatZar,
  repairQueueStats,
  repairStatusStyles,
  tradeInGradeStats,
  tradeInStatusStyles,
} from "@/data/admin";
import { cn } from "@/lib/utils";

type View = "repairs" | "tradein";

export default function AdminRepairsPage() {
  const [view, setView] = useState<View>("repairs");

  return (
    <>
      <div>
        <h1 className="m-0 font-display text-[28px] font-bold tracking-tight">Repairs &amp; trade-ins</h1>
        <p className="mt-1 mb-0 text-sm text-muted">Manage the repair queue and incoming trade-in requests.</p>
      </div>

      <div
        role="tablist"
        aria-label="View"
        className="flex w-fit gap-1.5 rounded-xl border border-line bg-white p-[5px]"
      >
        <button
          role="tab"
          aria-selected={view === "repairs"}
          onClick={() => setView("repairs")}
          className={cn(
            "rounded-[9px] px-4 py-2.5 text-[13px] font-semibold",
            view === "repairs" ? "bg-brand text-white" : "text-muted",
          )}
        >
          Repair bookings
        </button>
        <button
          role="tab"
          aria-selected={view === "tradein"}
          onClick={() => setView("tradein")}
          className={cn(
            "rounded-[9px] px-4 py-2.5 text-[13px] font-semibold",
            view === "tradein" ? "bg-brand text-white" : "text-muted",
          )}
        >
          Trade-in requests
        </button>
      </div>

      {view === "repairs" ? (
        <>
          <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
            {repairQueueStats.map((s) => (
              <div
                key={s.label}
                className="flex flex-col gap-1 rounded-2xl border border-line bg-white p-4 shadow-[0_1px_2px_rgba(17,17,17,0.04)]"
              >
                <b className="font-display text-[22px] font-bold">{s.value}</b>
                <span className="text-[13px] text-muted">{s.label}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3.5 rounded-card border border-line bg-white p-[18px] shadow-[0_1px_2px_rgba(17,17,17,0.04)]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse">
                <thead>
                  <tr className="text-left">
                    {["Ticket", "Customer", "Device & issue", "Booked for", "Quote", "Status"].map((h) => (
                      <th
                        key={h}
                        className="border-b border-line px-2.5 py-2.5 text-[11px] font-bold tracking-[0.05em] text-muted uppercase"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {adminRepairs.map((r) => (
                    <tr key={r.id}>
                      <td className="border-b border-[#ececee] px-2.5 py-[11px] text-sm font-bold">{r.id}</td>
                      <td className="border-b border-[#ececee] px-2.5 py-[11px] text-sm">{r.customer}</td>
                      <td className="border-b border-[#ececee] px-2.5 py-[11px] text-sm">
                        <b className="block text-[13px] font-semibold">{r.device}</b>
                        <span className="text-xs text-muted">{r.issue}</span>
                      </td>
                      <td className="border-b border-[#ececee] px-2.5 py-[11px] text-[13px] text-muted">{r.when}</td>
                      <td className="border-b border-[#ececee] px-2.5 py-[11px] text-sm font-semibold">
                        {formatZar(r.quote)}
                      </td>
                      <td className="border-b border-[#ececee] px-2.5 py-[11px]">
                        <StatusPill className={repairStatusStyles[r.status]}>{r.status}</StatusPill>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
            {tradeInGradeStats.map((g) => (
              <div
                key={g.grade}
                className="flex items-center gap-3 rounded-2xl border border-line bg-white p-4 shadow-[0_1px_2px_rgba(17,17,17,0.04)]"
              >
                <span
                  className={cn(
                    "grid size-9 shrink-0 place-items-center rounded-[10px] text-[13px] font-bold",
                    g.tint,
                    g.color,
                  )}
                >
                  {g.grade}
                </span>
                <span>
                  <b className="block font-display text-xl font-bold">{g.count}</b>
                  <span className="text-xs text-muted">{g.label}</span>
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3.5 rounded-card border border-line bg-white p-[18px] shadow-[0_1px_2px_rgba(17,17,17,0.04)]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse">
                <thead>
                  <tr className="text-left">
                    {["Request", "Customer", "Device offered", "Grade", "Est. credit", "Status"].map((h) => (
                      <th
                        key={h}
                        className="border-b border-line px-2.5 py-2.5 text-[11px] font-bold tracking-[0.05em] text-muted uppercase"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {adminTradeIns.map((t) => (
                    <tr key={t.id}>
                      <td className="border-b border-[#ececee] px-2.5 py-[11px] text-sm font-bold">{t.id}</td>
                      <td className="border-b border-[#ececee] px-2.5 py-[11px] text-sm">{t.customer}</td>
                      <td className="border-b border-[#ececee] px-2.5 py-[11px] text-sm">{t.device}</td>
                      <td className="border-b border-[#ececee] px-2.5 py-[11px] text-[13px] font-bold">{t.grade}</td>
                      <td className="border-b border-[#ececee] px-2.5 py-[11px] text-sm font-semibold">
                        {formatZar(t.creditMin)}–{formatZar(t.creditMax)}
                      </td>
                      <td className="border-b border-[#ececee] px-2.5 py-[11px]">
                        <StatusPill className={tradeInStatusStyles[t.status]}>{t.status}</StatusPill>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </>
  );
}
