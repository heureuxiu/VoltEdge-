"use client";

import { useMemo, useState } from "react";
import { DownloadSimple, ShoppingBag } from "@phosphor-icons/react";

import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal } from "@/components/ui/Modal";
import { SearchBox } from "@/components/ui/SearchBox";
import { Segmented } from "@/components/ui/Segmented";
import { Table, Td, Th, Tr } from "@/components/ui/Table";
import { useToast } from "@/components/ui/Toast";
import { adminOrderStatuses } from "@/data/admin";
import type { OrderStatusFilter } from "@/data/admin";
import { orderTone } from "@/lib/derive";
import { downloadCsv, formatDate, formatZar } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useAdmin } from "@/store/AdminStore";
import type { OrderStatus } from "@/types/admin";

const flow: OrderStatus[] = ["Pending payment", "Packed", "In transit", "Delivered"];

export function OrdersView() {
  const { orders, setOrderStatus } = useAdmin();
  const toast = useToast();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<OrderStatusFilter>("All");
  const [openId, setOpenId] = useState<string | null>(null);

  const counts = useMemo(() => {
    const c: Partial<Record<OrderStatusFilter, number>> = { All: orders.length };
    for (const o of orders) c[o.status] = (c[o.status] ?? 0) + 1;
    return c;
  }, [orders]);

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return orders.filter(
      (o) =>
        (filter === "All" || o.status === filter) &&
        (!term || [o.id, o.customer, o.item].some((v) => v.toLowerCase().includes(term))),
    );
  }, [orders, q, filter]);

  const open = orders.find((o) => o.id === openId) ?? null;
  const step = open ? flow.indexOf(open.status) : -1;
  const next = step >= 0 && step < flow.length - 1 ? flow[step + 1]! : null;

  async function change(id: string, status: OrderStatus) {
    if (await setOrderStatus(id, status)) toast(`${id} marked ${status}`);
  }

  return (
    <>
      <PageHeader
        description={`${orders.length} orders · ${formatZar(orders.filter((o) => o.status !== "Cancelled").reduce((s, o) => s + o.total, 0))} in revenue`}
        actions={
          <Button
            onClick={() =>
              downloadCsv("voltedge-orders.csv", [
                ["Order", "Customer", "Item", "Date", "Total (ZAR)", "Status"],
                ...rows.map((o) => [o.id, o.customer, o.item, formatDate(o.date), o.total, o.status]),
              ])
            }
          >
            <DownloadSimple className="size-[18px]" aria-hidden /> Export CSV
          </Button>
        }
      />

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Segmented options={adminOrderStatuses} value={filter} onChange={setFilter} counts={counts} />
        <SearchBox value={q} onChange={setQ} placeholder="Search order, customer, item…" className="lg:w-72" />
      </div>

      <Card className="p-2 sm:p-3">
        {rows.length === 0 ? (
          <EmptyState icon={<ShoppingBag className="size-6" aria-hidden />} title="No orders match" text="Try another status or search term." />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Order</Th>
                <Th>Customer</Th>
                <Th>Item</Th>
                <Th>Date</Th>
                <Th className="text-right">Total</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((o) => (
                <Tr key={o.id} onClick={() => setOpenId(o.id)}>
                  <Td className="font-mono text-xs font-semibold">{o.id}</Td>
                  <Td className="font-semibold">{o.customer}</Td>
                  <Td className="text-ink-2">{o.item}</Td>
                  <Td className="whitespace-nowrap text-muted">{formatDate(o.date)}</Td>
                  <Td className="text-right font-semibold tabular-nums">{formatZar(o.total)}</Td>
                  <Td>
                    <Badge tone={orderTone[o.status]}>{o.status}</Badge>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>

      <Modal
        open={!!open}
        onClose={() => setOpenId(null)}
        title={open ? `Order ${open.id}` : ""}
        description={open ? `${open.customer} · ${formatDate(open.date)}` : undefined}
        footer={
          open ? (
            <>
              {open.status !== "Cancelled" && open.status !== "Delivered" ? (
                <Button variant="danger" onClick={() => change(open.id, "Cancelled")}>
                  Cancel order
                </Button>
              ) : null}
              {open.status === "Cancelled" ? (
                <Button onClick={() => change(open.id, "Pending payment")}>Reopen</Button>
              ) : null}
              {next ? (
                <Button variant="accent" onClick={() => change(open.id, next)}>
                  Mark {next}
                </Button>
              ) : null}
            </>
          ) : null
        }
      >
        {open ? (
          <div className="grid gap-5">
            <ol className="m-0 flex list-none items-center gap-1.5 p-0">
              {flow.map((s, i) => (
                <li key={s} className="flex flex-1 flex-col gap-1.5">
                  <span className={cn("h-1.5 rounded-full", open.status !== "Cancelled" && i <= step ? "bg-accent" : "bg-line")} />
                  <span className={cn("text-[11px] leading-tight font-semibold", i === step ? "text-ink" : "text-muted")}>{s}</span>
                </li>
              ))}
            </ol>
            <ul className="m-0 grid list-none gap-2 p-0">
              {open.items.map((i) => (
                <li key={i.productId} className="flex items-center justify-between gap-3 rounded-xl bg-surface-2 px-3.5 py-2.5 text-sm">
                  <span className="min-w-0">
                    <b className="block truncate">{i.name}</b>
                    <span className="block truncate text-xs text-muted">{[i.variant, `Qty ${i.qty}`].filter(Boolean).join(" · ")}</span>
                  </span>
                  <b className="tabular-nums">{formatZar(i.unitPrice * i.qty)}</b>
                </li>
              ))}
            </ul>
            <dl className="m-0 grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
              <div><dt className="text-xs text-muted">Status</dt><dd className="m-0 mt-0.5"><Badge tone={orderTone[open.status]}>{open.status}</Badge></dd></div>
              <div><dt className="text-xs text-muted">Payment</dt><dd className="m-0 font-semibold">{{ card: "Card", payflex: "Payflex", eft: "Instant EFT" }[open.payment]}</dd></div>
              <div><dt className="text-xs text-muted">Subtotal</dt><dd className="m-0 tabular-nums">{formatZar(open.subtotal)}</dd></div>
              <div><dt className="text-xs text-muted">Delivery fee</dt><dd className="m-0 tabular-nums">{open.shipping ? formatZar(open.shipping) : "Free"}</dd></div>
              <div className="col-span-2 border-t border-line-2 pt-3"><dt className="text-xs text-muted">Total</dt><dd className="m-0 font-display text-xl font-bold tabular-nums">{formatZar(open.total)}</dd></div>
              <div><dt className="text-xs text-muted">Customer</dt><dd className="m-0 font-semibold">{open.customer}</dd></div>
              <div><dt className="text-xs text-muted">Phone</dt><dd className="m-0">{open.phone || "—"}</dd></div>
              <div className="col-span-2"><dt className="text-xs text-muted">Email</dt><dd className="m-0 break-all">{open.email}</dd></div>
              <div className="col-span-2">
                <dt className="text-xs text-muted">{open.delivery === "pickup" ? "Delivery" : `Ship to (${open.shippingMethod})`}</dt>
                <dd className="m-0">
                  {open.delivery === "pickup" || !open.address
                    ? "Collect in store"
                    : [open.address.line1, open.address.line2, open.address.city, open.address.province, open.address.postal].filter(Boolean).join(", ")}
                </dd>
              </div>
              {open.notes ? <div className="col-span-2"><dt className="text-xs text-muted">Notes</dt><dd className="m-0">{open.notes}</dd></div> : null}
            </dl>
          </div>
        ) : null}
      </Modal>
    </>
  );
}
