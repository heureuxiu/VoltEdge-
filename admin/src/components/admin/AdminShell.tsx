"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Bell, List, MagnifyingGlass, SidebarSimple, X } from "@phosphor-icons/react";

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { cn } from "@/lib/utils";

/**
 * Fixed app frame: the sidebar and top bar never scroll away — only the
 * main content area scrolls. On small screens the sidebar becomes a drawer.
 */
export function AdminShell({ children }: { children: ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawerOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen]);

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-surface font-sans text-ink">
      {/* Desktop rail */}
      <aside
        className={cn(
          "hidden h-full shrink-0 transition-[width] duration-300 ease-[cubic-bezier(.2,.7,.2,1)] lg:block",
          collapsed ? "w-[76px]" : "w-[264px]",
        )}
      >
        <AdminSidebar collapsed={collapsed} />
      </aside>

      {/* Mobile drawer */}
      <div className={cn("fixed inset-0 z-50 lg:hidden", drawerOpen ? "visible" : "invisible delay-300")}>
        <button
          type="button"
          aria-label="Close menu"
          tabIndex={drawerOpen ? 0 : -1}
          onClick={() => setDrawerOpen(false)}
          className={cn(
            "absolute inset-0 bg-ink/50 transition-opacity duration-300",
            drawerOpen ? "opacity-100" : "opacity-0",
          )}
        />
        <aside
          aria-label="Menu"
          className={cn(
            "absolute inset-y-0 left-0 w-[284px] max-w-[85vw] transition-transform duration-300 ease-[cubic-bezier(.2,.7,.2,1)]",
            drawerOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <AdminSidebar onNavigate={() => setDrawerOpen(false)} />
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setDrawerOpen(false)}
            className="absolute top-3.5 right-3 grid size-9 place-items-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white"
          >
            <X className="size-5" aria-hidden />
          </button>
        </aside>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="z-30 flex h-16 shrink-0 items-center gap-3 border-b border-line bg-white px-4 sm:px-6">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setDrawerOpen(true)}
            className="grid size-10 place-items-center rounded-xl border border-line text-ink hover:bg-surface lg:hidden"
          >
            <List className="size-5" aria-hidden />
          </button>
          <button
            type="button"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-pressed={collapsed}
            onClick={() => setCollapsed((v) => !v)}
            className="hidden size-10 place-items-center rounded-xl border border-line text-ink hover:bg-surface lg:grid"
          >
            <SidebarSimple className="size-5" aria-hidden />
          </button>

          <label className="mx-auto hidden h-10 w-full max-w-[420px] items-center gap-2.5 rounded-xl bg-surface px-3.5 ring-1 ring-transparent focus-within:bg-white focus-within:ring-ink md:flex">
            <MagnifyingGlass className="size-[18px] text-muted" aria-hidden />
            <span className="sr-only">Search orders, products, customers</span>
            <input
              type="search"
              placeholder="Search orders, products, customers…"
              className="w-full border-0 bg-transparent text-sm outline-none placeholder:text-muted"
            />
          </label>

          <div className="ml-auto flex items-center gap-2 md:ml-0">
            <button
              type="button"
              aria-label="Search"
              className="grid size-10 place-items-center rounded-xl border border-line hover:bg-surface md:hidden"
            >
              <MagnifyingGlass className="size-5" aria-hidden />
            </button>
            <button
              type="button"
              aria-label="Notifications"
              className="relative grid size-10 place-items-center rounded-xl border border-line hover:bg-surface"
            >
              <Bell className="size-5" aria-hidden />
              <span aria-hidden className="absolute top-2 right-2.5 size-2 rounded-full border-2 border-white bg-repair" />
            </button>
            <span className="hidden size-10 place-items-center rounded-full bg-ink font-display text-sm font-bold text-white sm:grid">
              A
            </span>
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain scroll-smooth [scrollbar-width:thin]">
          <div className="mx-auto flex w-full max-w-[1320px] flex-col gap-5 px-4 py-5 pb-10 sm:px-6 sm:py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
