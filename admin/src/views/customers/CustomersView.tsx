"use client";

import { useMemo, useState } from "react";
import { Users } from "@phosphor-icons/react";

import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal } from "@/components/ui/Modal";
import { SearchBox } from "@/components/ui/SearchBox";
import { Table, Td, Th, Tr } from "@/components/ui/Table";
import { orderTone } from "@/lib/derive";
import { formatDate, formatZar } from "@/lib/format";
import { useAdmin } from "@/store/AdminStore";

export function CustomersView() {
  const { customers, orders, repairs, tradeIns } = useAdmin();
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return customers
      .map((c) => {
        const mine = orders.filter((o) => o.email === c.email);
        return {
          ...c,
          orderCount: mine.length,
          spent: mine.filter((o) => o.status !== "Cancelled").reduce((s, o) => s + o.total, 0),
          repairCount: repairs.filter((r) => (r.email ? r.email === c.email : r.customer === c.name)).length,
          tradeCount: tradeIns.filter((t) => (t.email ? t.email === c.email : t.customer === c.name)).length,
        };
      })
      .filter((c) => !term || [c.name, c.email, c.phone, c.city].some((v) => v.toLowerCase().includes(term)))
      .sort((a, b) => b.spent - a.spent);
  }, [customers, orders, repairs, tradeIns, q]);

  const open = rows.find((c) => c.id === openId) ?? null;

  return (
    <>
      <PageHeader description={`${customers.length} customers on record, ranked by lifetime spend.`} />
      <div className="mb-4 flex justify-end">
        <SearchBox value={q} onChange={setQ} placeholder="Search name, email, city…" className="w-full sm:w-72" />
      </div>
      <Card className="p-2 sm:p-3">
        {rows.length === 0 ? (
          <EmptyState icon={<Users className="size-6" aria-hidden />} title="No customers found" />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Customer</Th>
                <Th>City</Th>
                <Th className="text-center">Orders</Th>
                <Th className="text-center">Repairs</Th>
                <Th className="text-center">Trade-ins</Th>
                <Th className="text-right">Lifetime spend</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <Tr key={c.id} onClick={() => setOpenId(c.id)}>
                  <Td>
                    <div className="flex items-center gap-3">
                      <Avatar name={c.name} />
                      <span className="min-w-0">
                        <b className="block truncate">{c.name}</b>
                        <span className="block truncate text-xs text-muted">{c.email}</span>
                      </span>
                    </div>
                  </Td>
                  <Td className="text-ink-2">{c.city}</Td>
                  <Td className="text-center tabular-nums">{c.orderCount}</Td>
                  <Td className="text-center tabular-nums">{c.repairCount}</Td>
                  <Td className="text-center tabular-nums">{c.tradeCount}</Td>
                  <Td className="text-right font-semibold tabular-nums">{formatZar(c.spent)}</Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>

      <Modal open={!!open} onClose={() => setOpenId(null)} title={open?.name ?? ""} description={open ? `${open.id} · customer since ${formatDate(open.joined)}` : undefined}>
        {open ? (
          <div className="grid gap-5">
            <dl className="m-0 grid grid-cols-2 gap-4 text-sm">
              <div><dt className="text-xs text-muted">Phone</dt><dd className="m-0 font-semibold">{open.phone}</dd></div>
              <div><dt className="text-xs text-muted">City</dt><dd className="m-0 font-semibold">{open.city}</dd></div>
              <div className="col-span-2"><dt className="text-xs text-muted">Email</dt><dd className="m-0 font-semibold break-all">{open.email}</dd></div>
            </dl>
            <div>
              <p className="m-0 mb-2 text-xs font-bold tracking-[0.08em] text-muted uppercase">Orders</p>
              {orders.filter((o) => o.email === open.email).length === 0 ? (
                <p className="m-0 text-[13px] text-muted">No orders yet.</p>
              ) : (
                <ul className="m-0 grid list-none gap-2 p-0">
                  {orders.filter((o) => o.email === open.email).map((o) => (
                    <li key={o.id} className="flex items-center justify-between gap-3 rounded-xl bg-surface-2 px-3.5 py-2.5 text-sm">
                      <span className="min-w-0">
                        <b className="block truncate">{o.item}</b>
                        <span className="text-xs text-muted">{o.id} · {formatZar(o.total)}</span>
                      </span>
                      <Badge tone={orderTone[o.status]}>{o.status}</Badge>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ) : null}
      </Modal>
    </>
  );
}
