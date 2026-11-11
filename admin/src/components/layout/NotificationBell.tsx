"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell } from "@phosphor-icons/react";

import { buildAlerts } from "@/lib/derive";
import { cn } from "@/lib/utils";
import { useAdmin } from "@/store/AdminStore";

const dot = { warn: "bg-warn", danger: "bg-danger", ok: "bg-ok", hero: "bg-hero" } as const;

/** Bell in the top bar: the number is how many things need attention; click to see them. */
export function NotificationBell() {
  const { orders, products, repairs, tradeIns, messages, settings } = useAdmin();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const alerts = buildAlerts({ orders, products, repairs, tradeIns, messages, lowStockThreshold: settings.lowStockThreshold });

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={`Notifications (${alerts.length})`}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="relative grid size-10 place-items-center rounded-xl border border-line bg-surface hover:bg-surface-2"
      >
        <Bell className="size-5" aria-hidden />
        {alerts.length > 0 ? (
          <span className="absolute -top-1.5 -right-1.5 grid min-w-5 place-items-center rounded-full bg-danger px-1 text-[11px] leading-5 font-bold text-white">
            {alerts.length}
          </span>
        ) : null}
      </button>
      {open ? (
        <div className="ve-pop absolute top-12 right-0 z-50 w-[min(360px,calc(100vw-2rem))] rounded-2xl border border-line bg-surface p-2 shadow-card">
          <p className="m-0 px-3 pt-2 pb-1.5 text-xs font-bold tracking-[0.08em] text-muted uppercase">Needs attention</p>
          <ul className="m-0 grid max-h-[360px] list-none gap-0.5 overflow-y-auto p-0">
            {alerts.length === 0 ? <li className="px-3 py-6 text-center text-[13px] text-muted">You&apos;re all caught up.</li> : null}
            {alerts.map((a) => (
              <li key={a.id}>
                <Link href={a.href} onClick={() => setOpen(false)} className="flex items-start gap-2.5 rounded-xl px-3 py-2.5 text-[13px] hover:bg-surface-2">
                  <span aria-hidden className={cn("mt-1.5 size-2 shrink-0 rounded-full", dot[a.tone])} />
                  {a.text}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
