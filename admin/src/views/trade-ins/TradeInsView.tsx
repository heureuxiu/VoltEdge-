"use client";

import { useMemo, useState } from "react";
import { ArrowsClockwise } from "@phosphor-icons/react";

import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { SearchBox } from "@/components/ui/SearchBox";
import { Segmented } from "@/components/ui/Segmented";
import { Table, Td, Th, Tr } from "@/components/ui/Table";
import { useToast } from "@/components/ui/Toast";
import { tradeInTone } from "@/lib/derive";
import { formatZar } from "@/lib/format";
import { useAdmin } from "@/store/AdminStore";
import type { TradeInGrade, TradeInStatus } from "@/types/admin";

const filters = ["All", "Awaiting check-in", "Checked — credit issued", "Declined — device faulty"] as const;
type Filter = (typeof filters)[number];

const grades: { grade: TradeInGrade; label: string; tint: string }[] = [
  { grade: "A", label: "Like new", tint: "bg-ok-soft text-ok" },
  { grade: "B", label: "Light marks", tint: "bg-hero-soft text-hero" },
  { grade: "C", label: "Heavy wear", tint: "bg-warn-soft text-warn" },
];

export function TradeInsView() {
  const { tradeIns, setTradeInStatus } = useAdmin();
  const toast = useToast();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("All");

  const counts = useMemo(() => {
    const c: Partial<Record<Filter, number>> = { All: tradeIns.length };
    for (const t of tradeIns) c[t.status] = (c[t.status] ?? 0) + 1;
    return c;
  }, [tradeIns]);

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return tradeIns.filter((t) => (filter === "All" || t.status === filter) && (!term || [t.id, t.customer, t.device].some((v) => v.toLowerCase().includes(term))));
  }, [tradeIns, q, filter]);

  const issued = tradeIns.filter((t) => t.status === "Checked — credit issued").reduce((s, t) => s + (t.creditMin + t.creditMax) / 2, 0);

  async function act(id: string, status: TradeInStatus) {
    if (await setTradeInStatus(id, status)) toast(`${id}: ${status}`);
  }

  return (
    <>
      <PageHeader description={`${formatZar(issued)} in store credit issued (mid-range estimate).`} />

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        {grades.map((g) => (
          <Card key={g.grade} className="flex items-center gap-3.5 p-4">
            <span className={`grid size-11 shrink-0 place-items-center rounded-2xl font-display text-lg font-bold ${g.tint}`}>{g.grade}</span>
            <span className="leading-tight">
              <b className="block font-display text-xl tabular-nums">{tradeIns.filter((t) => t.grade === g.grade).length}</b>
              <span className="text-xs text-muted">Grade {g.grade} — {g.label}</span>
            </span>
          </Card>
        ))}
      </div>

      <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <Segmented options={filters} value={filter} onChange={setFilter} counts={counts} />
        <SearchBox value={q} onChange={setQ} placeholder="Search request, customer, device…" className="xl:w-72" />
      </div>

      <Card className="p-2 sm:p-3">
        {rows.length === 0 ? (
          <EmptyState icon={<ArrowsClockwise className="size-6" aria-hidden />} title="No trade-ins found" />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Request</Th>
                <Th>Customer</Th>
                <Th>Device</Th>
                <Th>Grade</Th>
                <Th className="text-right">Credit range</Th>
                <Th>Status</Th>
                <Th className="text-right">Action</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((t) => (
                <Tr key={t.id}>
                  <Td className="font-mono text-xs font-semibold">{t.id}</Td>
                  <Td>
                    <b className="block font-semibold">{t.customer}</b>
                    {t.phone || t.email ? <span className="block text-xs text-muted">{t.phone || t.email}</span> : null}
                  </Td>
                  <Td>{t.device}</Td>
                  <Td>
                    <Badge tone={t.grade === "A" ? "ok" : t.grade === "B" ? "hero" : "warn"} dot={false}>
                      Grade {t.grade}
                    </Badge>
                  </Td>
                  <Td className="text-right whitespace-nowrap tabular-nums">
                    {formatZar(t.creditMin)} – {formatZar(t.creditMax)}
                  </Td>
                  <Td>
                    <Badge tone={tradeInTone[t.status]}>{t.status}</Badge>
                  </Td>
                  <Td>
                    <div className="flex justify-end gap-2">
                      {t.status === "Awaiting check-in" ? (
                        <>
                          <Button size="sm" variant="accent" onClick={() => act(t.id, "Checked — credit issued")}>Issue credit</Button>
                          <Button size="sm" onClick={() => act(t.id, "Declined — device faulty")}>Decline</Button>
                        </>
                      ) : (
                        <Button size="sm" onClick={() => act(t.id, "Awaiting check-in")}>Reopen</Button>
                      )}
                    </div>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </>
  );
}
