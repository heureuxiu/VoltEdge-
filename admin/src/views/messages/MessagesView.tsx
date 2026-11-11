"use client";

import { useMemo, useState } from "react";
import { CheckCircle, ChatCircleText } from "@phosphor-icons/react";

import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Segmented } from "@/components/ui/Segmented";
import { useToast } from "@/components/ui/Toast";
import { formatDateTime } from "@/lib/format";
import { useAdmin } from "@/store/AdminStore";

const filters = ["Open", "Handled", "All"] as const;
type Filter = (typeof filters)[number];

/** Messages sent through the website contact form. */
export function MessagesView() {
  const { messages, subscribers, setMessageHandled } = useAdmin();
  const toast = useToast();
  const [filter, setFilter] = useState<Filter>("Open");

  const counts = useMemo(
    () => ({ Open: messages.filter((m) => !m.handled).length, Handled: messages.filter((m) => m.handled).length, All: messages.length }),
    [messages],
  );
  const rows = useMemo(() => messages.filter((m) => filter === "All" || (filter === "Open" ? !m.handled : m.handled)), [messages, filter]);

  async function toggle(id: string, handled: boolean) {
    if (await setMessageHandled(id, handled)) toast(handled ? "Marked as handled" : "Reopened");
  }

  return (
    <>
      <PageHeader description={`Contact-form messages from the website · ${subscribers} newsletter subscriber${subscribers === 1 ? "" : "s"}.`} />
      <div className="mb-4">
        <Segmented options={filters} value={filter} onChange={setFilter} counts={counts} />
      </div>

      {rows.length === 0 ? (
        <Card>
          <EmptyState icon={<ChatCircleText className="size-6" aria-hidden />} title={filter === "Open" ? "Inbox is clear" : "No messages"} text="New website messages show up here." />
        </Card>
      ) : (
        <div className="grid gap-3">
          {rows.map((m) => (
            <Card key={m.id} className="ve-fade">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <b className="text-base">{m.name}</b>
                    <Badge tone="hero" dot={false}>
                      {m.topic}
                    </Badge>
                    {m.handled ? <Badge tone="ok">Handled</Badge> : null}
                  </div>
                  <p className="m-0 mt-0.5 text-xs text-muted">
                    {m.contact} · {formatDateTime(m.at)}
                  </p>
                </div>
                <Button size="sm" variant={m.handled ? "ghost" : "accent"} onClick={() => toggle(m.id, !m.handled)}>
                  {m.handled ? (
                    "Reopen"
                  ) : (
                    <>
                      <CheckCircle className="size-4" aria-hidden /> Mark handled
                    </>
                  )}
                </Button>
              </div>
              <p className="m-0 mt-3 text-sm leading-relaxed whitespace-pre-wrap text-ink-2">{m.message}</p>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
