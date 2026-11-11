"use client";

import { createContext, useCallback, useContext, useState } from "react";
import type { ReactNode } from "react";
import { CheckCircle, WarningCircle } from "@phosphor-icons/react";

interface Toast {
  id: number;
  text: string;
  tone: "ok" | "error";
}

const ToastCtx = createContext<(text: string, tone?: Toast["tone"]) => void>(() => {});
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((text: string, tone: Toast["tone"] = "ok") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, text, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed right-4 bottom-20 z-[80] flex flex-col gap-2 lg:bottom-6">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="ve-pop pointer-events-auto flex items-center gap-2.5 rounded-2xl border border-line bg-surface px-4 py-3 text-sm font-semibold shadow-card"
          >
            {t.tone === "ok" ? (
              <CheckCircle className="size-5 text-ok" weight="fill" aria-hidden />
            ) : (
              <WarningCircle className="size-5 text-danger" weight="fill" aria-hidden />
            )}
            {t.text}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
