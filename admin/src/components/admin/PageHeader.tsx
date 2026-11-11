import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <h1 className="m-0 font-display text-2xl font-bold tracking-tight sm:text-[28px]">{title}</h1>
        {description ? <p className="mt-1 mb-0 text-sm text-muted">{description}</p> : null}
      </div>
      {actions}
    </div>
  );
}

export function PrimaryButton({ children }: { children: ReactNode }) {
  return (
    <button
      type="button"
      className="flex h-11 items-center gap-2 rounded-xl bg-ink px-4 text-sm font-semibold text-white transition-colors hover:bg-ink-700 active:scale-[0.98]"
    >
      {children}
    </button>
  );
}
