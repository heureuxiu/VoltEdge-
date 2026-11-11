"use client";

import { useMemo, useState } from "react";
import { ArrowsClockwise, ChatCircleText, ClockCounterClockwise, GearSix, Package, ShoppingBag, SignIn, Wrench } from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";

import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Segmented } from "@/components/ui/Segmented";
import { formatDateTime } from "@/lib/format";
import { useAdmin } from "@/store/AdminStore";
import type { ActivityKind } from "@/types/admin";

const icons: Record<ActivityKind, Icon> = {
  order: ShoppingBag,
  product: Package,
  repair: Wrench,
  "trade-in": ArrowsClockwise,
  settings: GearSix,
  auth: SignIn,
  message: ChatCircleText,
};

const filters = ["All", "order", "product", "repair", "trade-in", "settings", "message", "auth"] as const;
type Filter = (typeof filters)[number];

export function ActivityView() {
  const { activity } = useAdmin();
  const [filter, setFilter] = useState<Filter>("All");
  const rows = useMemo(() => activity.filter((a) => filter === "All" || a.kind === filter), [activity, filter]);

  return (
    <>
      <PageHeader description="Every change made in the admin panel, newest first." />
      <div className="mb-4">
        <Segmented options={filters} value={filter} onChange={setFilter} />
      </div>
      <Card className="p-2 sm:p-3">
        {rows.length === 0 ? (
          <EmptyState icon={<ClockCounterClockwise className="size-6" aria-hidden />} title="Nothing logged yet" />
        ) : (
          <ul className="m-0 list-none p-0">
            {rows.map((a) => {
              const I = icons[a.kind];
              return (
                <li key={a.id} className="flex items-center gap-3.5 border-b border-line-2 px-2 py-3 last:border-b-0 sm:px-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-line-2 text-ink-2">
                    <I className="size-[18px]" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1 text-sm font-medium">{a.text}</span>
                  <time className="shrink-0 text-xs text-muted" dateTime={a.at}>
                    {formatDateTime(a.at)}
                  </time>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </>
  );
}
