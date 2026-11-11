"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { X } from "@phosphor-icons/react";

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center p-0 sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label={title}>
      <button type="button" aria-label="Close" onClick={onClose} className="ve-fade absolute inset-0 bg-black/55 backdrop-blur-[2px]" />
      <div className="ve-pop relative flex max-h-[92dvh] w-full max-w-[520px] flex-col rounded-t-3xl border border-line bg-surface shadow-card sm:rounded-3xl">
        <div className="flex items-start justify-between gap-3 border-b border-line-2 px-5 py-4 sm:px-6">
          <div>
            <h2 className="m-0 text-lg font-bold">{title}</h2>
            {description ? <p className="m-0 mt-0.5 text-[13px] text-muted">{description}</p> : null}
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="grid size-9 shrink-0 place-items-center rounded-xl text-muted hover:bg-surface-2 hover:text-ink">
            <X className="size-5" aria-hidden />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">{children}</div>
        {footer ? <div className="flex flex-wrap items-center justify-end gap-2 border-t border-line-2 px-5 py-4 sm:px-6">{footer}</div> : null}
      </div>
    </div>
  );
}
