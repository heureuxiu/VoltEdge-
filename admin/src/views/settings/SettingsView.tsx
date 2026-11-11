"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Moon, Sun } from "@phosphor-icons/react";

import { useTheme } from "@/components/Providers";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { Field, Input } from "@/components/ui/Field";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import { useAdmin } from "@/store/AdminStore";
import type { StoreSettings } from "@/types/admin";

function Toggle({ checked, onChange, label, hint }: { checked: boolean; onChange: (v: boolean) => void; label: string; hint: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <span className="leading-tight">
        <b className="block text-sm">{label}</b>
        <span className="text-xs text-muted">{hint}</span>
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn("relative h-7 w-12 shrink-0 rounded-full transition-colors", checked ? "bg-accent" : "bg-line")}
      >
        <span className={cn("absolute top-1 left-1 size-5 rounded-full bg-white shadow transition-transform", checked && "translate-x-5 bg-accent-ink")} />
      </button>
    </div>
  );
}

export function SettingsView() {
  const { settings, updateSettings, refresh, subscribers } = useAdmin();
  const { theme, toggle } = useTheme();
  const toast = useToast();
  const [form, setForm] = useState<StoreSettings>(settings);

  const set = <K extends keyof StoreSettings>(k: K, v: StoreSettings[K]) => setForm((f) => ({ ...f, [k]: v }));

  async function save(e: FormEvent) {
    e.preventDefault();
    const num = (v: number) => Math.max(0, Number(v) || 0);
    const ok = await updateSettings({
      ...form,
      lowStockThreshold: Math.round(num(form.lowStockThreshold)),
      standardShipping: num(form.standardShipping),
      expressShipping: num(form.expressShipping),
    });
    if (ok) toast("Settings saved");
  }

  return (
    <>
      <PageHeader description="Store details, alerts and appearance." />

      <form onSubmit={save} className="grid gap-5 xl:grid-cols-2">
        <Card>
          <CardHeader title="Store profile" subtitle="Shown to customers on receipts and messages." />
          <div className="grid gap-4">
            <Field label="Store name">
              <Input value={form.storeName} onChange={(e) => set("storeName", e.target.value)} />
            </Field>
            <Field label="Support email">
              <Input type="email" value={form.supportEmail} onChange={(e) => set("supportEmail", e.target.value)} />
            </Field>
            <Field label="WhatsApp number" hint="Used for two-factor codes and customer chat.">
              <Input value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} />
            </Field>
            <Field label="Low-stock threshold" hint="Products at or below this count are flagged for restocking.">
              <Input type="number" min={0} value={form.lowStockThreshold} onChange={(e) => set("lowStockThreshold", Number(e.target.value))} />
            </Field>
            <Field label="Standard delivery fee (R)" hint="Charged at checkout for standard delivery. Store pickup is free.">
              <Input type="number" min={0} value={form.standardShipping} onChange={(e) => set("standardShipping", Number(e.target.value))} />
            </Field>
            <Field label="Express delivery fee (R)" hint="Charged at checkout for next-working-day delivery.">
              <Input type="number" min={0} value={form.expressShipping} onChange={(e) => set("expressShipping", Number(e.target.value))} />
            </Field>
          </div>
        </Card>

        <div className="grid content-start gap-5">
          <Card>
            <CardHeader title="Notifications" subtitle="What appears in the alert bell." />
            <div className="divide-y divide-line-2">
              <Toggle label="New orders" hint="Orders waiting on payment" checked={form.notifyNewOrder} onChange={(v) => set("notifyNewOrder", v)} />
              <Toggle label="Low stock" hint="Products below the threshold" checked={form.notifyLowStock} onChange={(v) => set("notifyLowStock", v)} />
              <Toggle label="Repairs ready" hint="Devices ready to collect" checked={form.notifyRepairReady} onChange={(v) => set("notifyRepairReady", v)} />
            </div>
          </Card>

          <Card>
            <CardHeader title="Appearance" />
            <button
              type="button"
              onClick={toggle}
              className="flex w-full items-center justify-between rounded-xl border border-line px-4 py-3 text-sm font-semibold hover:bg-surface-2"
            >
              {theme === "dark" ? "Dark mode is on" : "Light mode is on"}
              {theme === "dark" ? <Moon className="size-5" aria-hidden /> : <Sun className="size-5" aria-hidden />}
            </button>
          </Card>

          <Card>
            <CardHeader title="Store data" subtitle={`Live from the database · ${subscribers} newsletter subscriber${subscribers === 1 ? "" : "s"}.`} />
            <Button
              onClick={async () => {
                await refresh();
                toast("Data refreshed");
              }}
            >
              Refresh from server
            </Button>
          </Card>
        </div>

        <div className="xl:col-span-2">
          <Button variant="accent" type="submit">
            Save settings
          </Button>
        </div>
      </form>
    </>
  );
}
