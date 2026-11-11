"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Plus, Wrench } from "@phosphor-icons/react";

import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Field, Input, Select } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { SearchBox } from "@/components/ui/SearchBox";
import { Segmented } from "@/components/ui/Segmented";
import { Table, Td, Th, Tr } from "@/components/ui/Table";
import { useToast } from "@/components/ui/Toast";
import { repairTone } from "@/lib/derive";
import { formatZar } from "@/lib/format";
import { useAdmin } from "@/store/AdminStore";
import type { RepairStatus } from "@/types/admin";

const statuses: RepairStatus[] = ["Diagnosing", "In progress", "Waiting on part", "Quality check", "Ready to collect"];
const filters = ["All", ...statuses] as const;
type Filter = (typeof filters)[number];

export function RepairsView() {
  const { repairs, addRepair, setRepairStatus } = useAdmin();
  const toast = useToast();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ customer: "", device: "", issue: "", when: "Today", quote: "" });

  const counts = useMemo(() => {
    const c: Partial<Record<Filter, number>> = { All: repairs.length };
    for (const r of repairs) c[r.status] = (c[r.status] ?? 0) + 1;
    return c;
  }, [repairs]);

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return repairs.filter(
      (r) => (filter === "All" || r.status === filter) && (!term || [r.id, r.customer, r.device, r.issue].some((v) => v.toLowerCase().includes(term))),
    );
  }, [repairs, q, filter]);

  const stats = [
    { label: "In queue", value: repairs.filter((r) => r.status !== "Ready to collect").length, tint: "bg-hero-soft text-hero" },
    { label: "Waiting on parts", value: counts["Waiting on part"] ?? 0, tint: "bg-danger-soft text-danger" },
    { label: "Quality check", value: counts["Quality check"] ?? 0, tint: "bg-warn-soft text-warn" },
    { label: "Ready to collect", value: counts["Ready to collect"] ?? 0, tint: "bg-ok-soft text-ok" },
  ];

  async function submit(e: FormEvent) {
    e.preventDefault();
    const ok = await addRepair({ customer: form.customer.trim(), device: form.device.trim(), issue: form.issue.trim(), when: form.when.trim() || "Today", quote: Math.round(Number(form.quote)) });
    if (!ok) return;
    toast("Repair booked");
    setForm({ customer: "", device: "", issue: "", when: "Today", quote: "" });
    setOpen(false);
  }

  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const valid = form.customer.trim() && form.device.trim() && form.issue.trim() && Number(form.quote) > 0;

  return (
    <>
      <PageHeader
        description="Track every device from drop-off to collection."
        actions={
          <Button variant="accent" onClick={() => setOpen(true)}>
            <Plus className="size-[18px]" weight="bold" aria-hidden /> Book repair
          </Button>
        }
      />

      <div className="mb-5 grid grid-cols-2 gap-3 xl:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="flex items-center gap-3.5 p-4">
            <span className={`grid size-11 shrink-0 place-items-center rounded-2xl font-display text-lg font-bold tabular-nums ${s.tint}`}>{s.value}</span>
            <span className="text-[13px] leading-tight font-semibold text-ink-2">{s.label}</span>
          </Card>
        ))}
      </div>

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Segmented options={filters} value={filter} onChange={setFilter} counts={counts} />
        <SearchBox value={q} onChange={setQ} placeholder="Search ticket, customer, device…" className="lg:w-72" />
      </div>

      <Card className="p-2 sm:p-3">
        {rows.length === 0 ? (
          <EmptyState icon={<Wrench className="size-6" aria-hidden />} title="No repairs here" text="Nothing matches that filter right now." />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Ticket</Th>
                <Th>Customer</Th>
                <Th>Device</Th>
                <Th>Issue</Th>
                <Th>Booked</Th>
                <Th className="text-right">Quote</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <Tr key={r.id}>
                  <Td className="font-mono text-xs font-semibold">{r.id}</Td>
                  <Td>
                    <b className="block font-semibold">{r.customer}</b>
                    {r.phone || r.email ? <span className="block text-xs text-muted">{r.phone || r.email}</span> : null}
                  </Td>
                  <Td>{r.device}</Td>
                  <Td className="text-ink-2">{r.issue}</Td>
                  <Td className="whitespace-nowrap text-muted">{r.when}</Td>
                  <Td className="text-right font-semibold tabular-nums">{formatZar(r.quote)}</Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <Badge tone={repairTone[r.status]} className="hidden xl:inline-flex">{r.status}</Badge>
                      <Select
                        aria-label={`Status of ${r.id}`}
                        value={r.status}
                        onChange={async (e) => {
                          const next = e.target.value as RepairStatus;
                          if (await setRepairStatus(r.id, next)) toast(`${r.id} → ${next}`);
                        }}
                        className="h-9 w-[160px] text-[13px]"
                      >
                        {statuses.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </Select>
                    </div>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Book a repair"
        description="Creates a new ticket in the Diagnosing stage."
        footer={
          <>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="accent" type="submit" form="repair-form" disabled={!valid}>
              Book repair
            </Button>
          </>
        }
      >
        <form id="repair-form" onSubmit={submit} className="grid gap-4">
          <Field label="Customer">
            <Input required value={form.customer} onChange={set("customer")} placeholder="Thabo N." />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Device">
              <Input required value={form.device} onChange={set("device")} placeholder="iPhone 15 Pro" />
            </Field>
            <Field label="Issue">
              <Input required value={form.issue} onChange={set("issue")} placeholder="Screen replacement" />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Booked for">
              <Input value={form.when} onChange={set("when")} placeholder="Today, 2pm" />
            </Field>
            <Field label="Quote (R)">
              <Input type="number" min={1} required value={form.quote} onChange={set("quote")} placeholder="1899" />
            </Field>
          </div>
        </form>
      </Modal>
    </>
  );
}
