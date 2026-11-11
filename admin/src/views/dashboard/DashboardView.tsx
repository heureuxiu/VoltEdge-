"use client";

import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";

import { BarChart } from "@/components/charts/BarChart";
import { Donut } from "@/components/charts/Donut";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader } from "@/components/ui/Card";
import { Table, Td, Th, Tr } from "@/components/ui/Table";
import { orderTone, repairTone, salesLast7Days } from "@/lib/derive";
import { formatZar } from "@/lib/format";
import { useAdmin } from "@/store/AdminStore";

const viewAll = "inline-flex items-center gap-1 text-[13px] font-semibold text-ink hover:underline";

function Kpi({ label, value, note, tone }: { label: string; value: string; note: string; tone?: "accent" }) {
  return (
    <div className="min-w-0">
      <p className="m-0 text-[11px] font-semibold tracking-[0.12em] text-muted uppercase">{label}</p>
      <p className={`m-0 mt-1.5 font-display text-[28px] leading-none font-bold tabular-nums sm:text-[32px] ${tone === "accent" ? "text-accent-text" : ""}`}>{value}</p>
      <p className="m-0 mt-2 text-xs text-muted">{note}</p>
    </div>
  );
}

export function DashboardView() {
  const { orders, products, repairs, tradeIns, settings } = useAdmin();

  const live = orders.filter((o) => o.status !== "Cancelled");
  const revenue = live.reduce((s, o) => s + o.total, 0);
  const repairQueue = repairs.filter((r) => r.status !== "Ready to collect");
  const awaiting = tradeIns.filter((t) => t.status === "Awaiting check-in");
  const lowStock = products.filter((p) => p.stock <= settings.lowStockThreshold).sort((a, b) => a.stock - b.stock);

  const byCategory = new Map<string, number>();
  for (const o of live) {
    const product = products.find((p) => o.item.startsWith(p.name));
    const cat = product?.category ?? "Other";
    byCategory.set(cat, (byCategory.get(cat) ?? 0) + o.total);
  }
  const palette = ["var(--c1)", "var(--c2)", "var(--c3)", "var(--c4)", "var(--c5)"];
  const slices = [...byCategory.entries()].map(([label, value], i) => ({ label, value, color: palette[i % palette.length]! }));

  const salesThisWeek = salesLast7Days(orders);
  const weekTotal = salesThisWeek.reduce((s, d) => s + d.amount, 0);

  return (
    <>
      <PageHeader description="Welcome back — here's how VoltEdge is doing." />

      <div className="grid gap-5">
        <Card className="ve-rise">
          <div className="grid grid-cols-2 gap-x-6 gap-y-6 lg:grid-cols-4 lg:divide-x lg:divide-line-2 lg:[&>*:not(:first-child)]:pl-6">
            <Kpi label="Revenue" value={formatZar(revenue)} note={`${live.length} orders, excl. cancelled`} tone="accent" />
            <Kpi label="Orders" value={String(orders.length)} note={`${orders.filter((o) => o.status === "Pending payment").length} waiting on payment`} />
            <Kpi label="Repairs in queue" value={String(repairQueue.length)} note={`${repairs.length - repairQueue.length} ready to collect`} />
            <Kpi label="Trade-in requests" value={String(awaiting.length)} note={`${tradeIns.length} total on record`} />
          </div>
        </Card>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <Card>
            <CardHeader
              title="Sales this week"
              subtitle="Daily revenue, last 7 days"
              action={<b className="font-display text-lg tabular-nums">{formatZar(weekTotal)}</b>}
            />
            <BarChart data={salesThisWeek.map((d) => ({ label: d.day, value: d.amount }))} format={(n) => (n >= 1000 ? `R${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : `R${Math.round(n)}`)} />
          </Card>
          <Card>
            <CardHeader title="Revenue by category" subtitle="Share of non-cancelled orders" />
            <Donut slices={slices} centerValue={formatZar(revenue)} centerLabel="total" />
          </Card>
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <Card>
            <CardHeader
              title="Recent orders"
              action={
                <Link href="/orders" className={viewAll}>
                  View all <ArrowRight className="size-3.5" weight="bold" aria-hidden />
                </Link>
              }
            />
            <Table>
              <thead>
                <tr>
                  <Th>Order</Th>
                  <Th>Customer</Th>
                  <Th>Item</Th>
                  <Th className="text-right">Total</Th>
                  <Th>Status</Th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 6).map((o) => (
                  <Tr key={o.id}>
                    <Td className="font-mono text-xs font-semibold">{o.id}</Td>
                    <Td className="font-semibold">{o.customer}</Td>
                    <Td className="text-ink-2">{o.item}</Td>
                    <Td className="text-right font-semibold tabular-nums">{formatZar(o.total)}</Td>
                    <Td>
                      <Badge tone={orderTone[o.status]}>{o.status}</Badge>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          </Card>

          <div className="grid content-start gap-5">
            <Card>
              <CardHeader
                title="Low stock"
                action={
                  <Link href="/products" className={viewAll}>
                    Manage <ArrowRight className="size-3.5" weight="bold" aria-hidden />
                  </Link>
                }
              />
              {lowStock.length === 0 ? (
                <p className="m-0 text-[13px] text-muted">Everything is well stocked.</p>
              ) : (
                <ul className="m-0 grid list-none gap-2.5 p-0">
                  {lowStock.slice(0, 5).map((p) => (
                    <li key={p.id} className="flex items-center justify-between gap-3 text-sm">
                      <span className="min-w-0 truncate font-semibold">{p.name}</span>
                      <Badge tone={p.stock === 0 ? "danger" : "warn"}>{p.stock === 0 ? "Out of stock" : `${p.stock} left`}</Badge>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
            <Card>
              <CardHeader
                title="Repair queue"
                action={
                  <Link href="/repairs" className={viewAll}>
                    Open <ArrowRight className="size-3.5" weight="bold" aria-hidden />
                  </Link>
                }
              />
              <ul className="m-0 grid list-none gap-3 p-0">
                {repairs.slice(0, 4).map((r) => (
                  <li key={r.id} className="flex items-center justify-between gap-3 text-sm">
                    <span className="min-w-0">
                      <b className="block truncate">{r.device}</b>
                      <span className="block truncate text-xs text-muted">
                        {r.issue} · {r.customer}
                      </span>
                    </span>
                    <Badge tone={repairTone[r.status]}>{r.status}</Badge>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
