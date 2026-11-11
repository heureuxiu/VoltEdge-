import type { ReactNode } from "react";

export function EmptyState({ icon, title, text }: { icon: ReactNode; title: string; text?: string }) {
  return (
    <div className="grid place-items-center gap-2 px-4 py-12 text-center">
      <span className="grid size-12 place-items-center rounded-2xl bg-line-2 text-muted">{icon}</span>
      <b className="font-display text-base">{title}</b>
      {text ? <p className="m-0 max-w-xs text-[13px] text-muted">{text}</p> : null}
    </div>
  );
}
