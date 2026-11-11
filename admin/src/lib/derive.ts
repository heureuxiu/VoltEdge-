import type { AdminMessage, AdminOrder, AdminProductRow, AdminRepair, AdminTradeIn } from "@/types/admin";

export interface Alert {
  id: string;
  text: string;
  href: string;
  tone: "warn" | "danger" | "ok" | "hero";
}

export function buildAlerts(args: {
  orders: AdminOrder[];
  products: AdminProductRow[];
  repairs: AdminRepair[];
  tradeIns: AdminTradeIn[];
  messages?: AdminMessage[];
  lowStockThreshold: number;
}): Alert[] {
  const alerts: Alert[] = [];
  for (const o of args.orders.filter((x) => x.status === "Pending payment")) {
    alerts.push({ id: `o-${o.id}`, text: `Order ${o.id} is waiting on payment (${o.customer})`, href: "/orders", tone: "warn" });
  }
  for (const p of args.products.filter((x) => x.stock <= args.lowStockThreshold)) {
    alerts.push({
      id: `p-${p.id}`,
      text: p.stock === 0 ? `${p.name} is out of stock` : `${p.name} is low on stock (${p.stock} left)`,
      href: "/products",
      tone: p.stock === 0 ? "danger" : "warn",
    });
  }
  for (const r of args.repairs.filter((x) => x.status === "Ready to collect")) {
    alerts.push({ id: `r-${r.id}`, text: `Repair ${r.id} is ready to collect (${r.customer})`, href: "/repairs", tone: "ok" });
  }
  for (const t of args.tradeIns.filter((x) => x.status === "Awaiting check-in")) {
    alerts.push({ id: `t-${t.id}`, text: `Trade-in ${t.id} awaits check-in (${t.customer})`, href: "/trade-ins", tone: "hero" });
  }
  for (const m of (args.messages ?? []).filter((x) => !x.handled)) {
    alerts.push({ id: `m-${m.id}`, text: `New message from ${m.name} (${m.topic})`, href: "/messages", tone: "hero" });
  }
  return alerts;
}

/** Revenue (excluding cancelled orders) for each of the last 7 days, oldest first, ending today. */
export function salesLast7Days(orders: AdminOrder[]): { day: string; amount: number }[] {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - (6 - i));
    return d;
  });
  return days.map((start) => {
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    const amount = orders
      .filter((o) => o.status !== "Cancelled" && new Date(o.date) >= start && new Date(o.date) < end)
      .reduce((sum, o) => sum + o.total, 0);
    return { day: start.toLocaleDateString("en-ZA", { weekday: "short" }), amount };
  });
}

export const orderTone = {
  Delivered: "ok",
  Packed: "hero",
  "In transit": "warn",
  "Pending payment": "warn",
  Cancelled: "danger",
} as const;

export const repairTone = {
  "In progress": "warn",
  Diagnosing: "hero",
  "Waiting on part": "danger",
  "Ready to collect": "ok",
  "Quality check": "hero",
} as const;

export const tradeInTone = {
  "Awaiting check-in": "warn",
  "Checked — credit issued": "ok",
  "Declined — device faulty": "danger",
} as const;
